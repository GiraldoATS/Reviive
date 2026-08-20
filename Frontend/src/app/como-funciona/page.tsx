import SiteShell from "@/components/SiteShell";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { IconMessage, IconTrazable, IconCuidado, IconCheckCircle } from "@/components/icons";

const pasos = [
  { icon: IconMessage, titulo: "Cuenta tu historia", texto: "Regístrate y cuéntale a Alma sobre el objeto y su significado." },
  { icon: IconTrazable, titulo: "Recibe alternativas", texto: "Alma y nuestro equipo curador te proponen opciones viables." },
  { icon: IconCuidado, titulo: "Elige y confirma", texto: "Compara alcance, tiempos, precio y proveedor recomendado." },
  { icon: IconCheckCircle, titulo: "Sigue el proceso", texto: "Consulta evidencias y la cadena de custodia hasta la entrega." },
];

export default function ComoFuncionaPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="font-display text-4xl text-carbon">Cómo funciona Reviive</h1>
        <p className="mt-3 text-carbon/65 max-w-xl mx-auto">
          De la historia al objeto restaurado, acompañado en cada paso.
        </p>
      </div>
      <div className="mx-auto max-w-5xl px-6 pb-20 grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {pasos.map((p, i) => (
          <Card key={p.titulo} className="text-center">
            <span className="text-xs text-dorado-suave">{String(i + 1).padStart(2, "0")}</span>
            <p.icon className="h-8 w-8 mx-auto mt-2 text-borgona" />
            <h3 className="mt-3 font-display text-lg text-carbon">{p.titulo}</h3>
            <p className="mt-1 text-sm text-carbon/60">{p.texto}</p>
          </Card>
        ))}
      </div>
      <div className="mx-auto max-w-4xl px-6 pb-24 text-center">
        <Button href="/recuerdos/nuevo" variant="primary">Comenzar mi proyecto →</Button>
      </div>
    </SiteShell>
  );
}
