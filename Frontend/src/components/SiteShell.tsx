import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingAlma from "./FloatingAlma";

export default function SiteShell({
  children,
  hideFloatingAlma = false,
}: {
  children: ReactNode;
  hideFloatingAlma?: boolean;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      {!hideFloatingAlma && <FloatingAlma />}
    </>
  );
}
