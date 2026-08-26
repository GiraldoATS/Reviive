"use client";

import { useEffect, useState } from "react";
import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import { IconStar, IconSparkle } from "@/components/icons";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

interface ComparacionModelo {
  modelo: string;
  accuracy: number;
  precision_macro: number;
  recall_macro: number;
  f1_macro: number;
}

interface MetricasApi {
  clases: string[];
  columnas_entrada: string[];
  filas_dataset: number;
  filas_entrenamiento: number;
  filas_prueba: number;
  comparacion_modelos: ComparacionModelo[];
  matriz_confusion_labels: string[];
  matriz_confusion: number[][];
}

export default function MachineLearningSupervisionPage() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const [metricas, setMetricas] = useState<MetricasApi | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cargandoSesion || !accessToken) return;
    fetch(`${API_URL}/ml/metricas`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar las métricas del modelo.");
        return res.json();
      })
      .then(setMetricas)
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."));
  }, [accessToken, cargandoSesion]);

  const mejorModelo = metricas?.comparacion_modelos.length
    ? metricas.comparacion_modelos.reduce((mejor, m) => (m.accuracy > mejor.accuracy ? m : mejor))
    : undefined;

  return (
    <RolePortalShell role="supervision" crumbs={["Supervisión", "Machine Learning"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Vista de Machine Learning</h1>
      <p className="text-sm text-carbon/55 mb-6">
        Desempeño real del clasificador entrenado que recomienda un producto del catálogo (ver <code>Backend/ml/</code>).
      </p>

      {error && <p className="text-sm text-borgona mb-6">{error}</p>}
      {!metricas && !error && <p className="text-sm text-carbon/50">Cargando métricas…</p>}

      {metricas && mejorModelo && (
        <>
          <div className="grid sm:grid-cols-3 gap-6 mb-6">
            <StatCard icon={<IconStar className="h-5 w-5" />} value={`${(mejorModelo.accuracy * 100).toFixed(1)}%`} label={`Exactitud (${mejorModelo.modelo})`} tone="dorado" />
            <StatCard icon={<IconSparkle className="h-5 w-5" />} value={mejorModelo.f1_macro.toFixed(2)} label="F1-score promedio" tone="verde" />
            <StatCard icon={<IconSparkle className="h-5 w-5" />} value={String(metricas.filas_dataset)} label={`Filas del dataset (${metricas.filas_entrenamiento} entren. / ${metricas.filas_prueba} prueba)`} tone="rosa" />
          </div>

          <Card className="mb-6">
            <h2 className="font-display text-lg text-carbon mb-4">Comparación de modelos entrenados</h2>
            <table className="text-sm w-full">
              <thead>
                <tr className="text-left text-xs text-carbon/50">
                  <th className="p-2">Modelo</th>
                  <th className="p-2">Accuracy</th>
                  <th className="p-2">Precisión (macro)</th>
                  <th className="p-2">Recall (macro)</th>
                  <th className="p-2">F1 (macro)</th>
                </tr>
              </thead>
              <tbody>
                {metricas.comparacion_modelos.map((m) => (
                  <tr key={m.modelo} className={m.modelo === mejorModelo.modelo ? "bg-dorado-suave/10" : ""}>
                    <td className="p-2 font-medium text-carbon">{m.modelo}</td>
                    <td className="p-2">{(m.accuracy * 100).toFixed(1)}%</td>
                    <td className="p-2">{m.precision_macro.toFixed(3)}</td>
                    <td className="p-2">{m.recall_macro.toFixed(3)}</td>
                    <td className="p-2">{m.f1_macro.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card>
            <h2 className="font-display text-lg text-carbon mb-4">Matriz de confusión ({mejorModelo.modelo})</h2>
            <div className="overflow-x-auto">
              <table className="text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="p-2" />
                    {metricas.matriz_confusion_labels.map((c) => (
                      <th key={c} className="p-2 text-xs text-carbon/50 font-medium whitespace-nowrap">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {metricas.matriz_confusion.map((row, i) => (
                    <tr key={i}>
                      <th className="p-2 text-xs text-carbon/50 font-medium text-left whitespace-nowrap">{metricas.matriz_confusion_labels[i]}</th>
                      {row.map((v, j) => (
                        <td
                          key={j}
                          className="p-3 text-center rounded-md"
                          style={{ background: i === j ? "rgba(212,175,55,0.25)" : "rgba(217,206,194,0.35)" }}
                        >
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-carbon/50">
              Entrenado sobre un dataset de {metricas.filas_dataset} solicitudes ({metricas.filas_entrenamiento} entrenamiento / {metricas.filas_prueba} prueba) — ver <code>Backend/ml/</code>.
            </p>
          </Card>
        </>
      )}
    </RolePortalShell>
  );
}
