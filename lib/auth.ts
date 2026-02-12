import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const COOKIE_NAME = "auth-token";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthCookie();
  if (!token) return false;
  return verifyToken(token) !== null;
}

async function getTokenPayload(): Promise<{ userId: string; role: string } | null> {
  const token = await getAuthCookie();
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;

  // Fallback: if old token doesn't have role, fetch from DB
  if (!payload.role) {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { role: true },
    });
    if (!user) return null;
    return { userId: payload.userId, role: user.role };
  }

  return payload;
}

export async function getCurrentUserId(): Promise<string | null> {
  const payload = await getTokenPayload();
  return payload?.userId ?? null;
}

export async function getCurrentUserRole(): Promise<string | null> {
  const payload = await getTokenPayload();
  return payload?.role ?? null;
}

export async function isAdmin(): Promise<boolean> {
  const role = await getCurrentUserRole();
  return role === "admin";
}
