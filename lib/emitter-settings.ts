export interface EmitterSettings {
  businessName: string;
  businessAddress: string;
  businessCity: string;
  businessPhone: string;
  businessEmail: string;
  businessSiret: string;
  bankHolder: string;
  bankName: string;
  bankIban: string;
  bankBic: string;
  tvaApplicable: boolean;
  tvaRate: number;
  tvaNumber: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildEmitterSettings(dbUser: any): EmitterSettings | null {
  if (!dbUser?.businessName) return null;
  return {
    businessName: dbUser.businessName ?? "",
    businessAddress: dbUser.businessAddress ?? "",
    businessCity: dbUser.businessCity ?? "",
    businessPhone: dbUser.businessPhone ?? "",
    businessEmail: dbUser.businessEmail ?? "",
    businessSiret: dbUser.businessSiret ?? "",
    bankHolder: dbUser.bankHolder ?? "",
    bankName: dbUser.bankName ?? "",
    bankIban: dbUser.bankIban ?? "",
    bankBic: dbUser.bankBic ?? "",
    tvaApplicable: dbUser.tvaApplicable ?? false,
    tvaRate: dbUser.tvaRate ?? 20.0,
    tvaNumber: dbUser.tvaNumber ?? "",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEmitterConfigured(dbUser: any): boolean {
  return !!dbUser?.businessName;
}

export const EMITTER_SELECT = {
  businessName: true,
  businessAddress: true,
  businessCity: true,
  businessPhone: true,
  businessEmail: true,
  businessSiret: true,
  bankHolder: true,
  bankName: true,
  bankIban: true,
  bankBic: true,
  tvaApplicable: true,
  tvaRate: true,
  tvaNumber: true,
} as const;
