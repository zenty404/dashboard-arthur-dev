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
import { createQrCode, generateQrDataUrl } from "@/app/tools/qr-generator/actions";
import { QrCode, Download, Loader2, Save } from "lucide-react";

export function QrForm() {
  const [content, setContent] = useState("");
  const [label, setLabel] = useState("");
  const [size, setSize] = useState("256");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSaving, startSaving] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleGenerate = () => {
    if (!content.trim()) {
      setMessage({ type: "error", text: "Le contenu est requis" });
      return;
    }

    startTransition(async () => {
      const result = await generateQrDataUrl(content, parseInt(size));
      if (result.error) {
        setMessage({ type: "error", text: result.error });
        setQrDataUrl(null);
      } else if (result.dataUrl) {
        setQrDataUrl(result.dataUrl);
        setMessage(null);
      }
    });
  };

  const handleSave = () => {
    if (!content.trim()) return;

    const formData = new FormData();
    formData.set("content", content);
    formData.set("label", label);
    formData.set("size", size);

    startSaving(async () => {
      const result = await createQrCode(formData);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "QR code sauvegardé !" });
      }
    });
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.download = `qrcode-${label || "download"}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            Nouveau QR Code
          </CardTitle>
          <CardDescription>
            Entrez le contenu à encoder (URL, texte, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Contenu *
            </label>
            <Input
              id="content"
              placeholder="https://example.com ou texte..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="label" className="text-sm font-medium">
              Label (optionnel)
            </label>
            <Input
              id="label"
              placeholder="Nom du QR code"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="size" className="text-sm font-medium">
              Taille
            </label>
            <select
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="128">128 x 128 px</option>
              <option value="256">256 x 256 px</option>
              <option value="512">512 x 512 px</option>
              <option value="1024">1024 x 1024 px</option>
            </select>
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
            onClick={handleGenerate}
            disabled={isPending || !content.trim()}
            className="w-full"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <QrCode className="h-4 w-4 mr-2" />
            )}
            Générer
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aperçu</CardTitle>
          <CardDescription>
            QR code généré
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
          {qrDataUrl ? (
            <>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="max-w-full"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Sauvegarder
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              <QrCode className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p>Entrez du contenu et cliquez sur Générer</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
