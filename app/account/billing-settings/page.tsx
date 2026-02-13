import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildEmitterSettings, EMITTER_SELECT } from "@/lib/emitter-settings";
import { EmitterSettingsForm } from "@/components/account/emitter-settings-form";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BillingSettingsPage() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: EMITTER_SELECT,
  });

  if (!user) {
    redirect("/login");
  }

  const settings = buildEmitterSettings(user);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-3xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/account" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Mon compte
                </Link>
              </Button>
            </div>
            <Logo size="sm" className="mb-2" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              Paramètres de facturation
            </h1>
            <p className="text-muted-foreground mt-1">
              Configurez vos informations d&apos;émetteur pour les factures et devis
            </p>
          </div>
        </div>

        <EmitterSettingsForm initialSettings={settings} />
      </div>
    </main>
  );
}
