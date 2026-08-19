from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import UsuarioSerializer


class MeView(APIView):
    """GET /api/v1/users/me — perfil del usuario autenticado."""

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)
