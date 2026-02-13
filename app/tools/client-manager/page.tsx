import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, isAdmin } from "@/lib/auth";
import { checkQuota } from "@/lib/plans";
import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ClientList } from "@/components/client-manager/client-list";
import { QuotaIndicator } from "@/components/quota-indicator";
import { ArrowLeft, Users } from "lucide-react";

export const dynamic = "force-dynamic";

async function getClients() {
  try {
    const admin = await isAdmin();
    const userId = await getCurrentUserId();
    const clients = await prisma.client.findMany({
      where: admin ? {} : { userId },
      orderBy: { createdAt: "desc" },
    });
    return JSON.parse(JSON.stringify(clients));
  } catch (error) {
    console.error("Erreur lors du chargement des clients:", error);
    return [];
  }
}

export default async function ClientManagerPage() {
  let clients: ReturnType<typeof getClients> extends Promise<infer T> ? T : never = [];
  let userId: string | null = null;
  let quota: { allowed: boolean; current: number; limit: number } | null = null;

  try {
    clients = await getClients();
  } catch (error) {
    console.error("[CLIENT-MANAGER] getClients crash:", error);
  }

  try {
    userId = await getCurrentUserId();
  } catch (error) {
    console.error("[CLIENT-MANAGER] getCurrentUserId crash:", error);
  }

  try {
    quota = userId ? await checkQuota(userId, "clients") : null;
  } catch (error) {
    console.error("[CLIENT-MANAGER] checkQuota crash:", error);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
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
              <Users className="h-6 w-6 text-primary" />
              Clients
            </h1>
            <p className="text-muted-foreground mt-1">
              Gestion de la base clients et contacts
            </p>
          </div>
          <LogoutButton />
        </div>

        {quota && (
          <div className="mb-4">
            <QuotaIndicator current={quota.current} limit={quota.limit} resourceLabel="clients" />
          </div>
        )}
        <ClientList clients={clients} />
      </div>
    </main>
  );
}
