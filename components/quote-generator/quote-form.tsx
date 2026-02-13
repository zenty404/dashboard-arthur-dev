"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InvoiceItem } from "@/lib/invoice-defaults";
import { QuoteData, DEFAULT_QUOTE } from "@/lib/quote-defaults";
import { EmitterSettings } from "@/lib/emitter-settings";
import { Plus, Trash2, FileSignature, FileText } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const QuotePreview = dynamic(
  () => import("./quote-preview").then((mod) => mod.QuotePreview),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-[600px] bg-muted rounded-lg">Chargement...</div> }
);

function getInitialData(searchParams: URLSearchParams): QuoteData {
  const clientParam = searchParams.get("client");
  if (clientParam) {
    try {
      const client = JSON.parse(atob(clientParam));
      return {
        ...DEFAULT_QUOTE,
        clientName: client.clientName || "",
        clientAddress: client.clientAddress || "",
        clientCity: client.clientCity || "",
      };
    } catch {
      // Invalid client param, fall through
    }
  }
  return DEFAULT_QUOTE;
}

interface QuoteFormProps {
  plan?: string;
  emitterSettings: EmitterSettings;
}

export function QuoteForm({ plan = "free", emitterSettings }: QuoteFormProps) {
  const searchParams = useSearchParams();
  const [data, setData] = useState<QuoteData>(() => getInitialData(searchParams));
  const router = useRouter();

  const updateField = <K extends keyof QuoteData>(
    field: K,
    value: QuoteData[K]
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (id: string, updates: Partial<InvoiceItem>) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  };

  const updateItemDetail = (itemId: string, detailIndex: number, value: string) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              details: item.details.map((d, i) => (i === detailIndex ? value : d)),
            }
          : item
      ),
    }));
  };

  const addItemDetail = (itemId: string) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId
          ? { ...item, details: [...item.details, ""] }
          : item
      ),
    }));
  };

  const removeItemDetail = (itemId: string, detailIndex: number) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId
          ? { ...item, details: item.details.filter((_, i) => i !== detailIndex) }
          : item
      ),
    }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      details: [],
      quantity: 1,
      unitPrice: 0,
    };
    setData((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const convertToInvoice = () => {
    const encoded = btoa(JSON.stringify(data));
    router.push(`/tools/invoice-generator?data=${encoded}`);
  };

  const totalHT = data.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Form */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSignature className="h-5 w-5 text-primary" />
              Informations Devis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">N° Devis</label>
                <Input
                  value={data.quoteNumber}
                  onChange={(e) => updateField("quoteNumber", e.target.value)}
                  placeholder="D-2026-01"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  value={data.quoteDate}
                  onChange={(e) => updateField("quoteDate", e.target.value)}
                  placeholder="09/02/2026"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Validité (jours)</label>
                <Input
                  type="number"
                  min={1}
                  value={data.validityDays}
                  onChange={(e) =>
                    updateField("validityDays", parseInt(e.target.value) || 30)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom / Entreprise</label>
              <Input
                value={data.clientName}
                onChange={(e) => updateField("clientName", e.target.value)}
                placeholder="Entreprise Clément Plomberie"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Adresse</label>
              <Input
                value={data.clientAddress}
                onChange={(e) => updateField("clientAddress", e.target.value)}
                placeholder="15 Rue de Paris"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Code postal et Ville</label>
              <Input
                value={data.clientCity}
                onChange={(e) => updateField("clientCity", e.target.value)}
                placeholder="77700 Magny-le-Hongre"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Prestations</CardTitle>
              <CardDescription>Lignes du devis</CardDescription>
            </div>
            <Button onClick={addItem} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {data.items.map((item, index) => (
              <div
                key={item.id}
                className="p-4 border rounded-lg space-y-4 relative"
              >
                {data.items.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Description #{index + 1}
                  </label>
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, { description: e.target.value })
                    }
                    placeholder='Forfait "Présence Web"'
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Détails</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addItemDetail(item.id)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Détail
                    </Button>
                  </div>
                  {item.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex gap-2">
                      <Input
                        value={detail}
                        onChange={(e) =>
                          updateItemDetail(item.id, detailIndex, e.target.value)
                        }
                        placeholder="Détail de la prestation"
                        className="text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItemDetail(item.id, detailIndex)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantité</label>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, {
                          quantity: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prix unitaire (€)</label>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(item.id, {
                          unitPrice: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total HT :</span>
                <span className="font-medium">
                  {totalHT.toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  €
                </span>
              </div>
              {emitterSettings.tvaApplicable ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">TVA ({emitterSettings.tvaRate}%) :</span>
                    <span className="font-medium">
                      {(Math.round(totalHT * emitterSettings.tvaRate / 100 * 100) / 100).toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      €
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total TTC :</span>
                    <span>
                      {(totalHT + Math.round(totalHT * emitterSettings.tvaRate / 100 * 100) / 100).toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      €
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total :</span>
                  <span>
                    {totalHT.toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    €
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={convertToInvoice}
          variant="outline"
          className="w-full"
        >
          <FileText className="h-4 w-4 mr-2" />
          Convertir en facture
        </Button>
      </div>

      {/* Preview */}
      <div className="lg:sticky lg:top-4 lg:self-start">
        <Card>
          <CardHeader>
            <CardTitle>Aperçu PDF</CardTitle>
            <CardDescription>
              Prévisualisation en temps réel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QuotePreview data={data} showWatermark={plan === "free"} emitterSettings={emitterSettings} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
