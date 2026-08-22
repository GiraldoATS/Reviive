import pandas as pd
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.agents.permissions import IsN8nOrchestrator

from .model_loader import COLUMNAS_ENTRADA, obtener_pipeline
from .serializers import RecomendarProductoSerializer


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
