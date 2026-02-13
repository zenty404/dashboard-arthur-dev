"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmitterSettings } from "@/lib/emitter-settings";
import { saveEmitterSettings } from "@/app/account/billing-settings/actions";
import { Building2, CreditCard, Receipt, Save, Check } from "lucide-react";

interface EmitterSettingsFormProps {
  initialSettings: EmitterSettings | null;
}

export function EmitterSettingsForm({ initialSettings }: EmitterSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [businessName, setBusinessName] = useState(initialSettings?.businessName ?? "");
  const [businessAddress, setBusinessAddress] = useState(initialSettings?.businessAddress ?? "");
  const [businessCity, setBusinessCity] = useState(initialSettings?.businessCity ?? "");
  const [businessPhone, setBusinessPhone] = useState(initialSettings?.businessPhone ?? "");
  const [businessEmail, setBusinessEmail] = useState(initialSettings?.businessEmail ?? "");
  const [businessSiret, setBusinessSiret] = useState(initialSettings?.businessSiret ?? "");
  const [bankHolder, setBankHolder] = useState(initialSettings?.bankHolder ?? "");
  const [bankName, setBankName] = useState(initialSettings?.bankName ?? "");
  const [bankIban, setBankIban] = useState(initialSettings?.bankIban ?? "");
  const [bankBic, setBankBic] = useState(initialSettings?.bankBic ?? "");
  const [tvaApplicable, setTvaApplicable] = useState(initialSettings?.tvaApplicable ?? false);
  const [tvaRate, setTvaRate] = useState(initialSettings?.tvaRate ?? 20.0);
  const [tvaNumber, setTvaNumber] = useState(initialSettings?.tvaNumber ?? "");

  const handleSubmit = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await saveEmitterSettings({
        businessName,
        businessAddress,
        businessCity,
        businessPhone,
        businessEmail,
        businessSiret,
        bankHolder,
        bankName,
        bankIban,
        bankBic,
        tvaApplicable,
        tvaRate,
        tvaNumber,
      });
      if (result.success) {
        setMessage({ type: "success", text: "Paramètres enregistrés avec succès." });
      } else {
        setMessage({ type: "error", text: result.error });
      }
    });
  };

  const TVA_PRESETS = [20, 10, 5.5, 2.1];

  return (
    <div className="space-y-6">
      {/* Business info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Informations de l&apos;entreprise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Nom / Raison sociale <span className="text-destructive">*</span>
              </label>
              <Input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Mon Entreprise"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                SIRET <span className="text-destructive">*</span>
              </label>
              <Input
                value={businessSiret}
                onChange={(e) => setBusinessSiret(e.target.value)}
                placeholder="123 456 789 00011"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Adresse</label>
              <Input
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                placeholder="10 Rue de Paris"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Code postal et Ville</label>
              <Input
                value={businessCity}
                onChange={(e) => setBusinessCity(e.target.value)}
                placeholder="75001 Paris"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Téléphone</label>
              <Input
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                placeholder="01 23 45 67 89"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                placeholder="contact@entreprise.fr"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Coordonnées bancaires
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Titulaire du compte</label>
              <Input
                value={bankHolder}
                onChange={(e) => setBankHolder(e.target.value)}
                placeholder="Prénom NOM"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Banque</label>
              <Input
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Crédit Mutuel"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">IBAN</label>
              <Input
                value={bankIban}
                onChange={(e) => setBankIban(e.target.value)}
                placeholder="FR76 1234 5678 9012 3456 7890 123"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">BIC</label>
              <Input
                value={bankBic}
                onChange={(e) => setBankBic(e.target.value)}
                placeholder="CMCIFR2A"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TVA config */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Configuration TVA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={!tvaApplicable ? "default" : "outline"}
              className="flex-1"
              onClick={() => setTvaApplicable(false)}
            >
              Non applicable — auto-entrepreneur
            </Button>
            <Button
              type="button"
              variant={tvaApplicable ? "default" : "outline"}
              className="flex-1"
              onClick={() => setTvaApplicable(true)}
            >
              Applicable
            </Button>
          </div>

          {tvaApplicable && (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Taux de TVA (%)</label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={tvaRate}
                    onChange={(e) => setTvaRate(parseFloat(e.target.value) || 0)}
                    className="w-24"
                  />
                  <div className="flex gap-1">
                    {TVA_PRESETS.map((preset) => (
                      <Button
                        key={preset}
                        type="button"
                        variant={tvaRate === preset ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTvaRate(preset)}
                      >
                        {preset}%
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  N° TVA intracommunautaire <span className="text-destructive">*</span>
                </label>
                <Input
                  value={tvaNumber}
                  onChange={(e) => setTvaNumber(e.target.value)}
                  placeholder="FR 12 345678901"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feedback */}
      {message && (
        <div
          className={`rounded-lg border p-3 text-sm ${
            message.type === "success"
              ? "border-green-500/30 bg-green-500/10 text-green-400"
              : "border-destructive/30 bg-destructive/10 text-destructive"
          }`}
        >
          {message.type === "success" && <Check className="h-4 w-4 inline mr-2" />}
          {message.text}
        </div>
      )}

      {/* Submit */}
      <Button onClick={handleSubmit} disabled={isPending} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        {isPending ? "Enregistrement..." : "Enregistrer les paramètres"}
      </Button>
    </div>
  );
}
