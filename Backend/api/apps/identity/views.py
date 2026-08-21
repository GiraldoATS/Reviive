from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegistroSerializer, UsuarioSerializer


class MeView(APIView):
    """GET /api/v1/users/me — perfil del usuario autenticado."""

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)


class RegistroView(APIView):
    """POST /api/v1/auth/register — crea una cuenta de cliente o proveedor.

    Los roles internos (administrador, supervisor_ia, etc.) no son
    autoregistrables: sólo se crean desde el admin o `createsuperuser`.
    """

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = RegistroSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        usuario = serializer.save()

        refresh = RefreshToken.for_user(usuario)
        return Response(
            {
                "usuario": UsuarioSerializer(usuario).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )
