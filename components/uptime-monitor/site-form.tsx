"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addSite } from "@/app/tools/uptime-monitor/actions";
import { Activity, Loader2, Plus } from "lucide-react";

export function SiteForm() {
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = () => {
    if (!url.trim()) {
      setMessage({ type: "error", text: "L'URL est requise" });
      return;
    }

    startTransition(async () => {
      const result = await addSite(url, label);
      if (result.success) {
        setMessage({ type: "success", text: "Site ajouté !" });
        setUrl("");
        setLabel("");
      } else {
        setMessage({ type: "error", text: result.error });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-orange-500" />
          Ajouter un site
        </CardTitle>
        <CardDescription>
          Entrez l&apos;URL du site à surveiller
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="url" className="text-sm font-medium">
            URL *
          </label>
          <Input
            id="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="label" className="text-sm font-medium">
            Label (optionnel)
          </label>
          <Input
            id="label"
            placeholder="Mon site web"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
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

        <Button
          onClick={handleSubmit}
          disabled={isPending || !url.trim()}
          className="w-full"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Ajouter
        </Button>
      </CardContent>
    </Card>
  );
}
