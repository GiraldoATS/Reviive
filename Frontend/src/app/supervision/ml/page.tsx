import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import { IconStar, IconSparkle } from "@/components/icons";

const matriz = [
  [42, 3, 1],
  [2, 38, 4],
  [0, 5, 45],
];
const clases = ["Restauración", "Cotización", "Consulta"];

export default function MachineLearningSupervisionPage() {
  return (
    <RolePortalShell role="supervision" crumbs={["Supervisión", "Machine Learning"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Vista de Machine Learning</h1>
      <p className="text-sm text-carbon/55 mb-6">
        Desempeño del modelo de recomendación de producto (dataset sintético, Árbol de Decisión).
      </p>

      <div className="grid sm:grid-cols-3 gap-6 mb-6">
        <StatCard icon={<IconStar className="h-5 w-5" />} value="91.4%" label="Exactitud (accuracy)" tone="dorado" />
        <StatCard icon={<IconSparkle className="h-5 w-5" />} value="0.90" label="F1-score promedio" tone="verde" />
        <StatCard icon={<IconSparkle className="h-5 w-5" />} value="v1.2" label="Versión del modelo" tone="rosa" />
      </div>

      <Card>
        <h2 className="font-display text-lg text-carbon mb-4">Matriz de confusión</h2>
        <table className="text-sm border-collapse">
          <thead>
            <tr>
              <th className="p-2" />
              {clases.map((c) => (
                <th key={c} className="p-2 text-xs text-carbon/50 font-medium">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matriz.map((row, i) => (
              <tr key={i}>
                <th className="p-2 text-xs text-carbon/50 font-medium text-left">{clases[i]}</th>
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
        <p className="mt-4 text-xs text-carbon/50">
          Entrenado sobre un dataset sintético de 300 solicitudes (ver notebook en <code>Backend/ml/</code>).
        </p>
      </Card>
    </RolePortalShell>
  );
}
