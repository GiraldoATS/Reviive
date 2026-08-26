"""Carga (una sola vez) el pipeline entrenado en Backend/ml/ y expone las
constantes que necesita el serializer (columnas de entrada, clases
válidas). No duplica esa lógica: importa directamente
Backend/ml/model_recomendacion.py, que es el mismo módulo que usa el
notebook académico y el script de entrenamiento.
"""

import sys
import threading
from pathlib import Path

from django.conf import settings

_ML_DIR = Path(settings.BASE_DIR).parent / "ml"
if str(_ML_DIR) not in sys.path:
    sys.path.insert(0, str(_ML_DIR))

from model_recomendacion import (  # noqa: E402
    CLASES,
    COLUMNAS_ENTRADA,
    fila_desde_objeto_memoria,
)

_RUTA_MODELO = _ML_DIR / "modelo_recomendacion.joblib"
RUTA_METRICAS = _ML_DIR / "reporte_metricas.json"
_lock = threading.Lock()
_pipeline = None


def obtener_pipeline():
    """Carga perezosa (lazy) del pipeline, cacheada en memoria del proceso."""
    global _pipeline
    if _pipeline is None:
        with _lock:
            if _pipeline is None:
                import joblib

                _pipeline = joblib.load(_RUTA_MODELO)
    return _pipeline


__all__ = [
    "obtener_pipeline",
    "CLASES",
    "COLUMNAS_ENTRADA",
    "fila_desde_objeto_memoria",
    "RUTA_METRICAS",
]
