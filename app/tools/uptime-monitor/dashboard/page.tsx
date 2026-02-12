import { prisma } from "@/lib/prisma";
import { getCurrentUserId, isAdmin } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  Globe,
  Percent,
  Zap,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { Logo } from "@/components/logo";

export const dynamic = "force-dynamic";

async function getStats() {
  const admin = await isAdmin();
  const userId = await getCurrentUserId();
  const siteWhere = admin ? {} : { userId };

  const sites = await prisma.monitoredSite.findMany({ where: siteWhere });
  const siteIds = sites.map((s) => s.id);

  const checkWhere = admin ? {} : { siteId: { in: siteIds } };

  const checks = await prisma.uptimeCheck.findMany({
    where: checkWhere,
    orderBy: { checkedAt: "desc" },
    take: 100,
    include: {
      site: { select: { label: true, url: true } },
    },
  });

  const allChecks = await prisma.uptimeCheck.findMany({
    where: checkWhere,
    select: { isUp: true, responseTime: true },
  });

  const totalChecks = allChecks.length;
  const upChecks = allChecks.filter((c) => c.isUp).length;
  const avgUptime = totalChecks > 0 ? (upChecks / totalChecks) * 100 : 0;

  const checksWithTime = allChecks.filter((c) => c.responseTime != null);
  const avgResponseTime =
    checksWithTime.length > 0
      ? checksWithTime.reduce((sum, c) => sum + (c.responseTime ?? 0), 0) /
        checksWithTime.length
      : 0;

  return {
    totalSites: sites.length,
    avgUptime,
    avgResponseTime,
    recentChecks: checks,
  };
}

export default async function UptimeDashboardPage() {
  const { totalSites, avgUptime, avgResponseTime, recentChecks } =
    await getStats();

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
            <Link href="/tools/uptime-monitor">
              <Logo size="sm" className="mb-2" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
              <BarChart3 className="h-6 w-6 text-primary" />
              Historique
            </h1>
            <p className="text-muted-foreground mt-1">
              Statistiques de disponibilité
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link
                href="/tools/uptime-monitor"
                className="flex items-center gap-2"
              >
                <Activity className="h-4 w-4" />
                Moniteur
              </Link>
            </Button>
            <LogoutButton />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Sites surveillés
              </CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSites}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Disponibilité moyenne
              </CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {avgUptime.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Temps de réponse moyen
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(avgResponseTime)} ms
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dernières vérifications</CardTitle>
            <CardDescription>
              Les 100 derniers checks effectués
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentChecks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aucune vérification effectuée pour le moment.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site</TableHead>
                    <TableHead className="text-center">Statut</TableHead>
                    <TableHead className="text-center hidden sm:table-cell">
                      Code HTTP
                    </TableHead>
                    <TableHead className="text-center hidden sm:table-cell">
                      Temps de réponse
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentChecks.map((check) => (
                    <TableRow key={check.id}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {check.site.label || check.site.url}
                      </TableCell>
                      <TableCell className="text-center">
                        {check.isUp ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            En ligne
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-500">
                            <XCircle className="h-3 w-3" />
                            Hors ligne
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center hidden sm:table-cell text-muted-foreground">
                        {check.statusCode ?? "—"}
                      </TableCell>
                      <TableCell className="text-center hidden sm:table-cell text-muted-foreground">
                        {check.responseTime != null
                          ? `${check.responseTime} ms`
                          : "—"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {new Date(check.checkedAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
