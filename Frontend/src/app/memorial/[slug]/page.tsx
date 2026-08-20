import SiteShell from "@/components/SiteShell";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { IconReloj } from "@/components/icons";

export default async function MemorialDigitalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-full bg-rosa/40 flex items-center justify-center mx-auto">
            <IconReloj className="h-8 w-8 text-borgona" />
          </div>
          <h1 className="mt-4 font-display text-3xl text-carbon">El reloj de bolsillo de Omega</h1>
          <p className="mt-1 text-sm text-carbon/55">Memorial digital · {slug}</p>
          <div className="mt-2 flex justify-center">
            <Badge tone="neutral">Compartido por enlace</Badge>
          </div>
        </div>
        <Card>
          <p className="text-sm text-carbon/75 italic">
            &ldquo;Este reloj perteneció a mi abuelo por más de 60 años.
            Restaurarlo fue devolverle a nuestra familia una pieza que
            creíamos perdida en el tiempo.&rdquo;
          </p>
          <p className="mt-4 text-xs text-carbon/45">— Carolina M.</p>
        </Card>
      </div>
    </SiteShell>
  );
}
