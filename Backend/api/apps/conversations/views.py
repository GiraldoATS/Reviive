from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Conversacion
from .serializers import ConversacionSerializer, MensajeSerializer


class ConversacionViewSet(viewsets.ModelViewSet):
    """/api/v1/conversations"""

    serializer_class = ConversacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.rol in {"supervisor_ia", "administrador", "superadministrador"}:
            return Conversacion.objects.all()
        return Conversacion.objects.filter(usuario=user)


class ConversacionMensajesView(APIView):
    """/api/v1/conversations/{id}/messages"""

    permission_classes = [IsAuthenticated]

    def get(self, request: Request, conversacion_id) -> Response:
        conversacion = Conversacion.objects.get(pk=conversacion_id)
        return Response(MensajeSerializer(conversacion.mensajes.all(), many=True).data)

    def post(self, request: Request, conversacion_id) -> Response:
        conversacion = Conversacion.objects.get(pk=conversacion_id)
        serializer = MensajeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(conversacion=conversacion)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
