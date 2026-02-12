"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { checkQuota } from "@/lib/plans";
import { revalidatePath } from "next/cache";
import QRCode from "qrcode";

export async function createQrCode(formData: FormData) {
  const content = formData.get("content") as string;
  const label = formData.get("label") as string;
  const size = parseInt(formData.get("size") as string) || 256;

  if (!content) {
    return { error: "Le contenu est requis" };
  }

  try {
    const userId = await getCurrentUserId();

    if (userId) {
      const quota = await checkQuota(userId, "qrCodes");
      if (!quota.allowed) {
        return { error: `Limite atteinte (${quota.current}/${quota.limit}). Passez Premium pour créer plus de QR codes.` };
      }
    }

    const qrCode = await prisma.qrCode.create({
      data: {
        content,
        label: label || null,
        size,
        userId,
      },
    });

    revalidatePath("/tools/qr-generator");
    revalidatePath("/tools/qr-generator/history");

    return { success: true, id: qrCode.id };
  } catch (error) {
    console.error("Error creating QR code:", error);
    return { error: "Erreur lors de la création du QR code" };
  }
}

export async function generateQrDataUrl(content: string, size: number = 256) {
  try {
    const dataUrl = await QRCode.toDataURL(content, {
      width: size,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
    return { dataUrl };
  } catch (error) {
    console.error("Error generating QR code:", error);
    return { error: "Erreur lors de la génération du QR code" };
  }
}

export async function deleteQrCode(id: string) {
  try {
    await prisma.qrCode.delete({
      where: { id },
    });

    revalidatePath("/tools/qr-generator/history");
    return { success: true };
  } catch (error) {
    console.error("Error deleting QR code:", error);
    return { error: "Erreur lors de la suppression" };
  }
}
