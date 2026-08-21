from rest_framework.throttling import UserRateThrottle


class MensajePorUsuarioThrottle(UserRateThrottle):
    """Limita cuántos mensajes puede enviar un mismo usuario al chat por
    minuto. Cada mensaje dispara una ejecución de agente (costo real de
    LLM), así que una ráfaga sin control no solo degrada la experiencia,
    también es un vector de costo/abuso.
    """

    scope = "mensajes_chat"
