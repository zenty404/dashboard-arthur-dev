import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { Logo } from "@/components/logo";
import { InvoiceForm } from "@/components/invoice-generator/invoice-form";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

export default function InvoiceGeneratorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-6xl mx-auto py-8">
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Générateur de Factures
            </h1>
            <p className="text-muted-foreground mt-1">
              Création et export de factures PDF
            </p>
          </div>
          <LogoutButton />
        </div>

        <Suspense fallback={<div className="flex items-center justify-center h-64 text-muted-foreground">Chargement...</div>}>
          <InvoiceForm />
        </Suspense>
      </div>
    </main>
  );
}
