import Link from "next/link";
import { UrlShortenerForm } from "@/components/url-shortener-form";
import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="absolute top-4 right-4">
        <LogoutButton />
      </div>
      <div className="mb-8 text-center">
        <Logo size="lg" className="mb-4" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Suivi de liens
        </h1>
      </div>
      <UrlShortenerForm />
      <div className="mt-6">
        <Button variant="ghost" asChild>
          <Link href="/stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Voir les statistiques
          </Link>
        </Button>
      </div>
    </main>
  );
}
