import { prisma } from "@/lib/prisma";
import { PlanType, ResourceType, PLAN_LIMITS } from "@/lib/plan-limits";

export { PLAN_LIMITS } from "@/lib/plan-limits";
export type { PlanType, ResourceType } from "@/lib/plan-limits";

export async function getUserPlan(userId: string): Promise<PlanType> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, role: true },
  });
  if (!user) return "free";
  if (user.role === "admin") return "premium";
  return (user.plan as PlanType) || "free";
}

export async function checkQuota(
  userId: string,
  resource: ResourceType
): Promise<{ allowed: boolean; current: number; limit: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, role: true },
  });

  if (!user) return { allowed: false, current: 0, limit: 0 };

  // Admin bypasses all limits
  if (user.role === "admin") {
    return { allowed: true, current: 0, limit: Infinity };
  }

  const plan = (user.plan as PlanType) || "free";
  const limit = PLAN_LIMITS[plan][resource];

  let current = 0;
  switch (resource) {
    case "links":
      current = await prisma.link.count({ where: { userId } });
      break;
    case "qrCodes":
      current = await prisma.qrCode.count({ where: { userId } });
      break;
    case "sites":
      current = await prisma.monitoredSite.count({ where: { userId } });
      break;
    case "clients":
      current = await prisma.client.count({ where: { userId } });
      break;
  }

  return { allowed: current < limit, current, limit };
}

export async function isPremium(userId: string): Promise<boolean> {
  const plan = await getUserPlan(userId);
  return plan === "premium";
}
