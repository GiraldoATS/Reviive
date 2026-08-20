import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import Card from "@/components/Card";
import { IconCuidado, IconConfianza, IconTrazable, IconSeguro } from "@/components/icons";

export default function SobreReviivePage() {
  return (
    <SiteShell>
      <div className="relative h-64 w-full">
        <Image src="/images/auth-desk.png" alt="" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-marfil via-marfil/40 to-transparent" />
      </div>
      <div className="mx-auto max-w-3xl px-6 pt-4 pb-16 text-center -mt-10 relative">
        <h1 className="font-display text-4xl text-carbon">Sobre Reviive</h1>
        <p className="mt-4 text-carbon/70">
          Reviive nació de una idea simple: los objetos que guardan una
          historia merecen ser cuidados con el mismo respeto que la memoria
          que representan. Conectamos personas con talleres y artesanos
          validados para restaurar, transformar y honrar los objetos que
          más importan.
        </p>
      </div>
      <div className="mx-auto max-w-4xl px-6 pb-16 grid sm:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-display text-xl text-borgona">Misión</h2>
          <p className="mt-2 text-sm text-carbon/70">
            Devolver la vida a objetos con valor emocional a través de
            restauración artesanal, acompañamiento humano y tecnología
            responsable.
          </p>
        </Card>
        <Card>
          <h2 className="font-display text-xl text-borgona">Visión</h2>
          <p className="mt-2 text-sm text-carbon/70">
            Ser el taller de confianza donde cada familia encuentra el
            cuidado, la trazabilidad y el respeto que sus recuerdos merecen.
          </p>
        </Card>
      </div>
      <div className="mx-auto max-w-5xl px-6 pb-24 grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          { icon: IconCuidado, t: "Cálida" },
          { icon: IconConfianza, t: "Confiable" },
          { icon: IconTrazable, t: "Trazable" },
          { icon: IconSeguro, t: "Segura" },
        ].map((v) => (
          <div key={v.t}>
            <v.icon className="h-8 w-8 mx-auto text-dorado" />
            <p className="mt-2 font-display text-lg text-carbon">{v.t}</p>
          </div>
        ))}
      </div>
    </SiteShell>
  );
}
