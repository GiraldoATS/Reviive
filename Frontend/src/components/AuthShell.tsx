import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "./Logo";
import LeafSprig from "./LeafSprig";

type AuthShellProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthShell({ eyebrow, title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-marfil">
      <div className="hidden lg:flex relative flex-col justify-center px-16 overflow-hidden">
        <Image
          src="/images/auth-desk.png"
          alt=""
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-borgona-dark/95 via-borgona-dark/70 to-borgona-dark/40" />
        <LeafSprig className="absolute -top-6 -right-6 h-56 w-56 text-marfil/10 rotate-45 z-10" />
        <LeafSprig className="absolute -bottom-10 -left-6 h-64 w-64 text-marfil/10 -rotate-45 z-10" />
        <div className="relative z-10">
          <Logo tone="marfil" className="mb-10" />
          <h1 className="font-display text-4xl text-marfil leading-tight max-w-sm">
            Tu historia merece ser recordada.
          </h1>
          <p className="mt-5 text-marfil/75 max-w-xs">
            En Reviive cuidamos cada detalle para transformar recuerdos en
            tesoros que trascienden generaciones.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-16 sm:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          {eyebrow && (
            <p className="text-xs uppercase tracking-widest text-borgona text-center mb-2">
              {eyebrow}
            </p>
          )}
          <h2 className="font-display text-3xl text-carbon text-center">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-sm text-carbon/60 text-center">{subtitle}</p>
          )}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
