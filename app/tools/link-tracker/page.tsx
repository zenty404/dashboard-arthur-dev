import Link from "next/link";
import { UrlShortenerForm } from "@/components/link-tracker/url-shortener-form";
import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { QuotaIndicator } from "@/components/quota-indicator";
import { BarChart3, ArrowLeft } from "lucide-react";
import { getCurrentUserId } from "@/lib/auth";
import { checkQuota } from "@/lib/plans";

export const dynamic = "force-dynamic";

export default async function LinkTrackerPage() {
  const userId = await getCurrentUserId();
  const quota = userId ? await checkQuota(userId, "links") : null;

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted p-4">
      <div className="flex items-center justify-between flex-wrap gap-4 max-w-4xl mx-auto w-full pt-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </Button>
        <LogoutButton />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
      <div className="mb-8 text-center">
        <Logo size="lg" className="mb-4" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Suivi de liens
        </h1>
      </div>
      <UrlShortenerForm />
      {quota && (
        <div className="mt-4">
          <QuotaIndicator current={quota.current} limit={quota.limit} resourceLabel="liens" />
        </div>
      )}
      <div className="mt-6">
        <Button variant="ghost" asChild>
          <Link href="/tools/link-tracker/stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Voir les statistiques
          </Link>
        </Button>
      </div>
      </div>
    </main>
  );
}
