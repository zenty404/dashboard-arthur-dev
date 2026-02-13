"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="text-center space-y-4 max-w-md">
        <AlertTriangle className="h-12 w-12 text-orange-400 mx-auto" />
        <h2 className="text-lg font-semibold">Une erreur est survenue</h2>
        <p className="text-muted-foreground text-sm">
          Le chargement de la page a rencontré un problème. Veuillez
          rafraichir la page.
        </p>
        {error?.digest && (
          <p className="text-xs text-muted-foreground/60 font-mono">
            Code : {error.digest}
          </p>
        )}
        <div className="flex gap-2 justify-center">
          <Button onClick={reset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Rafraichir
          </Button>
          <Button variant="outline" asChild>
            <a href="/">Retour au tableau de bord</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
