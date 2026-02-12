import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ClientList } from "@/components/client-manager/client-list";
import { ArrowLeft, Users } from "lucide-react";

export const dynamic = "force-dynamic";

async function getClients() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
  });
  return JSON.parse(JSON.stringify(clients));
}

export default async function ClientManagerPage() {
  const clients = await getClients();

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
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
              <Users className="h-6 w-6 text-primary" />
              Clients
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérer vos clients et contacts
            </p>
          </div>
          <LogoutButton />
        </div>

        <ClientList clients={clients} />
      </div>
    </main>
  );
}
