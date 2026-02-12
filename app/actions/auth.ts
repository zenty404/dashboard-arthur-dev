"use server";

import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  verifyPassword,
  generateToken,
  setAuthCookie,
  removeAuthCookie,
} from "@/lib/auth";
import { redirect } from "next/navigation";

export type AuthResult =
  | { success: true }
  | { success: false; error: string };

export async function login(
  username: string,
  password: string
): Promise<AuthResult> {
  if (!username || !password) {
    return { success: false, error: "Identifiant et mot de passe requis" };
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return { success: false, error: "Identifiants incorrects" };
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return { success: false, error: "Identifiants incorrects" };
  }

  const token = generateToken(user.id, user.role);
  await setAuthCookie(token);

  return { success: true };
}

export async function logout(): Promise<void> {
  await removeAuthCookie();
  redirect("/login");
}

export async function createAdminUser(
  username: string,
  password: string
): Promise<AuthResult> {
  const existingUser = await prisma.user.findFirst();
  if (existingUser) {
    return { success: false, error: "Un administrateur existe déjà" };
  }

  if (password.length < 8) {
    return { success: false, error: "Le mot de passe doit contenir au moins 8 caractères" };
  }

  const hashedPassword = await hashPassword(password);
  await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      role: "admin",
    },
  });

  return { success: true };
}

export async function hasAdmin(): Promise<boolean> {
  const user = await prisma.user.findFirst();
  return !!user;
}
