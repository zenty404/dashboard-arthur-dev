import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({
        step: "user_lookup",
        found: false,
        error: "User not found"
      });
    }

    const isValid = await verifyPassword(password, user.password);

    return NextResponse.json({
      step: "password_verify",
      found: true,
      userId: user.id,
      passwordValid: isValid,
      passwordHashStart: user.password.substring(0, 10),
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
