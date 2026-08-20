import SiteShell from "@/components/SiteShell";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { IconUser, IconMadera, IconSettings } from "@/components/icons";

const roles = [
  {
    icon: IconUser,
    titulo: "Cliente",
    texto: "Explora servicios, registra tu recuerdo y da seguimiento a tus pedidos.",
    href: "/auth/registro/cliente",
    label: "Ingresar como cliente",
    destacado: false,
  },
  {
    icon: IconMadera,
    titulo: "Proveedor",
    texto: "Gestiona tu taller, cotizaciones y pedidos. Impulsa tu marca con Reviive.",
    href: "/auth/registro/proveedor",
    label: "Ingresar como proveedor",
    destacado: true,
  },
  {
    icon: IconSettings,
    titulo: "Administrador",
    texto: "Administra la plataforma, usuarios, proveedores y configuraciones.",
    href: "/admin",
    label: "Ingresar como administrador",
    destacado: false,
  },
];

export default function SeleccionarRolPage() {
  return (
    <SiteShell hideFloatingAlma>
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="font-display text-3xl md:text-4xl text-carbon">
          Elige cómo quieres ingresar a <span className="text-borgona">Reviive</span>
        </h1>
        <p className="mt-3 text-sm text-carbon/60">
          Selecciona el rol con el que deseas acceder al portal. Podrás cambiarlo en cualquier momento desde tu perfil.
        </p>

        <div className="mt-10 grid md:grid-cols-3 gap-6 text-left">
          {roles.map((r) => (
            <Card key={r.titulo} className={r.destacado ? "border-dorado bg-rosa/10" : ""}>
              <div className="h-14 w-14 rounded-full bg-marfil border border-greige/70 flex items-center justify-center mx-auto">
                <r.icon className="h-7 w-7 text-borgona" />
              </div>
              <h2 className="mt-4 font-display text-xl text-carbon text-center">{r.titulo}</h2>
              <p className="mt-2 text-sm text-carbon/60 text-center">{r.texto}</p>
              <Button
                href={r.href}
                variant={r.destacado ? "primary" : "secondary"}
                className="w-full justify-center mt-5"
              >
                {r.label} →
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
