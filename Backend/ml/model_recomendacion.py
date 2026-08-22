"""Clasificador de producto recomendado (seccion 15.1 del documento de
definicion estrategica): dado un objeto/recuerdo descrito por el cliente,
predice cual de los 8 servicios del catalogo real de Reviive es el mas
adecuado.

Este modulo es el "core" reutilizado por tres cosas:
  1. `entrenar.py` -- entrena el modelo y guarda el artefacto (.joblib).
  2. `entrenamiento_modelo_recomendacion.ipynb` -- el entregable academico
     (dataset, metricas, visualizacion), importa este archivo.
  3. `Backend/api/apps/ml/views.py` -- la API en vivo que usa el modelo ya
     entrenado para dar una senal real al agente de Recomendacion.

No depende de Django ni de nada del backend: es deliberadamente un modulo
Python plano para que el notebook pueda ejecutarlo tal cual en Jupyter o
Colab (basta con subir este archivo junto al notebook).
"""

from __future__ import annotations

import random

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

# Los 8 productos reales del catalogo (ver
# Backend/api/apps/catalog/management/commands/seed_demo.py) -- son
# exactamente las "clases iniciales" que pide el enunciado, con los nombres
# tal cual existen en la base de datos, para que la prediccion del modelo
# se pueda cruzar 1:1 con Producto.nombre sin necesitar un mapeo adicional.
CLASES = [
    "Peluche Memoria",
    "Almohada Abrazo",
    "Cuadro de Historia",
    "Caja del Tiempo",
    "Libro de Memorias",
    "Restauración Especial",
    "Recuerdo Compartido",
    "Memorial Digital",
]

# Valores posibles de cada variable categorica de entrada. Los nombres de
# columna siguen la lista de "Entradas" del enunciado (tipo de objeto,
# material, estado, uso deseado, presupuesto, cantidad, transformacion,
# ciudad, preferencia fisica/digital).
TIPOS_OBJETO = [
    "peluche",
    "prenda_textil",
    "fotografia",
    "joya_pequena",
    "carta_documento",
    "mueble",
    "reloj_instrumento",
    "otro_objeto",
]
MATERIALES = ["tela", "papel", "madera", "metal", "vidrio", "peluche_sintetico", "cuero", "mixto"]
ESTADOS = ["bueno", "regular", "danado", "muy_danado"]
USOS_DESEADOS = ["conservar", "restaurar", "transformar", "compartir", "recordar_digitalmente"]
TRANSFORMACIONES = ["ninguna", "leve", "moderada", "total"]
CIUDADES = ["Bogota", "Medellin", "Cali", "Barranquilla", "Bucaramanga"]
PREFERENCIAS = ["fisico", "digital"]

COLUMNAS_CATEGORICAS = [
    "tipo_objeto",
    "material",
    "estado",
    "uso_deseado",
    "transformacion",
    "ciudad",
    "preferencia",
]
COLUMNAS_NUMERICAS = ["presupuesto", "cantidad"]
COLUMNAS_ENTRADA = COLUMNAS_CATEGORICAS + COLUMNAS_NUMERICAS


def _etiqueta_regla(fila: dict) -> str:
    """Reglas documentadas usadas para generar el dataset sintetico.

    Estas reglas son una aproximacion razonable de como un asesor humano de
    Reviive elegiria un servicio, basada en las descripciones reales del
    catalogo (ver seed_demo.py). Se evaluan en orden de prioridad: la
    primera que aplica gana. Sirven solo para GENERAR datos de entrenamiento
    con una señal real que aprender -- el modelo entrenado luego generaliza
    sobre datos nuevos, no memoriza estas reglas.
    """
    if fila["preferencia"] == "digital":
        return "Memorial Digital"
    if fila["tipo_objeto"] == "fotografia":
        return "Cuadro de Historia"
    if fila["tipo_objeto"] == "carta_documento":
        return "Libro de Memorias"
    if fila["tipo_objeto"] == "peluche" and fila["estado"] in ("bueno", "regular"):
        return "Peluche Memoria"
    if fila["tipo_objeto"] == "prenda_textil":
        return "Almohada Abrazo"
    if fila["cantidad"] >= 2 and fila["uso_deseado"] == "compartir":
        return "Recuerdo Compartido"
    if (
        fila["tipo_objeto"] in ("mueble", "reloj_instrumento")
        and fila["estado"] in ("danado", "muy_danado")
        and fila["presupuesto"] >= 120000
    ):
        return "Restauración Especial"
    if fila["tipo_objeto"] == "joya_pequena" or (
        fila["cantidad"] >= 2 and fila["uso_deseado"] == "conservar"
    ):
        return "Caja del Tiempo"
    # Catch-all: objetos danados sin las condiciones anteriores van a
    # restauracion general.
    return "Restauración Especial"


