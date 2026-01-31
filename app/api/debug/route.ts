import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.TURSO_DATABASE_URL || "";
  return NextResponse.json({
    url: url,
    length: url.length,
    firstChar: url.charCodeAt(0),
    lastChar: url.charCodeAt(url.length - 1),
  });
}
