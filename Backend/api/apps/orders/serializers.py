from rest_framework import serializers

from .models import EventoPedido, Envio, MensajePedido, Pedido, Reclamacion, Resena


class EventoPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventoPedido
        fields = [
            "id",
            "estado",
            "fecha",
            "descripcion",
            "evidencia",
            "evidencias_base64",
            "responsable",
        ]
        read_only_fields = ["id", "fecha", "responsable"]

    def validate(self, attrs):
        if attrs.get("estado") == Pedido.Estado.RECIBIDO:
            if not attrs.get("evidencia") and not attrs.get("evidencias_base64"):
                raise serializers.ValidationError(
                    {"evidencia": "La recepción del objeto exige evidencia fotográfica (RN-06)."}
                )
            if not attrs.get("descripcion"):
                raise serializers.ValidationError(
                    {"descripcion": "La recepción del objeto exige describir su condición (RN-06)."}
                )
        return attrs

    def create(self, validated_data):
        validated_data["responsable"] = self.context["request"].user
        return super().create(validated_data)


class ResenaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resena
        fields = ["id", "pedido", "puntaje", "comentario", "creado_en"]
        read_only_fields = ["id", "pedido", "creado_en"]

    def validate_puntaje(self, valor):
        if not 1 <= valor <= 5:
            raise serializers.ValidationError("El puntaje debe estar entre 1 y 5.")
        return valor


class MensajePedidoSerializer(serializers.ModelSerializer):
    autor_nombre = serializers.SerializerMethodField()

    class Meta:
        model = MensajePedido
        fields = ["id", "pedido", "autor", "autor_nombre", "contenido", "creado_en"]
        read_only_fields = ["id", "pedido", "autor", "creado_en"]

    def get_autor_nombre(self, obj: MensajePedido) -> str:
        perfil = getattr(obj.autor, "perfil", None)
        if perfil:
            return perfil.nombre
        proveedor = getattr(obj.autor, "proveedor", None)
        return proveedor.nombre_taller if proveedor else obj.autor.email


class EnvioSerializer(serializers.ModelSerializer):
    pedido_codigo = serializers.CharField(source="pedido.codigo", read_only=True)
    cliente_nombre = serializers.SerializerMethodField()
    ciudad_destino = serializers.SerializerMethodField()

    class Meta:
        model = Envio
        fields = [
            "id",
            "pedido",
            "pedido_codigo",
            "cliente_nombre",
            "ciudad_destino",
            "transportadora",
            "numero_guia",
            "estado",
            "fecha_estimada",
            "creado_en",
        ]
        read_only_fields = ["id", "pedido", "creado_en"]

    def get_cliente_nombre(self, obj: Envio) -> str:
        perfil = getattr(obj.pedido.cliente, "perfil", None)
        return perfil.nombre if perfil else obj.pedido.cliente.email

    def get_ciudad_destino(self, obj: Envio) -> str:
        perfil = getattr(obj.pedido.cliente, "perfil", None)
        return perfil.ciudad if perfil else ""


class ReclamacionSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.SerializerMethodField()
    pedido_codigo = serializers.CharField(source="pedido.codigo", read_only=True, default="")

    class Meta:
        model = Reclamacion
        fields = [
            "id",
            "cliente",
            "cliente_nombre",
            "pedido",
            "pedido_codigo",
            "tipo",
            "descripcion",
            "estado",
            "prioridad",
            "respuesta_staff",
            "creado_en",
            "actualizado_en",
        ]
        read_only_fields = ["id", "cliente", "creado_en", "actualizado_en"]

    def get_cliente_nombre(self, obj: Reclamacion) -> str:
        perfil = getattr(obj.cliente, "perfil", None)
        return perfil.nombre if perfil else obj.cliente.email


class PedidoSerializer(serializers.ModelSerializer):
    eventos = EventoPedidoSerializer(many=True, read_only=True)
    # Evita que el frontend tenga que encadenar quotations -> memories/providers
    # solo para mostrar "qué objeto es" y "qué taller lo tiene".
    resumen = serializers.SerializerMethodField()
    resena = ResenaSerializer(read_only=True)

    class Meta:
        model = Pedido
        fields = [
            "id",
            "codigo",
            "cotizacion",
            "resumen",
            "estado",
            "total",
            "eventos",
            "resena",
            "creado_en",
        ]
        read_only_fields = ["id", "codigo", "estado", "total", "creado_en"]

    def get_resumen(self, obj: Pedido) -> dict:
        recuerdo = obj.cotizacion.recuerdo
        primer_objeto = recuerdo.objetos.first()
        memorial = getattr(recuerdo, "memorial", None)
        perfil = getattr(recuerdo.cliente, "perfil", None)
        ultimo_evento = obj.eventos.last()
        resp_perfil = getattr(ultimo_evento.responsable, "perfil", None) if ultimo_evento and ultimo_evento.responsable else None
        return {
            "recuerdo_id": str(recuerdo.id),
            "objeto": primer_objeto.tipo if primer_objeto else "",
            "historia": recuerdo.historia,
            "cliente_nombre": perfil.nombre if perfil else recuerdo.cliente.email,
            "proveedor": obj.cotizacion.proveedor.nombre_taller,
            "memorial_slug": memorial.slug if memorial else None,
            "ultimo_evento": {
                "estado": ultimo_evento.estado,
                "fecha": ultimo_evento.fecha,
                "responsable": resp_perfil.nombre if resp_perfil else (
                    ultimo_evento.responsable.email if ultimo_evento.responsable else ""
                ),
            } if ultimo_evento else None,
        }
