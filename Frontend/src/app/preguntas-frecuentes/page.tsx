import SiteShell from "@/components/SiteShell";
import Card from "@/components/Card";

const preguntas = [
  { q: "¿Cómo funciona el proceso de restauración?", a: "Registras tu recuerdo, Alma y nuestro equipo te recomiendan alternativas, eliges un proveedor validado y sigues el proceso hasta la entrega." },
  { q: "¿Qué tipos de objetos restauran?", a: "Relojes, joyas, cámaras, máquinas de escribir, fotografías, textiles, objetos en madera y piezas antiguas sin catálogo definido." },
  { q: "¿Cuánto tiempo tarda una restauración?", a: "Depende del objeto y el proveedor asignado; cada cotización incluye un tiempo estimado de entrega." },
  { q: "¿Cómo se protege mi objeto durante el proceso?", a: "Cada pedido cuenta con una cadena de custodia con evidencia fotográfica en cada etapa." },
  { q: "¿Cómo solicito una evaluación?", a: "Puedes iniciar una conversación con Alma o completar el formulario de registro de recuerdo." },
];

export default function PreguntasFrecuentesPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl text-carbon text-center">Preguntas frecuentes</h1>
        <div className="mt-10 space-y-4">
          {preguntas.map((p) => (
            <Card key={p.q}>
              <h3 className="font-display text-lg text-carbon">{p.q}</h3>
              <p className="mt-2 text-sm text-carbon/65">{p.a}</p>
            </Card>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
