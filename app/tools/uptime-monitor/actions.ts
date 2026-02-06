"use server";

import { prisma } from "@/lib/prisma";
import { performCheck } from "@/lib/uptime";
import { revalidatePath } from "next/cache";

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export type CheckActionResult =
  | { success: true; isUp: boolean; statusCode: number | null; responseTime: number | null }
  | { success: false; error: string };

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export async function addSite(
  url: string,
  label: string
): Promise<ActionResult> {
  if (!url || url.trim() === "") {
    return { success: false, error: "L'URL est requise" };
  }

  const trimmedUrl = url.trim();
  const trimmedLabel = label.trim() || null;

  if (!isValidUrl(trimmedUrl)) {
    return { success: false, error: "L'URL n'est pas valide" };
  }

  try {
    await prisma.monitoredSite.create({
      data: {
        url: trimmedUrl,
        label: trimmedLabel,
      },
    });

    revalidatePath("/tools/uptime-monitor");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'ajout du site:", error);
    return { success: false, error: "Erreur lors de l'ajout du site" };
  }
}

export async function deleteSite(id: string): Promise<ActionResult> {
  try {
    await prisma.monitoredSite.delete({
      where: { id },
    });
    revalidatePath("/tools/uptime-monitor");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du site:", error);
    return { success: false, error: "Erreur lors de la suppression du site" };
  }
}

export async function toggleSiteActive(id: string): Promise<ActionResult> {
  try {
    const site = await prisma.monitoredSite.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!site) {
      return { success: false, error: "Site non trouvé" };
    }

    await prisma.monitoredSite.update({
      where: { id },
      data: { isActive: !site.isActive },
    });

    revalidatePath("/tools/uptime-monitor");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la modification du site:", error);
    return { success: false, error: "Erreur lors de la modification du site" };
  }
}

export async function checkAllSites(): Promise<{ success: true; count: number } | { success: false; error: string }> {
  try {
    const sites = await prisma.monitoredSite.findMany({
      where: { isActive: true },
      select: { id: true, url: true },
    });

    await Promise.all(
      sites.map(async (site) => {
        const result = await performCheck(site.url);
        await prisma.uptimeCheck.create({
          data: {
            siteId: site.id,
            statusCode: result.statusCode,
            responseTime: result.responseTime,
            isUp: result.isUp,
            error: result.error,
          },
        });
      })
    );

    revalidatePath("/tools/uptime-monitor");
    return { success: true, count: sites.length };
  } catch (error) {
    console.error("Erreur lors de la vérification globale:", error);
    return { success: false, error: "Erreur lors de la vérification" };
  }
}

export async function checkSiteNow(id: string): Promise<CheckActionResult> {
  try {
    const site = await prisma.monitoredSite.findUnique({
      where: { id },
      select: { url: true },
    });

    if (!site) {
      return { success: false, error: "Site non trouvé" };
    }

    const result = await performCheck(site.url);

    await prisma.uptimeCheck.create({
      data: {
        siteId: id,
        statusCode: result.statusCode,
        responseTime: result.responseTime,
        isUp: result.isUp,
        error: result.error,
      },
    });

    revalidatePath("/tools/uptime-monitor");
    return {
      success: true,
      isUp: result.isUp,
      statusCode: result.statusCode,
      responseTime: result.responseTime,
    };
  } catch (error) {
    console.error("Erreur lors de la vérification du site:", error);
    return { success: false, error: "Erreur lors de la vérification" };
  }
}
