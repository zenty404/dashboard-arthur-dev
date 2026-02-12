"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteClient } from "@/app/tools/client-manager/actions";
import {
  Mail,
  Phone,
  MapPin,
  StickyNote,
  Pencil,
  Trash2,
  FileText,
  FileSignature,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface ClientCardProps {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
  onEdit: () => void;
}

export function ClientCard({
  id,
  name,
  email,
  phone,
  address,
  city,
  notes,
  onEdit,
}: ClientCardProps) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteClient(id);
    });
  };

  const clientParam = btoa(
    JSON.stringify({ clientName: name, clientAddress: address || "", clientCity: city || "" })
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{name}</CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            {confirming ? (
              <div className="flex items-center gap-1">
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={handleDelete}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    "Oui"
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setConfirming(false)}
                >
                  Non
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => setConfirming(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5 text-sm text-muted-foreground">
          {email && (
            <p className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              {email}
            </p>
          )}
          {phone && (
            <p className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              {phone}
            </p>
          )}
          {(address || city) && (
            <p className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {[address, city].filter(Boolean).join(", ")}
            </p>
          )}
          {notes && (
            <p className="flex items-center gap-2 italic">
              <StickyNote className="h-3.5 w-3.5 shrink-0" />
              {notes}
            </p>
          )}
        </div>

        <div className="flex gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/tools/invoice-generator?client=${clientParam}`}>
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Facture
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/tools/quote-generator?client=${clientParam}`}>
              <FileSignature className="h-3.5 w-3.5 mr-1.5" />
              Devis
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
