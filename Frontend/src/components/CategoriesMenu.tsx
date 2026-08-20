"use client";

import { useState } from "react";
import Link from "next/link";
import { IconAnillo, IconFotografia, IconVasija, IconBolso, IconSilla } from "./icons";

const categorias = [
  { icon: IconAnillo, titulo: "Joyas y Relojes", texto: "Restauración y mantenimiento de piezas que guardan momentos inolvidables." },
  { icon: IconFotografia, titulo: "Memorias en Papel", texto: "Conservación y restauración de fotografías, cartas y documentos familiares." },
  { icon: IconVasija, titulo: "Objetos Decorativos", texto: "Devolvemos la belleza a piezas de cerámica, vidrio, metal y más." },
  { icon: IconBolso, titulo: "Cuero y Textiles", texto: "Restauración de bolsos, prendas y textiles con valor emocional." },
  { icon: IconSilla, titulo: "Muebles y Maderas", texto: "Reparación y restauración para que vuelvan a ser parte de tu hogar." },
];

export default function CategoriesMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="hover:text-borgona transition-colors">Categorías</button>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50">
          <div className="w-[560px] rounded-2xl border border-greige/70 bg-marfil shadow-lg p-6 grid grid-cols-2 gap-x-8 gap-y-5 text-left">
            {categorias.map((c) => (
              <Link key={c.titulo} href="/catalogo" className="flex gap-3 group">
                <c.icon className="h-6 w-6 shrink-0 text-borgona mt-0.5" />
                <span>
                  <span className="block text-sm font-medium text-borgona group-hover:underline">
                    {c.titulo}
                  </span>
                  <span className="block text-xs text-carbon/55 mt-0.5">{c.texto}</span>
                </span>
              </Link>
            ))}
            <Link href="/catalogo" className="col-span-2 text-xs text-borgona pt-2 border-t border-greige/50">
              Ver todas las categorías →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
