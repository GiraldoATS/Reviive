from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.agents.models import EjecucionAgente
from apps.conversations.models import Conversacion

from .models import CasoPrueba, CorreccionRespuesta, EjemploDataset, Evaluacion, FuenteConocimiento
from .serializers import (
    CasoPruebaSerializer,
    CorreccionRespuestaSerializer,
    EjemploDatasetSerializer,
    EvaluacionSerializer,
    FuenteConocimientoSerializer,
)


class EsSupervisorIA(BasePermission):
    message = "Sólo un supervisor de IA puede aprobar ejemplos de dataset (RN-11)."

    def has_permission(self, request, view) -> bool:
        return request.user.is_authenticated and request.user.rol in {
            "supervisor_ia",
            "administrador",
            "superadministrador",
        }


class EjemploDatasetViewSet(viewsets.ReadOnlyModelViewSet):
    """/api/v1/dataset-examples y /api/v1/dataset-examples/{id}/approve

    Herramienta interna de curación de datos: sólo supervisor_ia/staff,
    nunca clientes o proveedores (podría exponer conversaciones ajenas).
    """

    serializer_class = EjemploDatasetSerializer
    permission_classes = [EsSupervisorIA]
    queryset = EjemploDataset.objects.all()

    @action(detail=True, methods=["post"], permission_classes=[EsSupervisorIA])
    def approve(self, request: Request, pk=None) -> Response:
        ejemplo = self.get_object()
        if not ejemplo.anonimizado:
            return Response(
                {"detail": "No se puede aprobar: falta anonimizar (RN-09)."}, status=400
            )
        ejemplo.estado_revision = EjemploDataset.EstadoRevision.APROBADO
        ejemplo.aprobado_por = request.user
        ejemplo.save(update_fields=["estado_revision", "aprobado_por"])
        return Response(EjemploDatasetSerializer(ejemplo).data)


class EvaluacionViewSet(viewsets.ReadOnlyModelViewSet):
    """/api/v1/evaluations — sólo supervisor_ia/staff, califica ejecuciones de agentes."""

    serializer_class = EvaluacionSerializer
    permission_classes = [EsSupervisorIA]
    queryset = Evaluacion.objects.select_related("ejecucion").order_by("-creado_en")


class CasoPruebaViewSet(viewsets.ModelViewSet):
    """/api/v1/test-cases — RN-12, casos de prueba de regresión de agentes."""

    serializer_class = CasoPruebaSerializer
    permission_classes = [EsSupervisorIA]
    queryset = CasoPrueba.objects.order_by("-creado_en")

    def perform_update(self, serializer):
        if "resultado" in serializer.validated_data:
            serializer.save(revisado_por=self.request.user)
        else:
            serializer.save()


class FuenteConocimientoViewSet(viewsets.ModelViewSet):
    """/api/v1/knowledge-sources — base de conocimiento real de los agentes."""

    serializer_class = FuenteConocimientoSerializer
    permission_classes = [EsSupervisorIA]
    queryset = FuenteConocimiento.objects.order_by("nombre")


class CorreccionRespuestaViewSet(viewsets.ModelViewSet):
    """/api/v1/corrections — revisión y corrección de una respuesta real
    de un agente (RN-11: sólo entra al dataset con aprobación)."""

    serializer_class = CorreccionRespuestaSerializer
    permission_classes = [EsSupervisorIA]
    queryset = CorreccionRespuesta.objects.select_related("ejecucion").order_by("-creado_en")

    def perform_create(self, serializer):
        serializer.save(revisado_por=self.request.user)

    def perform_update(self, serializer):
        instancia = serializer.save(revisado_por=self.request.user)
        # RN-11: aprobar una correccion crea el ejemplo de dataset real que
        # supervision/dataset ya sabe mostrar y aprobar/rechazar.
        if instancia.decision == CorreccionRespuesta.Decision.APROBAR_PARA_DATASET and instancia.ejecucion.conversacion_id:
            EjemploDataset.objects.get_or_create(
                conversacion=instancia.ejecucion.conversacion,
                defaults={"etiqueta": instancia.categoria_error, "anonimizado": False},
            )


