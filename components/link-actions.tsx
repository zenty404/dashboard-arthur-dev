"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteLink, toggleLinkActive } from "@/app/actions/links";
import { Trash2, Power, PowerOff, Loader2 } from "lucide-react";

interface LinkActionsProps {
  linkId: string;
  isActive: boolean;
}

export function LinkActions({ linkId, isActive }: LinkActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggle = () => {
    startTransition(async () => {
      await toggleLinkActive(linkId);
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteLink(linkId);
      setShowDeleteConfirm(false);
    });
  };

  if (showDeleteConfirm) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="destructive"
          size="xs"
          onClick={handleDelete}
          disabled={isPending}
        >
          {isPending ? <Loader2 className="animate-spin" /> : "Confirmer"}
        </Button>
        <Button
          variant="outline"
          size="xs"
          onClick={() => setShowDeleteConfirm(false)}
          disabled={isPending}
        >
          Annuler
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={handleToggle}
        disabled={isPending}
        title={isActive ? "Désactiver le lien" : "Activer le lien"}
      >
        {isPending ? (
          <Loader2 className="animate-spin" />
        ) : isActive ? (
          <Power className="text-green-600" />
        ) : (
          <PowerOff className="text-muted-foreground" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => setShowDeleteConfirm(true)}
        disabled={isPending}
        title="Supprimer le lien"
      >
        <Trash2 className="text-destructive" />
      </Button>
    </div>
  );
}
