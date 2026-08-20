import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";

const mensajes = [
  { rol: "cliente", texto: "Hola, necesito orientación sobre un reloj de bolsillo de mi abuelo.", hora: "10:24" },
  { rol: "alma", texto: "Hola, gracias por escribir a Reviive. Con gusto te ayudo a encontrar la mejor opción para tu recuerdo.", hora: "10:25" },
  { rol: "cliente", texto: "Tenemos un presupuesto aproximado de $80,000 a $110,000.", hora: "10:27" },
  { rol: "alma", texto: "Gracias por compartirlo. Te recomiendo la Restauración completa, que está dentro de tu presupuesto.", hora: "10:29" },
];

export default async function DetalleConversacionSupervisionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <RolePortalShell role="supervision" crumbs={["Supervisión", "Conversaciones", id]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Detalle de conversación</h1>
      <p className="text-sm text-carbon/55 mb-6">CONV-2026-05-18-{id.padStart(6, "0")} · WhatsApp · 18 may 2026</p>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <Card>
          <div className="space-y-4">
            {mensajes.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.rol === "alma" ? "bg-marfil border border-greige/70" : "bg-borgona text-marfil ml-auto"
                }`}
              >
                <p>{m.texto}</p>
                <p className={`mt-1 text-[10px] ${m.rol === "alma" ? "text-carbon/40" : "text-marfil/60"}`}>{m.hora}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-2">Intención detectada</h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-carbon">Buscar servicio de restauración</span>
              <Badge tone="progress">Alta confianza</Badge>
            </div>
          </Card>
          <Card>
            <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-2">Evaluación de calidad</h2>
            <p className="font-display text-3xl text-borgona">4.6 <span className="text-sm text-carbon/50">/ 5</span></p>
            <dl className="mt-3 text-xs space-y-1">
              <div className="flex justify-between"><dt className="text-carbon/50">Precisión</dt><dd>4.8</dd></div>
              <div className="flex justify-between"><dt className="text-carbon/50">Empatía</dt><dd>4.7</dd></div>
              <div className="flex justify-between"><dt className="text-carbon/50">Claridad</dt><dd>4.6</dd></div>
            </dl>
          </Card>
          <Card>
            <h2 className="text-xs uppercase tracking-wide text-carbon/50 mb-2">Notas del supervisor</h2>
            <textarea className="input resize-none" rows={3} placeholder="Escribe una nota para esta conversación..." />
          </Card>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1 justify-center text-xs">Corregir</Button>
            <Button variant="primary" className="flex-1 justify-center text-xs">Aprobar y agregar</Button>
          </div>
        </div>
      </div>
    </RolePortalShell>
  );
}
