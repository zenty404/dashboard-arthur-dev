import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { Logo } from "@/components/logo";
import { QrForm } from "@/components/qr-generator/qr-form";
import { QuotaIndicator } from "@/components/quota-indicator";
import { ArrowLeft, History } from "lucide-react";
import Link from "next/link";
import { getCurrentUserId } from "@/lib/auth";
import { checkQuota } from "@/lib/plans";

export const dynamic = "force-dynamic";

export default async function QrGeneratorPage() {
  const userId = await getCurrentUserId();
  const quota = userId ? await checkQuota(userId, "qrCodes") : null;

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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              QR Generator
            </h1>
            <p className="text-muted-foreground mt-1">
              Création et gestion de QR codes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/tools/qr-generator/history">
                <History className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Historique</span>
              </Link>
            </Button>
            <LogoutButton />
          </div>
        </div>

        <QrForm />
        {quota && (
          <div className="mt-4">
            <QuotaIndicator current={quota.current} limit={quota.limit} resourceLabel="QR codes" />
          </div>
        )}
      </div>
    </main>
  );
}
