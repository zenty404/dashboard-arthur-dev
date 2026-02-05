import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { Logo } from "@/components/logo";
import { QrForm } from "@/components/qr-generator/qr-form";
import { ArrowLeft, History } from "lucide-react";
import Link from "next/link";

export default function QrGeneratorPage() {
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              QR Generator
            </h1>
            <p className="text-muted-foreground mt-1">
              Générez des QR codes pour vos URLs et textes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/tools/qr-generator/history">
                <History className="h-4 w-4 mr-2" />
                Historique
              </Link>
            </Button>
            <LogoutButton />
          </div>
        </div>

        <QrForm />
      </div>
    </main>
  );
}
