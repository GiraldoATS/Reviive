import RolePortalShell from "@/components/RolePortalShell";
import StatCard from "@/components/StatCard";
import SimpleTable from "@/components/SimpleTable";
import Badge from "@/components/Badge";
import { IconBox, IconCheckCircle, IconClockAlert } from "@/components/icons";

const ejemplos = [
  ["Consulta de precios (anonimizado)", "recomendacion", "Aprobado"],
  ["Duda sobre recordatorios (anonimizado)", "soporte", "Pendiente"],
  ["Cancelación de servicio (anonimizado)", "retencion", "Rechazado"],
];

const toneByEstado: Record<string, "success" | "progress" | "pending"> = {
  Aprobado: "success",
  Pendiente: "pending",
  Rechazado: "pending",
};

export default function DatasetSupervisionPage() {
  return (
    <RolePortalShell role="supervision" crumbs={["Supervisión", "Dataset de entrenamiento"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Dataset de entrenamiento</h1>
      <p className="text-sm text-carbon/55 mb-6">
        Ejemplos anonimizados y aprobados que alimentan la mejora continua de los agentes (RN-09 / RN-11).
      </p>

      <div className="grid sm:grid-cols-3 gap-6 mb-6">
        <StatCard icon={<IconBox className="h-5 w-5" />} value="1,204" label="Ejemplos totales" tone="rosa" />
        <StatCard icon={<IconCheckCircle className="h-5 w-5" />} value="918" label="Aprobados" tone="verde" />
        <StatCard icon={<IconClockAlert className="h-5 w-5" />} value="46" label="Pendientes de revisión" tone="dorado" />
      </div>

      <SimpleTable
        columns={["Ejemplo", "Etiqueta", "Estado", ""]}
        rows={ejemplos.map((e) => [
          e[0], e[1],
          <Badge key="s" tone={toneByEstado[e[2]]}>{e[2]}</Badge>,
          <span key="a" className="text-borgona text-xs">Revisar →</span>,
        ])}
      />
    </RolePortalShell>
  );
}
