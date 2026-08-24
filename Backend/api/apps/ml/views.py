import json
from collections import Counter

import pandas as pd
from rest_framework.permissions import AllowAny, BasePermission
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.agents.permissions import IsN8nOrchestrator
from apps.catalog.models import Producto
from apps.memories.models import ObjetoMemoria

from .model_loader import (
    COLUMNAS_ENTRADA,
    RUTA_METRICAS,
    fila_desde_objeto_memoria,
    obtener_pipeline,
)
from .serializers import RecomendarProductoSerializer


class EsSupervisorOAdmin(BasePermission):
    def has_permission(self, request, view) -> bool:
        user = request.user
        return user.is_authenticated and (
            user.is_staff or user.rol in {"supervisor_ia", "administrador", "superadministrador"}
        )


class RecomendarProductoView(APIView):
    """POST /api/v1/ml/recomendar-producto

    Clasificador entrenado (árbol de decisión, ver Backend/ml/) que da una
    señal adicional real al agente de Recomendación de n8n, además de la
    propuesta del LLM. Misma autenticación (HMAC) que el resto de
    endpoints agente->Django, porque quien llama esto es el orquestador de
    n8n, no un usuario final directamente.
    """

    permission_classes = [IsN8nOrchestrator]

    def post(self, request: Request) -> Response:
        payload = RecomendarProductoSerializer(data=request.data)
        payload.is_valid(raise_exception=True)
        datos = payload.validated_data

        pipeline = obtener_pipeline()
        entrada = pd.DataFrame([{col: datos[col] for col in COLUMNAS_ENTRADA}])

        prediccion = pipeline.predict(entrada)[0]
        probabilidades = pipeline.predict_proba(entrada)[0]
        distribucion = {
            clase: round(float(prob), 4)
            for clase, prob in sorted(
                zip(pipeline.classes_, probabilidades), key=lambda x: -x[1]
            )
        }

        return Response(
            {
                "producto_recomendado": prediccion,
                "probabilidad": distribucion[prediccion],
                "distribucion": distribucion,
            }
        )


class MasExploradosView(APIView):
    """GET /api/v1/ml/mas-explorados — vitrina pública del catálogo.

    En vez de una lista de "tendencias" inventada, corre el mismo
    clasificador de RecomendarProductoView sobre los objetos reales que los
    clientes ya registraron (ObjetoMemoria) y muestra los productos que el
    modelo más recomienda para esos casos reales. Si todavía no hay
    objetos registrados, devuelve una lista vacía — no rellena con datos
    falsos.
    """

    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        objetos = ObjetoMemoria.objects.select_related("recuerdo").order_by("-id")[:200]
        if not objetos:
            return Response([])

        pipeline = obtener_pipeline()
        conteos = Counter()
        for objeto in objetos:
            fila = fila_desde_objeto_memoria(
                {
                    "tipo": objeto.tipo,
                    "material": objeto.material,
                    "estado": objeto.estado,
                    "nivel_transformacion": objeto.nivel_transformacion,
                }
            )
            entrada = pd.DataFrame([{col: fila[col] for col in COLUMNAS_ENTRADA}])
            prediccion = pipeline.predict(entrada)[0]
            conteos[prediccion] += 1

        productos_por_nombre = {p.nombre: p for p in Producto.objects.filter(activo=True)}
        resultado = []
        for nombre, total in conteos.most_common(10):
            producto = productos_por_nombre.get(nombre)
            if not producto:
                continue
            resultado.append(
                {
                    "id": producto.id,
                    "nombre": producto.nombre,
                    "categoria": producto.categoria,
                    "icono": producto.icono,
                    "imagen_url": producto.imagen_url,
                    "veces_recomendado": total,
                }
            )
        return Response(resultado)


class MetricasModeloView(APIView):
    """GET /api/v1/ml/metricas — métricas reales del entrenamiento del
    clasificador (ver Backend/ml/entrenar_modelo.py), para el panel de
    supervisión. Lee el reporte que el propio script de entrenamiento
    genera (accuracy/precision/recall/f1 por modelo comparado, matriz de
    confusión) en vez de mostrar cifras inventadas."""

    permission_classes = [EsSupervisorOAdmin]

    def get(self, request: Request) -> Response:
        if not RUTA_METRICAS.exists():
            return Response(
                {"detail": "Todavía no se ha entrenado el modelo (falta reporte_metricas.json)."},
                status=404,
            )
        with open(RUTA_METRICAS, encoding="utf-8") as f:
            return Response(json.load(f))
