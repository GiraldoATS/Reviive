"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { IconReloj } from "@/components/icons";
import { API_URL } from "@/lib/api";

interface MemorialApi {
  slug: string;
  visibilidad: "privado" | "con_enlace" | "publico";
  biografia: string;
}

const etiquetaVisibilidad: Record<string, string> = {
  privado: "Privado",
  con_enlace: "Compartido por enlace",
  publico: "Público",
};

export default function MemorialDigitalPage() {
  const { slug } = useParams<{ slug: string }>();
  const [memorial, setMemorial] = useState<MemorialApi | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/memorials/by-slug/${slug}/`)
      .then((res) => {
        if (res.status === 404) throw new Error("Este memorial no existe o es privado.");
        if (!res.ok) throw new Error("No se pudo cargar el memorial.");
        return res.json();
      })
      .then(setMemorial)
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado."));
  }, [slug]);

  if (error) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-2xl px-6 py-16 text-center text-carbon/60">{error}</div>
      </SiteShell>
    );
  }

  if (!memorial) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-2xl px-6 py-16 text-center text-carbon/60">Cargando memorial…</div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-full bg-rosa/40 flex items-center justify-center mx-auto">
            <IconReloj className="h-8 w-8 text-borgona" />
          </div>
          <p className="mt-4 text-sm text-carbon/55">Memorial digital · {memorial.slug}</p>
          <div className="mt-2 flex justify-center">
            <Badge tone="neutral">{etiquetaVisibilidad[memorial.visibilidad]}</Badge>
          </div>
        </div>
        <Card>
          {memorial.biografia ? (
            memorial.biografia.split("\n\n").map((parrafo, i) => (
              <p key={i} className="text-sm text-carbon/75 leading-relaxed mb-3 last:mb-0">
                {parrafo}
              </p>
            ))
          ) : (
            <p className="text-sm text-carbon/50 italic">
              Alma todavía está redactando la historia de este memorial.
            </p>
          )}
        </Card>
      </div>
    </SiteShell>
  );
}
