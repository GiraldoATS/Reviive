"use client";

import { useRouter } from "next/navigation";

export default function VolverLink({ fallbackHref, className }: { fallbackHref: string; className?: string }) {
  const router = useRouter();

  function volver() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }

  return (
    <button type="button" onClick={volver} className={className}>
      ← Volver
    </button>
  );
}
