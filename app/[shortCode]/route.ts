import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params;

  const link = await prisma.link.findUnique({
    where: { shortCode },
  });

  if (!link) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  await prisma.link.update({
    where: { shortCode },
    data: { clicks: { increment: 1 } },
  });

  return NextResponse.redirect(link.originalUrl);
}
