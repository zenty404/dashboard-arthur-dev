"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ClientForm } from "./client-form";
import { ClientCard } from "./client-card";
import { Search, Users } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
  createdAt: string;
}

interface ClientListProps {
  clients: Client[];
}

export function ClientList({ clients }: ClientListProps) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.toLowerCase().includes(q)) ||
      (c.city && c.city.toLowerCase().includes(q))
    );
  });

  const editingClient = editingId
    ? clients.find((c) => c.id === editingId) || null
    : null;

  return (
    <div className="space-y-6">
      <ClientForm
        editingClient={editingClient}
        onCancel={() => setEditingId(null)}
        onSaved={() => setEditingId(null)}
      />

      {clients.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {clients.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p>Aucun client pour le moment.</p>
          <p className="text-sm mt-1">
            Ajoutez un client ci-dessus pour commencer.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p>Aucun résultat pour &quot;{search}&quot;</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((client) => (
            <ClientCard
              key={client.id}
              id={client.id}
              name={client.name}
              email={client.email}
              phone={client.phone}
              address={client.address}
              city={client.city}
              notes={client.notes}
              onEdit={() => setEditingId(client.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
