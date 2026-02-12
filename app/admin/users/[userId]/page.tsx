import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { Logo } from "@/components/logo";
import { UserDetail } from "@/components/admin/user-detail";
import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      links: {
        orderBy: { createdAt: "desc" },
        select: { id: true, shortCode: true, originalUrl: true, clicks: true, createdAt: true },
      },
      qrCodes: {
        orderBy: { createdAt: "desc" },
        select: { id: true, content: true, label: true, createdAt: true },
      },
      monitoredSites: {
        orderBy: { createdAt: "desc" },
        select: { id: true, url: true, label: true, isActive: true },
      },
      clients: {
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, createdAt: true },
      },
    },
  });
  if (!user) return null;
  return JSON.parse(JSON.stringify(user));
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  if (!(await isAdmin())) redirect("/");
  const { userId } = await params;
  const user = await getUser(userId);

  if (!user) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Administration
                </Link>
              </Button>
            </div>
            <Logo size="sm" className="mb-2" />
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
              <Shield className="h-6 w-6 text-red-500" />
              Détail utilisateur
            </h1>
          </div>
          <LogoutButton />
        </div>

        <UserDetail user={user} />
      </div>
    </main>
  );
}
