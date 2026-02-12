import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { RegisterForm } from "@/components/register-form";
import { Logo } from "@/components/logo";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
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
      <RegisterForm />
    </main>
  );
}
