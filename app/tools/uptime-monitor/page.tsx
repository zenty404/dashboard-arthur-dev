import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, isAdmin } from "@/lib/auth";
import { checkQuota } from "@/lib/plans";
import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { SiteForm } from "@/components/uptime-monitor/site-form";
import { SiteCard } from "@/components/uptime-monitor/site-card";
import { AutoChecker } from "@/components/uptime-monitor/auto-checker";
import { QuotaIndicator } from "@/components/quota-indicator";
import { BarChart3, ArrowLeft, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

async function getSites() {
  try {
    const admin = await isAdmin();
    const userId = await getCurrentUserId();
    return prisma.monitoredSite.findMany({
      where: admin ? {} : { userId },
      orderBy: { createdAt: "desc" },
      include: {
        uptimeChecks: {
          orderBy: { checkedAt: "desc" },
          take: 1,
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors du chargement des sites:", error);
    return [];
  }
}

export default async function UptimeMonitorPage() {
  const sites = await getSites();
  const userId = await getCurrentUserId();
  let quota = null;
  try {
    quota = userId ? await checkQuota(userId, "sites") : null;
  } catch (error) {
    console.error("Erreur lors de la vérification du quota:", error);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <AutoChecker />
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div className="min-w-0">
            <div className="flex items-center gap-4 mb-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            </div>
            <Logo size="sm" className="mb-2" />
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
              <Activity className="h-6 w-6 text-orange-500" />
              Moniteur de Sites
            </h1>
            <p className="text-muted-foreground mt-1">
              Surveillance et monitoring de disponibilité
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link
                href="/tools/uptime-monitor/dashboard"
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4 sm:mr-0" />
                <span className="hidden sm:inline">Historique</span>
              </Link>
            </Button>
            <LogoutButton />
          </div>
        </div>

        <div className="mb-8">
          <SiteForm />
          {quota && (
            <div className="mt-4">
              <QuotaIndicator current={quota.current} limit={quota.limit} resourceLabel="sites" />
            </div>
          )}
        </div>

        {sites.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Activity className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p>Aucun site surveillé pour le moment.</p>
            <p className="text-sm mt-1">
              Ajoutez un site ci-dessus pour commencer.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sites.map((site) => (
              <SiteCard
                key={site.id}
                id={site.id}
                url={site.url}
                label={site.label}
                isActive={site.isActive}
                lastCheck={site.uptimeChecks[0] ?? null}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
