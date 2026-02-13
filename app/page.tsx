import { LogoutButton } from "@/components/logout-button";
import { Logo } from "@/components/logo";
import { ToolCard } from "@/components/dashboard/tool-card";
import { tools, Tool } from "@/lib/tools";
import { isAdmin } from "@/lib/auth";
import { Shield, CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

const accountTool: Tool = {
  id: "account",
  name: "Mon compte",
  description: "Abonnement et paramètres du compte",
  icon: CreditCard,
  href: "/account",
  color: "green",
};

const adminTool: Tool = {
  id: "admin",
  name: "Administration",
  description: "Gestion des utilisateurs et supervision",
  icon: Shield,
  href: "/admin",
  color: "red",
};

export default async function DashboardPage() {
  const admin = await isAdmin();

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div className="min-w-0">
            <Logo size="lg" className="mb-2" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Tableau de bord
            </h1>
            <p className="text-muted-foreground mt-1">
              Accédez à vos outils de gestion
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
          <ToolCard tool={accountTool} />
          {admin && <ToolCard tool={adminTool} />}
        </div>
      </div>
    </main>
  );
}
