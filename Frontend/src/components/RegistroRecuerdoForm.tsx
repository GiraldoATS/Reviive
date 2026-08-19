"use client";

import { useState } from "react";
import Button from "./Button";

const pasos = [
  "Información del objeto",
  "Fotos",
  "Estado actual",
  "Historia",
  "Confirmación",
];

export default function RegistroRecuerdoForm() {
  const [pasoActual, setPasoActual] = useState(0);
  const [form, setForm] = useState({
    tipoObjeto: "Reloj de bolsillo",
    marca: "",
    anioAproximado: "",
    descripcion: "",
    historia: "",
  });

  const esUltimo = pasoActual === pasos.length - 1;

  function actualizar<K extends keyof typeof form>(campo: K, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-10">
      <ol className="space-y-1">
        {pasos.map((paso, i) => (
          <li key={paso}>
            <button
              onClick={() => setPasoActual(i)}
              className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${
                i === pasoActual
                  ? "bg-rosa/40 text-borgona-dark font-medium"
                  : i < pasoActual
                  ? "text-borgona/70"
                  : "text-carbon/50"
              }`}
            >
              {i + 1}. {paso}
            </button>
          </li>
        ))}
      </ol>

      <div className="rounded-2xl border border-greige/70 bg-white/60 p-8">
        <h2 className="font-display text-xl text-carbon mb-1">
          Cuéntanos sobre tu recuerdo
        </h2>
        <p className="text-sm text-carbon/60 mb-6">
          Cada detalle nos ayuda a devolverle su historia.
        </p>

        {pasoActual === 0 && (
          <div className="space-y-4">
            <Field label="¿Qué objeto es?">
              <select
                value={form.tipoObjeto}
                onChange={(e) => actualizar("tipoObjeto", e.target.value)}
                className="input"
              >
                <option>Reloj de bolsillo</option>
                <option>Reloj de pulsera</option>
                <option>Joya</option>
                <option>Cámara</option>
                <option>Máquina de escribir</option>
                <option>Fotografía</option>
                <option>Otro</option>
              </select>
            </Field>
            <Field label="Marca (si la conoces)">
              <input
                value={form.marca}
                onChange={(e) => actualizar("marca", e.target.value)}
                placeholder="Ej. Omega"
                className="input"
              />
            </Field>
            <Field label="Año aproximado">
              <input
                value={form.anioAproximado}
                onChange={(e) => actualizar("anioAproximado", e.target.value)}
                placeholder="Ej. 1940"
                className="input"
              />
            </Field>
          </div>
        )}

        {pasoActual === 1 && (
          <div className="border-2 border-dashed border-greige/80 rounded-xl py-16 text-center text-sm text-carbon/60">
            Arrastra fotos del objeto o haz clic para seleccionarlas.
          </div>
        )}

        {pasoActual === 2 && (
          <Field label="Descripción del estado actual">
            <textarea
              value={form.descripcion}
              onChange={(e) => actualizar("descripcion", e.target.value)}
              rows={5}
              placeholder="Ej. Reloj de mi abuelo, no funciona hace años y quiero restaurarlo."
              className="input resize-none"
            />
          </Field>
        )}

        {pasoActual === 3 && (
          <Field label="¿Qué historia tiene este objeto para ti?">
            <textarea
              value={form.historia}
              onChange={(e) => actualizar("historia", e.target.value)}
              rows={5}
              placeholder="Mientras más información tengamos, mejor será el resultado de la restauración."
              className="input resize-none"
            />
          </Field>
        )}

        {esUltimo && (
          <div className="rounded-xl bg-marfil border border-greige/70 p-5 text-sm space-y-2">
            <p><span className="text-carbon/50">Objeto:</span> {form.tipoObjeto}</p>
            <p><span className="text-carbon/50">Marca:</span> {form.marca || "No especificada"}</p>
            <p><span className="text-carbon/50">Año aproximado:</span> {form.anioAproximado || "No especificado"}</p>
            <p><span className="text-carbon/50">Historia:</span> {form.historia || "No especificada"}</p>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <Button
            variant="secondary"
            onClick={() => setPasoActual((p) => Math.max(0, p - 1))}
            className={pasoActual === 0 ? "invisible" : ""}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            href={esUltimo ? "/recomendaciones" : undefined}
            onClick={
              esUltimo
                ? undefined
                : () => setPasoActual((p) => Math.min(pasos.length - 1, p + 1))
            }
          >
            {esUltimo ? "Ver recomendaciones →" : "Continuar"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
