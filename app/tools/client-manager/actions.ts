"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { checkQuota } from "@/lib/plans";
import type { ActionResult } from "@/lib/action-result";
import { revalidatePath } from "next/cache";

interface ClientData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  notes?: string;
}

export async function createClient(data: ClientData): Promise<ActionResult> {
  if (!data.name || data.name.trim() === "") {
    return { success: false, error: "Le nom est requis" };
  }

  try {
    const userId = await getCurrentUserId();

    if (userId) {
      const quota = await checkQuota(userId, "clients");
      if (!quota.allowed) {
        return { success: false, error: `Limite atteinte (${quota.current}/${quota.limit}). Passez Premium pour gérer plus de clients.` };
      }
    }

    await prisma.client.create({
      data: {
        name: data.name.trim(),
        email: data.email?.trim() || null,
        phone: data.phone?.trim() || null,
        address: data.address?.trim() || null,
        city: data.city?.trim() || null,
        notes: data.notes?.trim() || null,
        userId,
      },
    });

    revalidatePath("/tools/client-manager");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la création du client:", error);
    return { success: false, error: "Erreur lors de la création du client" };
  }
}

export async function updateClient(
  id: string,
  data: ClientData
): Promise<ActionResult> {
  if (!data.name || data.name.trim() === "") {
    return { success: false, error: "Le nom est requis" };
  }

  try {
    await prisma.client.update({
      where: { id },
      data: {
        name: data.name.trim(),
        email: data.email?.trim() || null,
        phone: data.phone?.trim() || null,
        address: data.address?.trim() || null,
        city: data.city?.trim() || null,
        notes: data.notes?.trim() || null,
      },
    });

    revalidatePath("/tools/client-manager");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la modification du client:", error);
    return { success: false, error: "Erreur lors de la modification du client" };
  }
}

export async function deleteClient(id: string): Promise<ActionResult> {
  try {
    await prisma.client.delete({
      where: { id },
    });
    revalidatePath("/tools/client-manager");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du client:", error);
    return { success: false, error: "Erreur lors de la suppression du client" };
  }
}
