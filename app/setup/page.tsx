import { redirect } from "next/navigation";
import { hasAdmin } from "@/app/actions/auth";
import { SetupForm } from "@/components/setup-form";
import { Logo } from "@/components/logo";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const adminExists = await hasAdmin();
  if (adminExists) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="mb-8 text-center">
        <Logo size="lg" className="mb-4" />
        <h1 className="text-2xl font-semibold tracking-tight mb-2 text-foreground">
          Configuration
        </h1>
        <p className="text-muted-foreground">
          Configuration de votre espace
        </p>
      </div>
      <SetupForm />
    </main>
  );
}
