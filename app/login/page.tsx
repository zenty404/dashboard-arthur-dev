import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { hasAdmin } from "@/app/actions/auth";
import { LoginForm } from "@/components/login-form";
import { Logo } from "@/components/logo";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const adminExists = await hasAdmin();
  if (!adminExists) {
    redirect("/setup");
  }

  const authenticated = await isAuthenticated();
  if (authenticated) {
    redirect("/");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="mb-8 text-center">
        <Logo size="lg" className="mb-4" />
        <p className="text-muted-foreground">
          Plateforme de gestion professionnelle
        </p>
      </div>
      <LoginForm />
    </main>
  );
}
