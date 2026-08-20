import type { ReactNode } from "react";

export default function SimpleTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-greige/70 bg-white/60">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-greige/60 text-left text-xs uppercase tracking-wide text-carbon/45">
            {columns.map((c) => (
              <th key={c} className="px-4 py-3 font-medium whitespace-nowrap">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-greige/40 last:border-0 hover:bg-marfil/60">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-middle whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
