import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tool } from "@/lib/tools";
import { ArrowRight } from "lucide-react";

interface ToolCardProps {
  tool: Tool;
}

const colorClasses: Record<Tool["color"], { bg: string; icon: string; hover: string }> = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    icon: "text-blue-600 dark:text-blue-400",
    hover: "hover:border-blue-300 dark:hover:border-blue-700",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950/30",
    icon: "text-green-600 dark:text-green-400",
    hover: "hover:border-green-300 dark:hover:border-green-700",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    icon: "text-purple-600 dark:text-purple-400",
    hover: "hover:border-purple-300 dark:hover:border-purple-700",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/30",
    icon: "text-orange-600 dark:text-orange-400",
    hover: "hover:border-orange-300 dark:hover:border-orange-700",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-950/30",
    icon: "text-red-600 dark:text-red-400",
    hover: "hover:border-red-300 dark:hover:border-red-700",
  },
};

export function ToolCard({ tool }: ToolCardProps) {
  const colors = colorClasses[tool.color];
  const Icon = tool.icon;

  return (
    <Link href={tool.href}>
      <Card className={`transition-all ${colors.hover} hover:shadow-md cursor-pointer group`}>
        <CardHeader>
          <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center mb-3`}>
            <Icon className={`h-6 w-6 ${colors.icon}`} />
          </div>
          <CardTitle className="flex items-center justify-between">
            {tool.name}
            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-muted-foreground" />
          </CardTitle>
          <CardDescription>{tool.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <span className="text-sm text-primary font-medium">
            Ouvrir l&apos;outil
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
