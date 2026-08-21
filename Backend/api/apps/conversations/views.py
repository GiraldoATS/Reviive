from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Conversacion, Mensaje
from .serializers import ConversacionSerializer, MensajeSerializer
from .throttles import MensajePorUsuarioThrottle

STAFF_ROLES = {"supervisor_ia", "administrador", "superadministrador"}


class ConversacionViewSet(viewsets.ModelViewSet):
    """/api/v1/conversations"""

    serializer_class = ConversacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.rol in STAFF_ROLES:
            return Conversacion.objects.all()
        return Conversacion.objects.filter(usuario=user)


class ConversacionMensajesView(APIView):
    """/api/v1/conversations/{id}/messages"""

    permission_classes = [IsAuthenticated]
    throttle_classes = [MensajePorUsuarioThrottle]

    def get_throttles(self):
        # Sólo se limita el envío de mensajes nuevos (cada uno dispara un
        # agente); leer el historial no debe estar restringido igual.
        if self.request.method != "POST":
            return []
        return super().get_throttles()

    def _get_conversacion(self, request: Request, conversacion_id) -> Conversacion:
        conversacion = get_object_or_404(Conversacion, pk=conversacion_id)
        user = request.user
        es_staff = user.is_staff or user.rol in STAFF_ROLES
        if not es_staff and conversacion.usuario_id != user.id:
            raise PermissionDenied("No tienes acceso a esta conversación.")
        return conversacion

    def get(self, request: Request, conversacion_id) -> Response:
        conversacion = self._get_conversacion(request, conversacion_id)
        return Response(MensajeSerializer(conversacion.mensajes.all(), many=True).data)

    def post(self, request: Request, conversacion_id) -> Response:
        conversacion = self._get_conversacion(request, conversacion_id)
        user = request.user
        es_staff = user.is_staff or user.rol in STAFF_ROLES

        data = request.data.copy()
        # El rol del mensaje no es de libre elección del cliente: evita que un
        # usuario final se haga pasar por Alma o por un agente humano.
        data["rol"] = data.get("rol", Mensaje.Rol.AGENTE_HUMANO) if es_staff else Mensaje.Rol.USUARIO

        serializer = MensajeSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save(conversacion=conversacion)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
