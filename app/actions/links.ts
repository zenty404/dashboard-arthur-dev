"use server";

import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export type CreateLinkResult =
  | { success: true; shortCode: string }
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

    await prisma.link.create({
      data: {
        originalUrl: trimmedUrl,
        shortCode,
      },
    });

    return { success: true, shortCode };
  } catch (error) {
    console.error("Erreur lors de la création du lien:", error);
    return { success: false, error: "Erreur lors de la création du lien" };
  }
}
