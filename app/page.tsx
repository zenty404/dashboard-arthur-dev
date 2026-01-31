import Link from "next/link";
import { UrlShortenerForm } from "@/components/url-shortener-form";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Raccourcisseur d&apos;URL
        </h1>
        <p className="text-muted-foreground">
          Simple, rapide et efficace
        </p>
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
