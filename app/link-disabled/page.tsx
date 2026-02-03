import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Ban } from "lucide-react";
import { Logo } from "@/components/logo";

export default function LinkDisabled() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Logo size="md" className="mb-6" />
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Ban className="h-16 w-16 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Lien désactivé</CardTitle>
          <CardDescription>
            Ce lien raccourci a été désactivé par son propriétaire.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/">Créer un nouveau lien</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
