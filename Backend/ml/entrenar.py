"""Entrena el clasificador de producto recomendado y guarda:
  - dataset_sintetico.csv     (datos de entrenamiento, para reproducibilidad)
  - modelo_recomendacion.joblib  (pipeline entrenado, usado por la API real)
  - matriz_confusion.png
  - arbol_decision.png
  - reporte_metricas.txt

Uso: python entrenar.py   (desde Backend/ml, con el venv del backend activo)
"""

from __future__ import annotations

import json
from pathlib import Path

import joblib
import matplotlib

matplotlib.use("Agg")  # sin ventana: solo guardar a archivo
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    ConfusionMatrixDisplay,
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import plot_tree

from model_recomendacion import CLASES, COLUMNAS_ENTRADA, construir_pipeline, generar_dataset

DIRECTORIO = Path(__file__).parent


def evaluar(nombre: str, pipeline, X_test, y_test) -> dict:
    y_pred = pipeline.predict(X_test)
    metricas = {
        "modelo": nombre,
        "accuracy": accuracy_score(y_test, y_pred),
        "precision_macro": precision_score(y_test, y_pred, average="macro", zero_division=0),
        "recall_macro": recall_score(y_test, y_pred, average="macro", zero_division=0),
        "f1_macro": f1_score(y_test, y_pred, average="macro", zero_division=0),
    }
    print(f"\n=== {nombre} ===")
    for k, v in metricas.items():
        if k != "modelo":
            print(f"  {k}: {v:.3f}")
    print(classification_report(y_test, y_pred, labels=CLASES, zero_division=0))
    return metricas


def main() -> None:
    print("1. Generando dataset sintetico...")
    df = generar_dataset(n=1500, semilla=42, ruido=0.08)
    df.to_csv(DIRECTORIO / "dataset_sintetico.csv", index=False)
    print(f"   {len(df)} filas guardadas en dataset_sintetico.csv")
    print(f"   Distribucion de clases:\n{df['producto_recomendado'].value_counts()}")

    X = df[COLUMNAS_ENTRADA]
    y = df["producto_recomendado"]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("\n2. Entrenando arbol de decision (modelo principal)...")
    pipeline_arbol = construir_pipeline(max_depth=8, random_state=42)
    pipeline_arbol.fit(X_train, y_train)
    metricas_arbol = evaluar("Arbol de Decision", pipeline_arbol, X_test, y_test)

    print("\n3. Entrenando modelos de comparacion (Random Forest, KNN)...")
    from sklearn.compose import ColumnTransformer
    from sklearn.pipeline import Pipeline
    from sklearn.preprocessing import OneHotEncoder, StandardScaler

    def _pipeline_con(modelo):
        # A diferencia del arbol (invariante a la escala de las variables),
        # KNN mide distancias, asi que sin escalar "presupuesto" (decenas de
        # miles) domina por completo sobre "cantidad" (1-5) y el resultado
        # deja de reflejar el problema real. StandardScaler lo corrige.
        pre = ColumnTransformer(
            transformers=[
                ("categoricas", OneHotEncoder(handle_unknown="ignore"),
                 [c for c in COLUMNAS_ENTRADA if c not in ("presupuesto", "cantidad")]),
                ("numericas", StandardScaler(), ["presupuesto", "cantidad"]),
            ]
        )
        return Pipeline(steps=[("preprocesador", pre), ("modelo", modelo)])

    pipeline_rf = _pipeline_con(RandomForestClassifier(n_estimators=100, random_state=42))
    pipeline_rf.fit(X_train, y_train)
    metricas_rf = evaluar("Random Forest", pipeline_rf, X_test, y_test)

    pipeline_knn = _pipeline_con(KNeighborsClassifier(n_neighbors=7))
    pipeline_knn.fit(X_train, y_train)
    metricas_knn = evaluar("KNN (k=7)", pipeline_knn, X_test, y_test)

    print("\n4. Guardando matriz de confusion (arbol de decision)...")
    y_pred_arbol = pipeline_arbol.predict(X_test)
    fig, ax = plt.subplots(figsize=(9, 8))
    ConfusionMatrixDisplay.from_predictions(
        y_test, y_pred_arbol, labels=CLASES, xticks_rotation=45, ax=ax
    )
    plt.title("Matriz de confusion - Arbol de Decision")
    plt.tight_layout()
    plt.savefig(DIRECTORIO / "matriz_confusion.png", dpi=150)
    plt.close(fig)

    print("5. Guardando visualizacion del arbol de decision...")
    nombres_features = pipeline_arbol.named_steps["preprocesador"].get_feature_names_out()
    fig, ax = plt.subplots(figsize=(26, 14))
    plot_tree(
        pipeline_arbol.named_steps["modelo"],
        feature_names=nombres_features,
        class_names=CLASES,
        filled=True,
        rounded=True,
        max_depth=3,  # arbol completo es ilegible; se documenta max_depth real en el reporte
        fontsize=8,
        ax=ax,
    )
    plt.title("Arbol de Decision - Producto recomendado (primeros 3 niveles)")
    plt.tight_layout()
    plt.savefig(DIRECTORIO / "arbol_decision.png", dpi=150)
    plt.close(fig)

    print("6. Guardando el modelo entrenado (modelo_recomendacion.joblib)...")
    joblib.dump(pipeline_arbol, DIRECTORIO / "modelo_recomendacion.joblib")

    print("7. Guardando reporte de metricas...")
    reporte = {
        "clases": CLASES,
        "columnas_entrada": COLUMNAS_ENTRADA,
        "filas_dataset": len(df),
        "filas_entrenamiento": len(X_train),
        "filas_prueba": len(X_test),
        "comparacion_modelos": [metricas_arbol, metricas_rf, metricas_knn],
        "matriz_confusion_labels": CLASES,
        "matriz_confusion": confusion_matrix(y_test, y_pred_arbol, labels=CLASES).tolist(),
    }
    with open(DIRECTORIO / "reporte_metricas.json", "w", encoding="utf-8") as f:
        json.dump(reporte, f, ensure_ascii=False, indent=2)

    print("\nListo. Artefactos generados en Backend/ml/:")
    print("  - dataset_sintetico.csv")
    print("  - modelo_recomendacion.joblib")
    print("  - matriz_confusion.png")
    print("  - arbol_decision.png")
    print("  - reporte_metricas.json")


if __name__ == "__main__":
    main()
