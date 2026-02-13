"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyShortCode({ shortCode }: { shortCode: string }) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const fullUrl = `${window.location.origin}/${shortCode}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 font-mono font-medium text-primary hover:underline cursor-pointer"
    >
      /{shortCode}
      {copied ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3 text-muted-foreground" />
      )}
    </button>
  );
}
