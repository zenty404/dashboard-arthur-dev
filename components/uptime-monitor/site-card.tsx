"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SiteActions } from "./site-actions";
import { Clock, Zap, Globe } from "lucide-react";

interface LastCheck {
  isUp: boolean;
  statusCode: number | null;
  responseTime: number | null;
  checkedAt: Date;
}

interface SiteCardProps {
  id: string;
  url: string;
  label: string | null;
  isActive: boolean;
  lastCheck: LastCheck | null;
}

export function SiteCard({ id, url, label, isActive, lastCheck }: SiteCardProps) {
  const statusColor = !lastCheck
    ? "bg-gray-500"
    : lastCheck.isUp
      ? "bg-green-500"
      : "bg-red-500";

  const statusText = !lastCheck
    ? "Jamais vérifié"
    : lastCheck.isUp
      ? "En ligne"
      : "Hors ligne";

  return (
    <Card className={!isActive ? "opacity-60" : undefined}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`inline-block h-3 w-3 rounded-full shrink-0 ${statusColor}`}
            />
            <CardTitle className="text-base truncate">
              {label || url}
            </CardTitle>
          </div>
          <SiteActions siteId={id} isActive={isActive} />
        </div>
        {label && (
          <p className="text-sm text-muted-foreground truncate">{url}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Globe className="h-3.5 w-3.5" />
            {statusText}
          </span>
          {lastCheck?.responseTime != null && (
            <span className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" />
              {lastCheck.responseTime} ms
            </span>
          )}
          {lastCheck && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {new Date(lastCheck.checkedAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
