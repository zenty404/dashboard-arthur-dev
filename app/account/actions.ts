"use server";

import { getStripe, STRIPE_PRICE_ID } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function createCheckoutSession(): Promise<
  { success: true; url: string } | { success: false; error: string }
> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { success: false, error: "Non authentifié" };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true, username: true, plan: true },
  });

  if (!user) {
    return { success: false, error: "Utilisateur non trouvé" };
  }

  if (user.plan === "premium") {
    return { success: false, error: "Vous êtes déjà Premium" };
  }

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${APP_URL}/account?success=true`,
      cancel_url: `${APP_URL}/account?canceled=true`,
      metadata: { userId },
      ...(user.stripeCustomerId
        ? { customer: user.stripeCustomerId }
        : { customer_email: undefined }),
    });

    return { success: true, url: session.url! };
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return { success: false, error: "Erreur lors de la création de la session de paiement" };
  }
}

export async function createPortalSession(): Promise<
  { success: true; url: string } | { success: false; error: string }
> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { success: false, error: "Non authentifié" };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  if (!user?.stripeCustomerId) {
    return { success: false, error: "Pas d'abonnement Stripe trouvé" };
  }

  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${APP_URL}/account`,
    });

    return { success: true, url: session.url };
  } catch (error) {
    console.error("Stripe portal error:", error);
    return { success: false, error: "Erreur lors de l'ouverture du portail" };
  }
}
