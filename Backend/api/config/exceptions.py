"""Manejador de excepciones global de DRF.

Antes de esto, cada tipo de error llegaba al frontend con una forma
distinta: un ValidationError de un serializer devuelve {"campo": ["..."]}
plano, un 404/403 devuelve {"detail": "..."}, y un endpoint que construía
su propia Response de error a mano podía inventar cualquier otra forma.
El frontend tenía que adivinar la forma en cada pantalla.

Con esto TODO error de la API (sin excepción) llega como:
    {"error": {"codigo": str, "mensaje": str, "detalles": dict|list|null}}
"""

import logging

from django.conf import settings
from django.core.exceptions import PermissionDenied as DjangoPermissionDenied
from django.http import Http404
from rest_framework import exceptions as drf_exceptions
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler

logger = logging.getLogger(__name__)

# DRF traduce Http404/PermissionDenied de Django a sus propias excepciones
# INTERNAMENTE dentro de su exception_handler, pero esa traduccion no se
# refleja en el objeto `exc` que recibe este archivo (sigue siendo el
# Http404/PermissionDenied original) -- por eso se revisan aparte, antes
# de las excepciones nativas de DRF.
_CODIGOS_POR_EXCEPCION = [
    (Http404, "no_encontrado"),
    (DjangoPermissionDenied, "permiso_denegado"),
    (drf_exceptions.ValidationError, "validacion"),
    (drf_exceptions.AuthenticationFailed, "no_autenticado"),
    (drf_exceptions.NotAuthenticated, "no_autenticado"),
    (drf_exceptions.PermissionDenied, "permiso_denegado"),
    (drf_exceptions.NotFound, "no_encontrado"),
    (drf_exceptions.MethodNotAllowed, "metodo_no_permitido"),
    (drf_exceptions.NotAcceptable, "formato_no_aceptado"),
    (drf_exceptions.UnsupportedMediaType, "tipo_contenido_no_soportado"),
    (drf_exceptions.Throttled, "limite_excedido"),
    (drf_exceptions.ParseError, "peticion_invalida"),
]

# Respaldo cuando `exc` no calza con ninguna clase de arriba (por ejemplo,
# alguna excepcion de un paquete externo que DRF sepa convertir pero que
# esta lista no conozca): el status code que DRF ya calculo es confiable
# aunque el tipo de `exc` no lo sea.
_CODIGOS_POR_STATUS = {
    400: "peticion_invalida",
    401: "no_autenticado",
    403: "permiso_denegado",
    404: "no_encontrado",
    405: "metodo_no_permitido",
    406: "formato_no_aceptado",
    415: "tipo_contenido_no_soportado",
    429: "limite_excedido",
}


def _codigo_para(exc: Exception, status_code: int) -> str:
    for clase, codigo in _CODIGOS_POR_EXCEPCION:
        if isinstance(exc, clase):
            return codigo
    return _CODIGOS_POR_STATUS.get(status_code, "error")


def _mensaje_legible(detail) -> str:
    """El 'detail' de una respuesta de error de DRF puede ser un string,
    una lista de strings, el dict {"detail": "..."} que usan NotFound/
    PermissionDenied/ParseError/etc, o (en un ValidationError de un
    serializer) un dict anidado {campo: [errores]}. Se aplana a UN mensaje
    legible para mostrar directo en la UI; el detalle estructurado
    completo sigue disponible en 'detalles' para quien quiera resaltar
    campos especificos de un formulario.
    """
    if isinstance(detail, str):
        return detail
    if isinstance(detail, list):
        return " ".join(str(item) for item in detail)
    if isinstance(detail, dict):
        # Forma no-campo de DRF: {"detail": "mensaje unico"} -- no es un
        # error por campo, es EL mensaje.
        if set(detail.keys()) <= {"detail"} and isinstance(detail.get("detail"), str):
            return detail["detail"]
        partes = []
        for campo, errores in detail.items():
            texto = " ".join(str(e) for e in errores) if isinstance(errores, list) else str(errores)
            partes.append(texto if campo in ("detail", "non_field_errors") else f"{campo}: {texto}")
        return " ".join(partes) if partes else "Error de validación."
    return str(detail)


def manejador_excepciones(exc, context):
    response = drf_exception_handler(exc, context)

    if response is None:
        # Excepcion que DRF no reconoce (bug real, error de base de datos,
        # etc.): no se debe exponer el detalle interno al cliente fuera de
        # DEBUG, pero sí queda en el log del servidor para diagnosticar.
        request = context.get("request")
        logger.exception(
            "Error no controlado en %s", getattr(request, "path", "?"), exc_info=exc
        )
        mensaje = str(exc) if settings.DEBUG else "Ocurrió un error inesperado. Intenta de nuevo."
        return Response(
            {"error": {"codigo": "error_interno", "mensaje": mensaje, "detalles": None}},
            status=500,
        )

    # response.data es lo que DRF YA decidio enviar (con Http404/
    # PermissionDenied ya traducidos a la forma correcta) -- mas confiable
    # que leer exc.detail directamente, que en esos dos casos no existe.
    detail = response.data
    es_detail_unico = isinstance(detail, dict) and set(detail.keys()) <= {"detail"}
    if es_detail_unico:
        detalles = None  # no hay campos que resaltar, es un mensaje unico
    elif isinstance(detail, (dict, list)):
        detalles = detail
    else:
        detalles = None

    payload = {
        "error": {
            "codigo": _codigo_para(exc, response.status_code),
            "mensaje": _mensaje_legible(detail),
            "detalles": detalles,
        }
    }

    # Throttled trae 'wait' (segundos): se expone aparte para que el
    # frontend pueda mostrar "intenta en X segundos" sin parsear el texto.
    if isinstance(exc, drf_exceptions.Throttled) and exc.wait is not None:
        payload["error"]["reintentar_en_segundos"] = int(exc.wait)

    response.data = payload
    return response
