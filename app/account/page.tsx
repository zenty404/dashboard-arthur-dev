import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { LogoutButton } from "@/components/logout-button";
import { PlanCard } from "@/components/account/plan-card";
import { isEmitterConfigured } from "@/lib/emitter-settings";
import { ArrowLeft, User, Settings, AlertCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      username: true,
      role: true,
      plan: true,
      planExpiresAt: true,
      createdAt: true,
      businessName: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-4xl mx-auto py-8">
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
              <User className="h-6 w-6 text-primary" />
              Mon compte
            </h1>
          </div>
          <LogoutButton />
        </div>

        <div className="space-y-6">
          {/* User info */}
          <div className="rounded-lg border p-4">
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Identifiant</span>
                <span className="font-medium">{user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rôle</span>
                <span className="font-medium">{user.role === "admin" ? "Administrateur" : "Utilisateur"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Membre depuis</span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>
          </div>

          {/* Billing settings link */}
          <Link href="/account/billing-settings" className="block">
            <div className="rounded-lg border p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Paramètres de facturation</p>
                    <p className="text-sm text-muted-foreground">
                      Informations émetteur, coordonnées bancaires et TVA
                    </p>
                  </div>
                </div>
                {!isEmitterConfigured(user) && (
                  <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30">
                    <AlertCircle className="h-3 w-3" />
                    Non configuré
                  </span>
                )}
              </div>
            </div>
          </Link>

          {/* Plan card */}
          <PlanCard
            plan={user.plan}
            role={user.role}
            planExpiresAt={user.planExpiresAt?.toISOString() ?? null}
          />
        </div>
      </div>
    </main>
  );
}
