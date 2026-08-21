import hashlib
import hmac

from django.conf import settings
from rest_framework.permissions import BasePermission


class IsN8nOrchestrator(BasePermission):
    """Valida que la petición venga de n8n mediante firma HMAC-SHA256.

    n8n firma el cuerpo crudo de la petición con N8N_WEBHOOK_SECRET y la
    envía en el header X-Reviive-Signature.
    """

    message = "Firma HMAC inválida o ausente."

    def has_permission(self, request, view) -> bool:
        signature = request.headers.get("X-Reviive-Signature", "")
        expected = hmac.new(
            settings.N8N_WEBHOOK_SECRET.encode(),
            request.body,
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(signature, expected)
