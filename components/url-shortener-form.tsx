"use client";

import { useState } from "react";
import { createShortLink } from "@/app/actions/links";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy, Check, Link, Loader2 } from "lucide-react";

export function UrlShortenerForm() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShortUrl(null);
    setIsLoading(true);

    const result = await createShortLink(url);

    setIsLoading(false);

    if (result.success) {
      const fullUrl = `${window.location.origin}/${result.shortCode}`;
      setShortUrl(fullUrl);
      setUrl("");
    } else {
      setError(result.error);
    }
  };

  const copyToClipboard = async () => {
    if (!shortUrl) return;

    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Link className="h-6 w-6" />
          URL Shortener
        </CardTitle>
        <CardDescription>
          Collez votre URL longue et obtenez un lien court
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://exemple.com/votre-longue-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Raccourcir"
              )}
            </Button>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          {shortUrl && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Votre lien raccourci :
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-background p-2 rounded border truncate">
                  {shortUrl}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
