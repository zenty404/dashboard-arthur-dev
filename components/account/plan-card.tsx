"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Loader2, Check, Zap } from "lucide-react";
import { createCheckoutSession, createPortalSession } from "@/app/account/actions";
import { PLAN_LIMITS } from "@/lib/plan-limits";

interface PlanCardProps {
  plan: string;
  role: string;
  planExpiresAt: string | null;
}

const FREE_LIMITS = [
  { label: "Liens raccourcis", limit: PLAN_LIMITS.free.links },
  { label: "QR Codes", limit: PLAN_LIMITS.free.qrCodes },
  { label: "Sites surveillés", limit: PLAN_LIMITS.free.sites },
  { label: "Clients", limit: PLAN_LIMITS.free.clients },
  { label: "Factures/Devis", limit: "Avec filigrane" },
];

const PREMIUM_FEATURES = [
  "Liens raccourcis illimités",
  "QR Codes illimités",
  "Sites surveillés illimités",
  "Clients illimités",
  "Factures et devis sans filigrane",
];

export function PlanCard({ plan, role, planExpiresAt }: PlanCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isPremium = plan === "premium" || role === "admin";

  const handleUpgrade = async () => {
    setIsLoading(true);
    const result = await createCheckoutSession();
    setIsLoading(false);

    if (result.success) {
      window.location.href = result.url;
    }
  };

  const handleManage = async () => {
    setIsLoading(true);
    const result = await createPortalSession();
    setIsLoading(false);

    if (result.success) {
      window.location.href = result.url;
    }
  };

  if (role === "admin") {
    return (
      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Administrateur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            En tant qu&apos;administrateur, vous avez un accès illimité à toutes les fonctionnalités.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Current plan */}
      <Card className={isPremium ? "border-primary/50" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isPremium ? (
              <>
                <Crown className="h-5 w-5 text-yellow-500" />
                Plan Premium
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 text-muted-foreground" />
                Plan Free
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPremium ? (
            <>
              <ul className="space-y-2">
                {PREMIUM_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              {planExpiresAt && (
                <p className="text-sm text-muted-foreground">
                  Prochain renouvellement : {new Date(planExpiresAt).toLocaleDateString("fr-FR")}
                </p>
              )}
              <Button onClick={handleManage} variant="outline" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Gérer l'abonnement"}
              </Button>
            </>
          ) : (
            <>
              <ul className="space-y-2">
                {FREE_LIMITS.map((item) => (
                  <li key={item.label} className="flex items-center justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="text-muted-foreground font-mono">
                      {typeof item.limit === "number" ? `${item.limit} max` : item.limit}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>

      {/* Upgrade CTA for free users */}
      {!isPremium && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Passer Premium
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-2xl font-bold">
              4,99 € <span className="text-sm font-normal text-muted-foreground">/ mois</span>
            </p>
            <ul className="space-y-2">
              {PREMIUM_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button onClick={handleUpgrade} className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Crown className="h-4 w-4 mr-2" />
                  Passer Premium — 4,99 €/mois
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
