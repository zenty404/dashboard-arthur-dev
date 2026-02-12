"use client";

import { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateUserRole } from "@/app/admin/actions";
import {
  Link as LinkIcon,
  QrCode,
  Globe,
  Users,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";

interface UserData {
  id: string;
  username: string;
  role: string;
  createdAt: string;
  links: { id: string; shortCode: string; originalUrl: string; clicks: number; createdAt: string }[];
  qrCodes: { id: string; content: string; label: string | null; createdAt: string }[];
  monitoredSites: { id: string; url: string; label: string | null; isActive: boolean }[];
  clients: { id: string; name: string; email: string | null; createdAt: string }[];
}

export function UserDetail({ user }: { user: UserData }) {
  const [isPending, startTransition] = useTransition();

  function handleToggleRole() {
    const newRole = user.role === "admin" ? "user" : "admin";
    startTransition(async () => {
      await updateUserRole(user.id, newRole);
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{user.username}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                  {user.role === "admin" ? "Admin" : "Utilisateur"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Inscrit le{" "}
                  {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleToggleRole}
              disabled={isPending}
              className="flex items-center gap-2"
            >
              {user.role === "admin" ? (
                <>
                  <ShieldOff className="h-4 w-4" />
                  Rétrograder
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Promouvoir admin
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Liens créés</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-3">{user.links.length}</div>
            {user.links.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {user.links.map((link) => (
                  <div key={link.id} className="text-sm flex justify-between">
                    <span className="font-mono text-primary">/{link.shortCode}</span>
                    <span className="text-muted-foreground">{link.clicks} clics</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">QR Codes</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-3">{user.qrCodes.length}</div>
            {user.qrCodes.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {user.qrCodes.map((qr) => (
                  <div key={qr.id} className="text-sm text-muted-foreground truncate">
                    {qr.label || qr.content}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sites surveillés</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-3">{user.monitoredSites.length}</div>
            {user.monitoredSites.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {user.monitoredSites.map((site) => (
                  <div key={site.id} className="text-sm flex justify-between">
                    <span className="truncate">{site.label || site.url}</span>
                    <Badge variant={site.isActive ? "default" : "secondary"} className="ml-2 shrink-0">
                      {site.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-3">{user.clients.length}</div>
            {user.clients.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {user.clients.map((client) => (
                  <div key={client.id} className="text-sm flex justify-between">
                    <span>{client.name}</span>
                    <span className="text-muted-foreground">{client.email}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
