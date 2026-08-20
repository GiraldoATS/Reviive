import Button from "./Button";

export default function FilterBar({
  fields,
}: {
  fields: { label: string; placeholder: string }[];
}) {
  return (
    <div className="rounded-2xl border border-greige/70 bg-white/60 p-5 mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
      {fields.map((f) => (
        <label key={f.label} className="block">
          <span className="block text-xs uppercase tracking-wide text-carbon/50 mb-1.5">
            {f.label}
          </span>
          <select className="input" defaultValue="">
            <option value="" disabled>
              {f.placeholder}
            </option>
          </select>
        </label>
      ))}
      <div className="flex gap-2">
        <Button variant="secondary" className="flex-1 justify-center">
          Limpiar
        </Button>
        <Button variant="primary" className="flex-1 justify-center">
          Buscar
        </Button>
      </div>
    </div>
  );
}
