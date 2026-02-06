"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  deleteSite,
  toggleSiteActive,
  checkSiteNow,
} from "@/app/tools/uptime-monitor/actions";
import { Trash2, Power, PowerOff, RefreshCw, Loader2 } from "lucide-react";

interface SiteActionsProps {
  siteId: string;
  isActive: boolean;
}

export function SiteActions({ siteId, isActive }: SiteActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCheck = () => {
    startTransition(async () => {
      await checkSiteNow(siteId);
    });
  };

  const handleToggle = () => {
    startTransition(async () => {
      await toggleSiteActive(siteId);
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteSite(siteId);
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
        onClick={handleCheck}
        disabled={isPending}
        title="Vérifier maintenant"
      >
        {isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <RefreshCw className="text-orange-500" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={handleToggle}
        disabled={isPending}
        title={isActive ? "Désactiver la surveillance" : "Activer la surveillance"}
      >
        {isActive ? (
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
        title="Supprimer le site"
      >
        <Trash2 className="text-destructive" />
      </Button>
    </div>
  );
}
