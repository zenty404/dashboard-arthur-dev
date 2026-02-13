"use server";

import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/lib/action-result";
import { revalidatePath } from "next/cache";

interface SaveEmitterInput {
  businessName: string;
  businessAddress: string;
  businessCity: string;
  businessPhone: string;
  businessEmail: string;
  businessSiret: string;
  bankHolder: string;
  bankName: string;
  bankIban: string;
  bankBic: string;
  tvaApplicable: boolean;
  tvaRate: number;
  tvaNumber: string;
}

export async function saveEmitterSettings(data: SaveEmitterInput): Promise<ActionResult> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { success: false, error: "Non authentifié." };
  }

  if (!data.businessName.trim()) {
    return { success: false, error: "Le nom de l'entreprise est obligatoire." };
  }

  if (!data.businessSiret.trim()) {
    return { success: false, error: "Le numéro SIRET est obligatoire." };
  }

  if (data.tvaRate < 0 || data.tvaRate > 100) {
    return { success: false, error: "Le taux de TVA doit être compris entre 0 et 100." };
  }

  if (data.tvaApplicable && !data.tvaNumber.trim()) {
    return { success: false, error: "Le numéro de TVA intracommunautaire est obligatoire quand la TVA est applicable." };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        businessName: data.businessName.trim(),
        businessAddress: data.businessAddress.trim(),
        businessCity: data.businessCity.trim(),
        businessPhone: data.businessPhone.trim(),
        businessEmail: data.businessEmail.trim(),
        businessSiret: data.businessSiret.trim(),
        bankHolder: data.bankHolder.trim(),
        bankName: data.bankName.trim(),
        bankIban: data.bankIban.trim(),
        bankBic: data.bankBic.trim(),
        tvaApplicable: data.tvaApplicable,
        tvaRate: data.tvaRate,
        tvaNumber: data.tvaNumber.trim(),
      },
    });

    revalidatePath("/account/billing-settings");
    revalidatePath("/tools/invoice-generator");
    revalidatePath("/tools/quote-generator");

    return { success: true };
  } catch {
    return { success: false, error: "Erreur lors de la sauvegarde." };
  }
}
