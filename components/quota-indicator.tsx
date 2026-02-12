import Link from "next/link";
import { Crown } from "lucide-react";

interface QuotaIndicatorProps {
  current: number;
  limit: number;
  resourceLabel: string;
}

export function QuotaIndicator({ current, limit, resourceLabel }: QuotaIndicatorProps) {
  if (!isFinite(limit)) return null;

  const atLimit = current >= limit;

  return (
    <div className={`text-sm rounded-lg px-3 py-2 ${atLimit ? "bg-red-500/10 text-red-400" : "bg-muted text-muted-foreground"}`}>
      <span className="font-mono">{current}/{limit}</span> {resourceLabel} utilisé{current > 1 ? "s" : ""}
      {atLimit && (
        <Link href="/account" className="ml-2 inline-flex items-center gap-1 text-primary hover:underline">
          <Crown className="h-3 w-3" />
          Passer Premium
        </Link>
      )}
    </div>
  );
}
