from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from .models import EjemploDataset
from .serializers import EjemploDatasetSerializer


class EsSupervisorIA(BasePermission):
    message = "Sólo un supervisor de IA puede aprobar ejemplos de dataset (RN-11)."

    def has_permission(self, request, view) -> bool:
        return request.user.is_authenticated and request.user.rol in {
            "supervisor_ia",
            "administrador",
            "superadministrador",
        }


class EjemploDatasetViewSet(viewsets.ReadOnlyModelViewSet):
    """/api/v1/dataset-examples y /api/v1/dataset-examples/{id}/approve"""

    serializer_class = EjemploDatasetSerializer
    permission_classes = [IsAuthenticated]
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
