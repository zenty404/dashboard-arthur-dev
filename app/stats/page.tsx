import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart3, MousePointerClick, Link as LinkIcon, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { Logo } from "@/components/logo";
import { LinkActions } from "@/components/link-actions";

export const dynamic = "force-dynamic";

async function getLinks() {
  return prisma.link.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function StatsPage() {
  const links = await getLinks();
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/">
              <Logo size="sm" className="mb-2" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
              <BarChart3 className="h-6 w-6 text-primary" />
              Statistiques
            </h1>
            <p className="text-muted-foreground mt-1">
              Suivez les performances de vos liens
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/">Créer un lien</Link>
            </Button>
            <LogoutButton />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total des liens
              </CardTitle>
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{links.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total des clics
              </CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClicks}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tous les liens</CardTitle>
            <CardDescription>
              Liste de tous vos liens raccourcis avec leurs statistiques
            </CardDescription>
          </CardHeader>
          <CardContent>
            {links.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aucun lien créé pour le moment.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code court</TableHead>
                    <TableHead className="hidden md:table-cell">URL originale</TableHead>
                    <TableHead className="text-center">Clics</TableHead>
                    <TableHead className="hidden sm:table-cell">Statut</TableHead>
                    <TableHead className="hidden sm:table-cell">Date de création</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell className="font-mono font-medium">
                        <a
                          href={`/${link.shortCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-primary"
                        >
                          /{link.shortCode}
                        </a>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs truncate">
                        <a
                          href={link.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-muted-foreground"
                        >
                          {link.originalUrl}
                        </a>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center gap-1">
                          <MousePointerClick className="h-3 w-3" />
                          {link.clicks}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {link.isActive ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            Actif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <XCircle className="h-3 w-3" />
                            Inactif
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {new Date(link.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <LinkActions linkId={link.id} isActive={link.isActive} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
