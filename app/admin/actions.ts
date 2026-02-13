"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, isAdmin } from "@/lib/auth";
import type { ActionResult } from "@/lib/action-result";
import { revalidatePath } from "next/cache";

export type { ActionResult };

export async function createUser(
  username: string,
  password: string,
  role: string
): Promise<ActionResult> {
  if (!(await isAdmin())) {
    return { success: false, error: "Accès non autorisé" };
  }

  if (!username || username.trim() === "") {
    return { success: false, error: "Le nom d'utilisateur est requis" };
  }

  if (password.length < 8) {
    return { success: false, error: "Le mot de passe doit contenir au moins 8 caractères" };
  }

  if (role !== "admin" && role !== "user") {
    return { success: false, error: "Rôle invalide" };
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { username: username.trim() },
    });
    if (existing) {
      return { success: false, error: "Ce nom d'utilisateur existe déjà" };
    }

    const hashedPassword = await hashPassword(password);
    await prisma.user.create({
      data: {
        username: username.trim(),
        password: hashedPassword,
        role,
      },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    return { success: false, error: "Erreur lors de la création de l'utilisateur" };
  }
}

export async function deleteUser(id: string): Promise<ActionResult> {
  if (!(await isAdmin())) {
    return { success: false, error: "Accès non autorisé" };
  }

  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}

export async function updateUserRole(
  id: string,
  role: string
): Promise<ActionResult> {
  if (!(await isAdmin())) {
    return { success: false, error: "Accès non autorisé" };
  }

  if (role !== "admin" && role !== "user") {
    return { success: false, error: "Rôle invalide" };
  }

  try {
    await prisma.user.update({
      where: { id },
      data: { role },
    });
    revalidatePath("/admin");
    revalidatePath(`/admin/users/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la modification du rôle:", error);
    return { success: false, error: "Erreur lors de la modification du rôle" };
  }
}
