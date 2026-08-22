# Modelo de Machine Learning — clasificador de producto recomendado

Implementa la sección 15.1 del *Documento de Definición Estratégica y
Funcional*: un clasificador multiclase que, dado un objeto/recuerdo
descrito por un cliente, predice cuál de los 8 servicios del catálogo real
de Reviive es el más adecuado.

## Archivos

- `model_recomendacion.py` — módulo compartido: generador del dataset
  sintético documentado (reglas explícitas + ruido) y el pipeline
  (codificación de categóricas + Árbol de Decisión). Sin dependencias de
  Django, para poder usarse tal cual en Jupyter/Colab.
- `entrenar.py` — script ejecutable: genera el dataset, entrena el árbol
  de decisión (+ comparación con Random Forest y KNN), evalúa
  (accuracy/precision/recall/F1/matriz de confusión), guarda las gráficas
  y el artefacto entrenado.
- `entrenamiento_modelo_recomendacion.ipynb` — el entregable académico:
  mismo proceso que `entrenar.py`, pero narrado paso a paso con markdown,
  ya ejecutado (con sus salidas y gráficas reales). Reproducible en
  Jupyter o Google Colab (solo necesita `model_recomendacion.py` en la
  misma carpeta).
- `dataset_sintetico.csv` — dataset generado (1500 filas).
- `modelo_recomendacion.joblib` — el pipeline entrenado (el que usa la API
  en producción).
- `matriz_confusion.png`, `arbol_decision.png`, `reporte_metricas.json` —
  resultados de la última corrida de `entrenar.py`.

## Resultado (última corrida)

| Modelo | Accuracy | Precision (macro) | Recall (macro) | F1 (macro) |
|---|---|---|---|---|
| Árbol de Decisión (principal) | 0.813 | 0.835 | 0.784 | 0.803 |
| Random Forest (comparación) | 0.863 | 0.886 | 0.830 | 0.851 |
| KNN, k=7 (comparación) | 0.667 | 0.684 | 0.598 | 0.624 |

## Integración con el sistema real

`Backend/api/apps/ml/` expone `POST /api/v1/ml/recomendar-producto`
(autenticado igual que el resto de endpoints agente→Django, con firma
HMAC), que carga este mismo artefacto entrenado. El workflow de n8n
`agente-recomendacion.json` lo consulta antes de llamar al LLM y le pasa
la predicción como una señal adicional real ("un modelo de ML entrenado
sugiere X con Y% de confianza"), que queda registrada en
`EjecucionAgente.structured_data.senal_ml` para poder auditar después si
el LLM la siguió o se apartó de ella.

**Limitación conocida:** de las 9 variables de entrada, hoy Reviive solo
captura de forma real `tipo_objeto`, `material`, `estado` y
`transformacion` (campos de `ObjetoMemoria`) más `cantidad` (número de
objetos del recuerdo). `uso_deseado`, `presupuesto`, `ciudad` y
`preferencia` todavía no se capturan en el flujo de registro de un
recuerdo, así que la integración usa un valor neutro documentado para esos
campos (ver `fila_desde_objeto_memoria` en `model_recomendacion.py`) en vez
de inventarlos.

## Para reentrenar

```bash
cd Backend/ml
# con el venv de Backend/api activado (scikit-learn, pandas, joblib, matplotlib)
python entrenar.py
```

Esto sobreescribe `dataset_sintetico.csv`, `modelo_recomendacion.joblib` y
las gráficas. La API en producción recarga el artefacto la próxima vez que
un proceso de Django nuevo lo importe (carga perezosa cacheada en
`apps/ml/model_loader.py`).
