"use client";

import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "./invoice-pdf";
import { InvoiceData } from "@/lib/invoice-defaults";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface InvoicePreviewProps {
  data: InvoiceData;
  showWatermark?: boolean;
}

export function InvoicePreview({ data, showWatermark = false }: InvoicePreviewProps) {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden bg-gray-100">
        <PDFViewer width="100%" height={600} showToolbar={false}>
          <InvoicePDF data={data} showWatermark={showWatermark} />
        </PDFViewer>
      </div>
      <PDFDownloadLink
        document={<InvoicePDF data={data} showWatermark={showWatermark} />}
        fileName={`Facture-${data.invoiceNumber}.pdf`}
      >
        {({ loading }) => (
          <Button className="w-full" disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            {loading ? "Génération..." : "Télécharger PDF"}
          </Button>
        )}
      </PDFDownloadLink>
    </div>
  );
}
