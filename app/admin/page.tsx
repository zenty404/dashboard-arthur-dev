import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { Logo } from "@/components/logo";
import { CreateUserForm } from "@/components/admin/create-user-form";
import { UserList } from "@/components/admin/user-list";
import { ArrowLeft, Shield, Users } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          links: true,
          qrCodes: true,
          monitoredSites: true,
          clients: true,
        },
      },
    },
  });
  return JSON.parse(JSON.stringify(users));
}

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/");
  const users = await getUsers();

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
              <Shield className="h-6 w-6 text-red-500" />
              Administration
            </h1>
            <p className="text-muted-foreground mt-1">
              Gestion des utilisateurs et de l&apos;activité
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Utilisateurs
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <CreateUserForm />

          <Card>
            <CardHeader>
              <CardTitle>Tous les utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucun utilisateur.
                </p>
              ) : (
                <UserList users={users} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
