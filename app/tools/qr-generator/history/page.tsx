import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
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
import { QrCode, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { Logo } from "@/components/logo";
import { QrActions } from "@/components/qr-generator/qr-actions";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

async function getQrCodes() {
  const userId = await getCurrentUserId();
  return prisma.qrCode.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

async function generateQrDataUrl(content: string, size: number) {
  return QRCode.toDataURL(content, {
    width: Math.min(size, 64),
    margin: 1,
  });
}

export default async function QrHistoryPage() {
  const qrCodes = await getQrCodes();

  // Generate thumbnails for all QR codes
  const qrCodesWithThumbnails = await Promise.all(
    qrCodes.map(async (qr) => ({
      ...qr,
      thumbnail: await generateQrDataUrl(qr.content, 64),
    }))
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div className="min-w-0">
            <div className="flex items-center gap-4 mb-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            </div>
            <Link href="/tools/qr-generator">
              <Logo size="sm" className="mb-2" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
              <QrCode className="h-6 w-6 text-primary" />
              Historique QR Codes
            </h1>
            <p className="text-muted-foreground mt-1">
              QR codes sauvegardés
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" asChild>
              <Link href="/tools/qr-generator">
                <QrCode className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Créer un QR code</span>
              </Link>
            </Button>
            <LogoutButton />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total des QR codes
              </CardTitle>
              <QrCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{qrCodes.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tous les QR codes</CardTitle>
            <CardDescription>
              Historique des QR codes générés
            </CardDescription>
          </CardHeader>
          <CardContent>
            {qrCodes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aucun QR code sauvegardé pour le moment.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">QR</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead className="hidden md:table-cell">Contenu</TableHead>
                    <TableHead className="hidden sm:table-cell">Taille</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qrCodesWithThumbnails.map((qr) => (
                    <TableRow key={qr.id}>
                      <TableCell>
                        <img
                          src={qr.thumbnail}
                          alt="QR Code"
                          className="w-10 h-10 rounded border"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {qr.label || <span className="text-muted-foreground">Sans label</span>}
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs truncate text-muted-foreground font-mono text-sm">
                        {qr.content}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {qr.size} px
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {new Date(qr.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <QrActions qrId={qr.id} />
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
