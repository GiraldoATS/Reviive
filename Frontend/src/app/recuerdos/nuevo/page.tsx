import SiteShell from "@/components/SiteShell";
import RegistroRecuerdoForm from "@/components/RegistroRecuerdoForm";

export default function RegistroRecuerdoPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-6 py-14">
        <RegistroRecuerdoForm />
      </div>
    </SiteShell>
  );
}