def generar_dataset(n: int = 1500, semilla: int = 42, ruido: float = 0.08) -> pd.DataFrame:
    """Genera el dataset sintetico documentado.

    `ruido` es la fraccion de filas a las que se les reasigna una clase
    distinta a la que darian las reglas, simulando casos ambiguos/atipicos
    de la vida real (un cliente puede pedir un producto "equivocado" para
    su objeto). Sin ruido el problema queda perfectamente separable y el
    arbol memoriza las reglas en vez de aprender patrones generalizables,
    lo que no demuestra nada sobre el proceso de entrenamiento/evaluacion.
    """
    rng = random.Random(semilla)
    np_rng = np.random.default_rng(semilla)

    filas = []
    for _ in range(n):
        fila = {
            "tipo_objeto": rng.choice(TIPOS_OBJETO),
            "material": rng.choice(MATERIALES),
            "estado": rng.choice(ESTADOS),
            "uso_deseado": rng.choice(USOS_DESEADOS),
            "presupuesto": int(np.clip(np_rng.normal(95000, 35000), 30000, 220000)),
            "cantidad": rng.choices([1, 2, 3, 4, 5], weights=[55, 25, 10, 6, 4])[0],
            "transformacion": rng.choice(TRANSFORMACIONES),
            "ciudad": rng.choice(CIUDADES),
            "preferencia": rng.choices(PREFERENCIAS, weights=[80, 20])[0],
        }
        fila["producto_recomendado"] = _etiqueta_regla(fila)
        filas.append(fila)

    df = pd.DataFrame(filas)

    n_ruido = int(len(df) * ruido)
    idx_ruido = rng.sample(range(len(df)), n_ruido)
    for i in idx_ruido:
        otras = [c for c in CLASES if c != df.at[i, "producto_recomendado"]]
        df.at[i, "producto_recomendado"] = rng.choice(otras)

    return df


def construir_pipeline(max_depth: int = 8, random_state: int = 42) -> Pipeline:
    """Pipeline completo (codificacion de categoricas + arbol de decision).

    Se guarda como un solo objeto (`Pipeline`) para que tanto el
    entrenamiento como la API de inferencia usen EXACTAMENTE la misma
    codificacion de variables categoricas -- evita el error clasico de
    reentrenar encoders distintos en el notebook y en produccion.
    """
    from sklearn.tree import DecisionTreeClassifier

    preprocesador = ColumnTransformer(
        transformers=[
            ("categoricas", OneHotEncoder(handle_unknown="ignore"), COLUMNAS_CATEGORICAS),
            ("numericas", "passthrough", COLUMNAS_NUMERICAS),
        ]
    )
    arbol = DecisionTreeClassifier(max_depth=max_depth, random_state=random_state)
    return Pipeline(steps=[("preprocesador", preprocesador), ("modelo", arbol)])


def fila_desde_objeto_memoria(objeto: dict, cantidad_objetos: int = 1) -> dict:
    """Traduce un `ObjetoMemoria` real (tipo/material/estado/nivel_transformacion)
    a las columnas de entrada del modelo.

    Reviive todavia no captura uso_deseado, presupuesto, ciudad ni
    preferencia fisica/digital en el flujo de registro de un recuerdo, asi
    que esos campos usan un valor neutro/mas comun documentado aqui como
    limitacion conocida -- no se inventan a partir de nada real. Se marcan
    explicitamente para que quien lea la integracion sepa cuales campos son
    dato real y cuales son un valor por defecto.
    """
    tipo_raw = (objeto.get("tipo") or "").strip().lower()
    material_raw = (objeto.get("material") or "").strip().lower()
    estado_raw = (objeto.get("estado") or "").strip().lower()
    transformacion_raw = (objeto.get("nivel_transformacion") or "").strip().lower()

    def _match(valor, opciones, default):
        for op in opciones:
            if op in valor:
                return op
        return default

    tipo_objeto = _match(
        tipo_raw,
        ["peluche", "prenda_textil", "fotografia", "joya_pequena", "carta_documento", "mueble", "reloj_instrumento"],
        "otro_objeto",
    )
    material = _match(material_raw, MATERIALES, "mixto")
    estado = _match(estado_raw, ESTADOS, "regular")
    transformacion = _match(transformacion_raw, TRANSFORMACIONES, "leve")

    return {
        "tipo_objeto": tipo_objeto,  # dato real (ObjetoMemoria.tipo)
        "material": material,  # dato real (ObjetoMemoria.material)
        "estado": estado,  # dato real (ObjetoMemoria.estado)
        "uso_deseado": "conservar",  # valor por defecto (aun no se captura)
        "presupuesto": 95000,  # valor por defecto (aun no se captura)
        "cantidad": cantidad_objetos,  # dato real (len(recuerdo.objetos))
        "transformacion": transformacion,  # dato real (ObjetoMemoria.nivel_transformacion)
        "ciudad": "Bogota",  # valor por defecto (aun no se captura)
        "preferencia": "fisico",  # valor por defecto (aun no se captura)
    }
