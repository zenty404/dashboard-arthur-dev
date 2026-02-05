import { Link, QrCode, LucideIcon } from "lucide-react";

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
    description: "Créer et suivre des liens raccourcis",
    icon: Link,
    href: "/tools/link-tracker",
    color: "blue",
  },
  {
    id: "qr-generator",
    name: "QR Generator",
    description: "Générer et gérer des QR codes",
    icon: QrCode,
    href: "/tools/qr-generator",
    color: "purple",
  },
];
