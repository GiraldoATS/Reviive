from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.agents.permissions import IsN8nOrchestrator

from .models import DocumentoProveedor, Proveedor
from .serializers import (
    DiaBloqueadoProveedorSerializer,
    DocumentoProveedorSerializer,
    MatchRequestSerializer,
    ProveedorSerializer,
)


STAFF_ROLES = {"administrador", "superadministrador"}


class EsStaffAdministrativo(BasePermission):
    def has_permission(self, request, view) -> bool:
        user = request.user
        return user.is_authenticated and (user.is_staff or user.rol in STAFF_ROLES)


class ProveedorViewSet(viewsets.ReadOnlyModelViewSet):
    """/api/v1/providers — sólo proveedores validados son visibles (RN-05),
    salvo para staff administrativo, que necesita ver también a los
    pendientes/suspendidos para poder gestionarlos."""

    serializer_class = ProveedorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.rol in STAFF_ROLES:
            return Proveedor.objects.all()
        return Proveedor.objects.filter(estado_validacion="validado")

    @action(detail=True, methods=["get"], permission_classes=[EsStaffAdministrativo])
    def documentos(self, request: Request, pk=None) -> Response:
        proveedor = self.get_object()
        return Response(
            DocumentoProveedorSerializer(proveedor.documentos.all(), many=True).data
        )

    @action(detail=True, methods=["post"], url_path="validar", permission_classes=[EsStaffAdministrativo])
    def validar(self, request: Request, pk=None) -> Response:
        proveedor = self.get_object()
        accion = request.data.get("accion")
        if accion == "aprobar":
            proveedor.estado_validacion = Proveedor.EstadoValidacion.VALIDADO
        elif accion == "rechazar":
            proveedor.estado_validacion = Proveedor.EstadoValidacion.SUSPENDIDO
        else:
            raise ValidationError({"accion": "Debe ser 'aprobar' o 'rechazar'."})
        proveedor.save(update_fields=["estado_validacion"])
        return Response(ProveedorSerializer(proveedor).data)

    @action(
        detail=True,
        methods=["post"],
        url_path=r"documentos/(?P<doc_id>[^/.]+)/revisar",
        permission_classes=[EsStaffAdministrativo],
    )
    def revisar_documento(self, request: Request, pk=None, doc_id=None) -> Response:
        proveedor = self.get_object()
        documento = proveedor.documentos.filter(pk=doc_id).first()
        if documento is None:
            raise NotFound("Documento no encontrado.")
        nuevo_estado = request.data.get("estado_revision")
        if nuevo_estado not in {choice[0] for choice in DocumentoProveedor.EstadoRevision.choices}:
            raise ValidationError({"estado_revision": "Estado inválido."})
        documento.estado_revision = nuevo_estado
        documento.save(update_fields=["estado_revision"])
        return Response(DocumentoProveedorSerializer(documento).data)


class ProveedorMeView(APIView):
    """GET /api/v1/providers/me — el proveedor autenticado ve su propio taller,
    esté o no validado (a diferencia del listado público, que solo muestra
    proveedores ya validados)."""

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        proveedor = Proveedor.objects.filter(usuario=request.user).first()
        if proveedor is None:
            raise NotFound("El usuario autenticado no tiene un perfil de proveedor.")
        return Response(ProveedorSerializer(proveedor).data)

    def patch(self, request: Request) -> Response:
        proveedor = Proveedor.objects.filter(usuario=request.user).first()
        if proveedor is None:
            raise NotFound("El usuario autenticado no tiene un perfil de proveedor.")
        serializer = ProveedorSerializer(proveedor, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class DiasBloqueadosView(APIView):
    """/api/v1/providers/me/dias-bloqueados — calendario real de
    disponibilidad del proveedor autenticado."""

    permission_classes = [IsAuthenticated]

    def _proveedor(self, request: Request) -> Proveedor:
        proveedor = Proveedor.objects.filter(usuario=request.user).first()
        if proveedor is None:
            raise NotFound("El usuario autenticado no tiene un perfil de proveedor.")
        return proveedor

    def get(self, request: Request) -> Response:
        proveedor = self._proveedor(request)
        return Response(
            DiaBloqueadoProveedorSerializer(proveedor.dias_bloqueados.all(), many=True).data
        )

    def post(self, request: Request) -> Response:
        proveedor = self._proveedor(request)
        serializer = DiaBloqueadoProveedorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(proveedor=proveedor)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request: Request) -> Response:
        proveedor = self._proveedor(request)
        fecha = request.query_params.get("fecha")
        proveedor.dias_bloqueados.filter(fecha=fecha).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProviderMatchView(APIView):
    """POST /api/v1/providers/match — sugiere proveedores para un producto/ciudad.

    La llama tanto un usuario autenticado (flujo manual del admin en
    /admin/cotizaciones/nueva) como n8n con firma HMAC (agente Cotizacion,
    que no tiene un usuario logueado detrás)."""

    permission_classes = [IsAuthenticated | IsN8nOrchestrator]

    def post(self, request: Request) -> Response:
        payload = MatchRequestSerializer(data=request.data)
        payload.is_valid(raise_exception=True)
        producto_id = payload.validated_data["producto_id"]
        ciudad = payload.validated_data.get("ciudad")

        candidatos = Proveedor.objects.filter(
            estado_validacion="validado", capacidades__producto_id=producto_id
        )
        if ciudad:
            candidatos = candidatos.filter(ciudad__iexact=ciudad)
        candidatos = candidatos.order_by("-calificacion").distinct()

        return Response(ProveedorSerializer(candidatos, many=True).data)
