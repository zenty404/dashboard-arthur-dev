export type PlanType = "free" | "premium";

export type ResourceType = "links" | "qrCodes" | "sites" | "clients";

export const PLAN_LIMITS: Record<PlanType, Record<ResourceType, number>> = {
  free: {
    links: 3,
    qrCodes: 3,
    sites: 1,
    clients: 5,
  },
  premium: {
    links: Infinity,
    qrCodes: Infinity,
    sites: Infinity,
    clients: Infinity,
  },
};
