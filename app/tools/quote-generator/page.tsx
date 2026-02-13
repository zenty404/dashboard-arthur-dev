import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { Logo } from "@/components/logo";
import { QuoteForm } from "@/components/quote-generator/quote-form";
import { ArrowLeft, FileSignature, AlertCircle, Settings } from "lucide-react";
import Link from "next/link";
import { getCurrentUserId } from "@/lib/auth";
import { getUserPlan } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { buildEmitterSettings, EMITTER_SELECT } from "@/lib/emitter-settings";

export const dynamic = "force-dynamic";

export default async function QuoteGeneratorPage() {
  const userId = await getCurrentUserId();
  const plan = userId ? await getUserPlan(userId) : "free";

  let emitterSettings = null;
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: EMITTER_SELECT,
    });
    if (user) {
      emitterSettings = buildEmitterSettings(user);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            </div>
            <Logo size="sm" className="mb-2" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <FileSignature className="h-6 w-6 text-primary" />
              Générateur de Devis
            </h1>
            <p className="text-muted-foreground mt-1">
              Création et export de devis PDF
            </p>
          </div>
          <LogoutButton />
        </div>

        {!emitterSettings ? (
          <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-8 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-orange-400 mx-auto" />
            <h2 className="text-lg font-semibold">Paramètres de facturation requis</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Vous devez configurer vos informations d&apos;émetteur (nom, SIRET, coordonnées bancaires) avant de pouvoir générer des devis.
            </p>
            <Button asChild>
              <Link href="/account/billing-settings" className="inline-flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurer mes paramètres
              </Link>
            </Button>
          </div>
        ) : (
          <Suspense fallback={<div className="flex items-center justify-center h-64 text-muted-foreground">Chargement...</div>}>
            <QuoteForm plan={plan} emitterSettings={emitterSettings} />
          </Suspense>
        )}
      </div>
    </main>
  );
}
