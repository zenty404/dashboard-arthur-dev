"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createUser } from "@/app/admin/actions";
import { UserPlus } from "lucide-react";

export function CreateUserForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    startTransition(async () => {
      const result = await createUser(username, password, role);
      if (result.success) {
        setSuccess(true);
        setUsername("");
        setPassword("");
        setRole("user");
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserPlus className="h-5 w-5" />
          Ajouter un utilisateur
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Mot de passe (min. 8 car.)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          >
            <option value="user">Utilisateur</option>
            <option value="admin">Admin</option>
          </select>
          <Button type="submit" disabled={isPending} className="shrink-0">
            {isPending ? "Création..." : "Créer"}
          </Button>
        </form>
        {error && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-500 mt-2">Utilisateur créé avec succès</p>
        )}
      </CardContent>
    </Card>
  );
}
