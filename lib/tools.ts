import { Link, QrCode, FileText, FileSignature, Activity, Users, LucideIcon } from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: "blue" | "green" | "purple" | "orange" | "red";
}

export const tools: Tool[] = [
  {
    id: "link-tracker",
    name: "Link Tracker",
    description: "Raccourcissement d'URLs et suivi des clics",
    icon: Link,
    href: "/tools/link-tracker",
    color: "blue",
  },
  {
    id: "qr-generator",
    name: "QR Generator",
    description: "Création et gestion de QR codes",
    icon: QrCode,
    href: "/tools/qr-generator",
    color: "purple",
  },
  {
    id: "invoice-generator",
    name: "Factures",
    description: "Création et export de factures PDF",
    icon: FileText,
    href: "/tools/invoice-generator",
    color: "green",
  },
  {
    id: "quote-generator",
    name: "Devis",
    description: "Création et export de devis PDF",
    icon: FileSignature,
    href: "/tools/quote-generator",
    color: "green",
  },
  {
    id: "uptime-monitor",
    name: "Moniteur de Sites",
    description: "Surveillance et monitoring de disponibilité",
    icon: Activity,
    href: "/tools/uptime-monitor",
    color: "orange",
  },
  {
    id: "client-manager",
    name: "Clients",
    description: "Gestion de la base clients et contacts",
    icon: Users,
    href: "/tools/client-manager",
    color: "blue",
  },
];
