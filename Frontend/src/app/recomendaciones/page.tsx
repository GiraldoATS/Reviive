"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Card from "@/components/Card";
import Button from "@/components/Button";
import ProductPhoto from "@/components/ProductPhoto";
import { useAuth } from "@/lib/AuthContext";
import { API_URL } from "@/lib/api";

const tabs = ["Para el objeto", "Cuidados", "Inspiración"];

interface RecomendacionApi {
  id: number;
  titulo: string;
  justificacion: string;
  puntaje: string;
  producto: { id: number; nombre: string; icono: string; imagen_url: string };
}

function ListaRecomendaciones() {
  const { accessToken, cargando: cargandoSesion } = useAuth();
  const searchParams = useSearchParams();
  const recuerdoId = searchParams.get("recuerdo");
  const [recomendaciones, setRecomendaciones] = useState<RecomendacionApi[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cargandoSesion || !accessToken || !recuerdoId) return;
    let cancelado = false;
    fetch(`${API_URL}/recommendations/?recuerdo=${recuerdoId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar las recomendaciones.");
        return res.json();
      })
      .then((data) => {
        if (!cancelado) setRecomendaciones(data.results ?? []);
      })
      .catch((err) => {
        if (!cancelado) setError(err instanceof Error ? err.message : "Error inesperado.");
      });
    return () => {
      cancelado = true;
    };
  }, [accessToken, cargandoSesion, recuerdoId]);

  if (!cargandoSesion && !accessToken) {
    return (
      <Card className="text-center py-10">
        <p className="text-carbon/70 mb-4">Inicia sesión para ver tus recomendaciones.</p>
        <Link href="/auth/login" className="text-borgona underline text-sm">Iniciar sesión →</Link>
      </Card>
    );
  }

  if (!recuerdoId) {
    return (
      <Card className="text-center py-10">
        <p className="text-carbon/70 mb-4">
          Registra un recuerdo primero para que Alma pueda sugerirte servicios.
        </p>
        <Link href="/recuerdos/nuevo" className="text-borgona underline text-sm">
          Registrar un recuerdo →
        </Link>
      </Card>
    );
  }

  if (error) {
    return <Card className="text-center py-10 text-borgona">{error}</Card>;
  }

  if (recomendaciones === null) {
    return <Card className="text-center py-10 text-carbon/60">Buscando las mejores opciones para tu recuerdo…</Card>;
  }

  if (recomendaciones.length === 0) {
    return (
      <Card className="text-center py-10 text-carbon/60">
        Todavía no tenemos recomendaciones para este recuerdo. Alma sigue analizando tu historia.
      </Card>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {recomendaciones.map((rec) => (
        <Card key={rec.id} className="flex gap-0 !p-0 overflow-hidden">
          <ProductPhoto icono={rec.producto.icono} src={rec.producto.imagen_url} className="h-auto w-28 shrink-0 self-stretch" />
          <div className="p-5 flex-1">
            <h3 className="font-display text-lg text-carbon">{rec.titulo}</h3>
            <p className="mt-1 text-sm text-carbon/65">{rec.justificacion}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function RecomendacionesPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-6 py-14">
        <h1 className="font-display text-3xl text-carbon">
          Recomendados para ti
        </h1>
        <p className="text-sm text-carbon/60 mt-1 mb-8">
          Servicios que Alma sugiere a partir de la historia de tu recuerdo.
        </p>

        <div className="flex gap-2 mb-8">
          {tabs.map((tab, i) => (
            <span
              key={tab}
              className={`rounded-full px-4 py-1.5 text-sm ${
                i === 0
                  ? "bg-borgona text-marfil"
                  : "border border-greige/70 text-carbon/70"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>

        <Suspense fallback={<Card className="text-center py-10 text-carbon/60">Cargando…</Card>}>
          <ListaRecomendaciones />
        </Suspense>

        <Card className="mt-10 bg-gradient-to-br from-rosa/30 to-marfil">
          <h3 className="font-display text-lg text-borgona">
            Historias que inspiran
          </h3>
          <p className="mt-2 text-sm text-carbon/65">
            Descubre proyectos que han marcado momentos.
          </p>
          <Button href="/catalogo" variant="ghost" className="mt-2 px-0 text-xs">
            Ver historias →
          </Button>
        </Card>
      </div>
    </SiteShell>
  );
}
