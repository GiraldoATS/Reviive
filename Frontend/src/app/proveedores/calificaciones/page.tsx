import RolePortalShell from "@/components/RolePortalShell";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import Button from "@/components/Button";
import { IconStar, IconMessage } from "@/components/icons";

const resenas = [
  { nombre: "María López", pedido: "Reloj de bolsillo Omega", texto: "El arreglo superó mis expectativas. Muy atentos y detallistas.", fecha: "24 May 2026" },
  { nombre: "Carlos García", pedido: "Urna conmemorativa", texto: "Todo muy bien, precios justos y la atención y el servicio perfectos.", fecha: "20 May 2026" },
];

export default function CalificacionesProveedorPage() {
  return (
    <RolePortalShell role="proveedor" crumbs={["Proveedor", "Calificaciones"]}>
      <h1 className="font-display text-2xl text-carbon mb-1">Calificaciones y comentarios</h1>
      <p className="text-sm text-carbon/55 mb-6">Tu reputación es tu mejor carta. Responde constantemente.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={<IconStar className="h-5 w-5" />} value="4.8" label="Calificación promedio" tone="dorado" />
        <StatCard icon={<IconMessage className="h-5 w-5" />} value="128" label="Total de calificaciones" tone="rosa" />
        <StatCard icon={<IconStar className="h-5 w-5" />} value="96" label="Reseñas recibidas" tone="greige" />
        <StatCard icon={<IconMessage className="h-5 w-5" />} value="98%" label="Recomendación" tone="verde" />
      </div>

      <Card>
        <h2 className="font-display text-lg text-carbon mb-4">Reseñas recientes</h2>
        <ul className="divide-y divide-greige/50">
          {resenas.map((r) => (
            <li key={r.nombre} className="py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-carbon">{r.nombre} <span className="text-dorado-suave text-xs">★★★★★</span></p>
                <span className="text-xs text-carbon/45">{r.fecha}</span>
              </div>
              <p className="text-xs text-carbon/50 mt-0.5">{r.pedido}</p>
              <p className="text-sm text-carbon/75 mt-1">{r.texto}</p>
              <Button variant="ghost" className="text-xs px-0 mt-1">Responder</Button>
            </li>
          ))}
        </ul>
      </Card>
    </RolePortalShell>
  );
}
