import { redirect } from "next/navigation";
import { hasAdmin } from "@/app/actions/auth";
import { SetupForm } from "@/components/setup-form";

export default async function SetupPage() {
  const adminExists = await hasAdmin();
  if (adminExists) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Bienvenue
        </h1>
        <p className="text-muted-foreground">
          Configurez votre raccourcisseur d&apos;URL
        </p>
      </div>
      <SetupForm />
    </main>
  );
}
