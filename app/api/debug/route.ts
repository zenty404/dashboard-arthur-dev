import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkQuota } from "@/lib/plans";

export async function GET(request: NextRequest) {
  const steps: Record<string, unknown> = {};

  try {
    // Step 1: Test auth (import dynamically to catch import errors)
    steps["1_import_auth"] = "ok";
    const { getCurrentUserId, isAdmin } = await import("@/lib/auth");

    // Step 2: Get user info
    let admin = false;
    let userId: string | null = null;
    try {
      admin = await isAdmin();
      userId = await getCurrentUserId();
      steps["2_auth"] = { admin, userId };
    } catch (e) {
      steps["2_auth_error"] = String(e);
    }

    // Step 3: Fetch clients
    try {
      const clients = await prisma.client.findMany({
        where: admin ? {} : { userId },
        orderBy: { createdAt: "desc" },
      });
      const serialized = JSON.parse(JSON.stringify(clients));
      steps["3_clients"] = { count: serialized.length, sample: serialized[0] };
    } catch (e) {
      steps["3_clients_error"] = String(e);
    }

    // Step 4: Check quota
    try {
      const quota = userId ? await checkQuota(userId, "clients") : null;
      steps["4_quota"] = quota;
    } catch (e) {
      steps["4_quota_error"] = String(e);
    }

    // Step 5: Test createClient action
    try {
      const { createClient } = await import("@/app/tools/client-manager/actions");
      const result = await createClient({
        name: "DebugTest_" + Date.now(),
        email: "",
        phone: "",
        address: "",
        city: "",
        notes: "",
      });
      steps["5_createClient"] = result;
    } catch (e) {
      steps["5_createClient_error"] = String(e);
      steps["5_createClient_stack"] = (e as Error).stack;
    }

    return NextResponse.json(steps, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { ...steps, fatal: String(e), stack: (e as Error).stack },
      { status: 500 }
    );
  }
}
