import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { hasAdmin } from "@/app/actions/auth";
import { LoginForm } from "@/components/login-form";

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
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Raccourcisseur d&apos;URL
        </h1>
        <p className="text-muted-foreground">
          Accès réservé aux administrateurs
        </p>
      </div>
      <LoginForm />
    </main>
  );
}
