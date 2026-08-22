from rest_framework import serializers


class RecomendarProductoSerializer(serializers.Serializer):
    """Las 9 variables de entrada del clasificador (ver Backend/ml/model_recomendacion.py).

    Los valores no se restringen a un ChoiceField cerrado a propósito: el
    pipeline usa OneHotEncoder(handle_unknown="ignore"), así que una
    categoría nueva/desconocida simplemente no aporta señal en vez de
    romper la petición — más tolerante para un modelo que seguirá
    evolucionando con datos reales.
    """

    tipo_objeto = serializers.CharField()
    material = serializers.CharField(required=False, default="mixto")
    estado = serializers.CharField(required=False, default="regular")
    uso_deseado = serializers.CharField(required=False, default="conservar")
    presupuesto = serializers.IntegerField(required=False, default=95000, min_value=0)
    cantidad = serializers.IntegerField(required=False, default=1, min_value=1)
    transformacion = serializers.CharField(required=False, default="leve")
    ciudad = serializers.CharField(required=False, default="Bogota")
    preferencia = serializers.ChoiceField(
        choices=["fisico", "digital"], required=False, default="fisico"
    )
