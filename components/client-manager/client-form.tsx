"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient, updateClient } from "@/app/tools/client-manager/actions";
import { Users, Loader2, Plus, Save, X } from "lucide-react";

interface ClientData {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
}

interface ClientFormProps {
  editingClient?: ClientData | null;
  onCancel?: () => void;
  onSaved?: () => void;
}

export function ClientForm({ editingClient, onCancel, onSaved }: ClientFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const isEditing = !!editingClient;

  useEffect(() => {
    if (editingClient) {
      setName(editingClient.name);
      setEmail(editingClient.email || "");
      setPhone(editingClient.phone || "");
      setAddress(editingClient.address || "");
      setCity(editingClient.city || "");
      setNotes(editingClient.notes || "");
      setMessage(null);
    }
  }, [editingClient]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setCity("");
    setNotes("");
    setMessage(null);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setMessage({ type: "error", text: "Le nom est requis" });
      return;
    }

    const data = { name, email, phone, address, city, notes };

    startTransition(async () => {
      const result = isEditing
        ? await updateClient(editingClient!.id, data)
        : await createClient(data);

      if (result.success) {
        setMessage({
          type: "success",
          text: isEditing ? "Client modifié !" : "Client ajouté !",
        });
        if (!isEditing) {
          resetForm();
        } else {
          onSaved?.();
        }
      } else {
        setMessage({ type: "error", text: result.error });
      }
    });
  };

  const handleCancel = () => {
    resetForm();
    onCancel?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          {isEditing ? "Modifier le client" : "Ajouter un client"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Modifiez les informations du client"
            : "Entrez les informations du nouveau client"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nom / Entreprise *
          </label>
          <Input
            id="name"
            placeholder="Entreprise Clément Plomberie"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="contact@exemple.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Téléphone
            </label>
            <Input
              id="phone"
              placeholder="06 12 34 56 78"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">
              Adresse
            </label>
            <Input
              id="address"
              placeholder="15 Rue de Paris"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium">
              Code postal et Ville
            </label>
            <Input
              id="city"
              placeholder="77700 Magny-le-Hongre"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium">
            Notes
          </label>
          <Input
            id="notes"
            placeholder="Informations complémentaires..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {message && (
          <p
            className={`text-sm ${
              message.type === "error" ? "text-destructive" : "text-green-600"
            }`}
          >
            {message.text}
          </p>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            disabled={isPending || !name.trim()}
            className="flex-1"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : isEditing ? (
              <Save className="h-4 w-4 mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {isEditing ? "Enregistrer" : "Ajouter"}
          </Button>
          {isEditing && (
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
