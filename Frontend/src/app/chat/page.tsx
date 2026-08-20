import SiteShell from "@/components/SiteShell";
import ChatAlma from "@/components/ChatAlma";

export default function ChatPage() {
  return (
    <SiteShell hideFloatingAlma>
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl text-carbon">Chat con Alma</h1>
          <p className="text-sm text-carbon/60 mt-1">
            Tu asistente para acompañarte en cada paso de la restauración.
          </p>
        </div>
        <ChatAlma />
      </div>
    </SiteShell>
  );
}