class EjecucionesPendientesRevisionView(APIView):
    """GET /api/v1/corrections/pendientes — ejecuciones reales marcadas
    por el Evaluador (Evaluacion.requiere_revision=True) que todavía no
    tienen una corrección registrada."""

    permission_classes = [EsSupervisorIA]

    def get(self, request: Request) -> Response:
        ya_corregidas = CorreccionRespuesta.objects.values_list("ejecucion_id", flat=True)
        evaluaciones = (
            Evaluacion.objects.filter(requiere_revision=True)
            .exclude(ejecucion_id__in=ya_corregidas)
            .select_related("ejecucion")
            .order_by("-creado_en")
        )
        return Response(
            [
                {
                    "ejecucion": str(ev.ejecucion_id),
                    "agente_display": ev.ejecucion.get_agente_display(),
                    "reply": ev.ejecucion.reply,
                    "puntaje": ev.puntaje,
                    "creado_en": ev.creado_en,
                }
                for ev in evaluaciones
            ]
        )


class ResumenSupervisionView(APIView):
    """GET /api/v1/supervision/resumen — para el dashboard de supervisión
    (antes 100% inventado). Reutiliza Conversacion + EjecucionAgente, sin
    modelo nuevo."""

    permission_classes = [EsSupervisorIA]

    def get(self, request: Request) -> Response:
        criticas = (
            Conversacion.objects.filter(
                ejecuciones_agente__evaluation_flags__contains="riesgo_emocional"
            )
            .distinct()
            .count()
        )
        return Response(
            {
                "abiertas": Conversacion.objects.filter(estado=Conversacion.Estado.ACTIVA).count(),
                "pendientes": Conversacion.objects.filter(estado=Conversacion.Estado.PENDIENTE).count(),
                "criticas": criticas,
                "corregidas": EjemploDataset.objects.filter(
                    estado_revision=EjemploDataset.EstadoRevision.APROBADO
                ).count(),
                "ejecuciones_totales": EjecucionAgente.objects.count(),
            }
        )


class AuditoriaView(APIView):
    """GET /api/v1/supervision/auditoria — traza real de eventos, unida a
    partir de lo que ya existe (EventoPedido + EjecucionAgente): no hay
    modelo de auditoría separado, cada escritura de negocio ya queda
    registrada en su propio modelo con actor+fecha (RN-07)."""

    permission_classes = [EsSupervisorIA]

    def get(self, request: Request) -> Response:
        from apps.orders.models import EventoPedido

        eventos = []
        for ev in EventoPedido.objects.select_related("pedido", "responsable__perfil").order_by("-fecha")[:50]:
            perfil = getattr(ev.responsable, "perfil", None)
            eventos.append(
                {
                    "tipo": "pedido",
                    "actor": perfil.nombre if perfil else (ev.responsable.email if ev.responsable else "Sistema"),
                    "evento": f"Pedido {ev.pedido.codigo} → {ev.get_estado_display()}",
                    "fecha": ev.fecha,
                    "referencia": str(ev.pedido_id),
                }
            )
        for run in EjecucionAgente.objects.exclude(completado_en=None).order_by("-completado_en")[:50]:
            eventos.append(
                {
                    "tipo": "agente",
                    "actor": f"Agente {run.get_agente_display()}",
                    "evento": f"Ejecución {run.estado}" + (" · requiere revisión" if run.evaluation_flags else ""),
                    "fecha": run.completado_en,
                    "referencia": str(run.run_id),
                }
            )
        eventos.sort(key=lambda e: e["fecha"], reverse=True)
        return Response(eventos[:50])


class AgentesResumenView(APIView):
    """GET /api/v1/supervision/agentes — desempeño real por agente
    (antes 100% inventado: nombres de agentes que ni existían)."""

    permission_classes = [EsSupervisorIA]

    def get(self, request: Request) -> Response:
        from django.db.models import Avg, Count

        agregados = (
            EjecucionAgente.objects.values("agente")
            .annotate(
                total_ejecuciones=Count("run_id"),
                puntaje_promedio=Avg("evaluation_score"),
                latencia_promedio_ms=Avg("latencia_ms"),
            )
            .order_by("-total_ejecuciones")
        )
        por_agente = {a["agente"]: a for a in agregados}

        resultado = []
        for value, label in EjecucionAgente.Agente.choices:
            datos = por_agente.get(value, {})
            resultado.append(
                {
                    "agente": value,
                    "agente_display": label,
                    "total_ejecuciones": datos.get("total_ejecuciones", 0),
                    "puntaje_promedio": round(datos["puntaje_promedio"], 3)
                    if datos.get("puntaje_promedio") is not None
                    else None,
                    "latencia_promedio_ms": round(datos["latencia_promedio_ms"])
                    if datos.get("latencia_promedio_ms") is not None
                    else None,
                }
            )
        return Response(resultado)
