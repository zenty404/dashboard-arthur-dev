import { Link, LucideIcon } from "lucide-react";

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
];
