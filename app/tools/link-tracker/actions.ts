"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { checkQuota } from "@/lib/plans";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export type CreateLinkResult =
  | { success: true; shortCode: string }
  | { success: false; error: string };

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export async function createShortLink(
  originalUrl: string
): Promise<CreateLinkResult> {
  if (!originalUrl || originalUrl.trim() === "") {
    return { success: false, error: "L'URL est requise" };
  }

  const trimmedUrl = originalUrl.trim();

  if (!isValidUrl(trimmedUrl)) {
    return { success: false, error: "L'URL n'est pas valide" };
  }

  try {
    const shortCode = nanoid(8);
    const userId = await getCurrentUserId();

    if (userId) {
      const quota = await checkQuota(userId, "links");
      if (!quota.allowed) {
        return { success: false, error: `Limite atteinte (${quota.current}/${quota.limit}). Passez Premium pour créer plus de liens.` };
      }
    }

    await prisma.link.create({
      data: {
        originalUrl: trimmedUrl,
        shortCode,
        userId,
      },
    });

    revalidatePath("/tools/link-tracker/stats");
    return { success: true, shortCode };
  } catch (error) {
    console.error("Erreur lors de la création du lien:", error);
    return { success: false, error: "Erreur lors de la création du lien" };
  }
}

export async function deleteLink(id: string): Promise<ActionResult> {
  try {
    await prisma.link.delete({
      where: { id },
    });
    revalidatePath("/tools/link-tracker/stats");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du lien:", error);
    return { success: false, error: "Erreur lors de la suppression du lien" };
  }
}

export async function toggleLinkActive(id: string): Promise<ActionResult> {
  try {
    const link = await prisma.link.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!link) {
      return { success: false, error: "Lien non trouvé" };
    }

    await prisma.link.update({
      where: { id },
      data: { isActive: !link.isActive },
    });

    revalidatePath("/tools/link-tracker/stats");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la modification du lien:", error);
    return { success: false, error: "Erreur lors de la modification du lien" };
  }
}

export async function getClickEvents(linkId: string) {
  return prisma.clickEvent.findMany({
    where: { linkId },
    orderBy: { clickedAt: "desc" },
  });
}
