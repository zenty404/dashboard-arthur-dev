"use client";

import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { QuotePDF } from "./quote-pdf";
import { QuoteData } from "@/lib/quote-defaults";
import { EmitterSettings } from "@/lib/emitter-settings";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface QuotePreviewProps {
  data: QuoteData;
  showWatermark?: boolean;
  emitterSettings: EmitterSettings;
}

export function QuotePreview({ data, showWatermark = false, emitterSettings }: QuotePreviewProps) {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden bg-gray-100">
        <PDFViewer width="100%" height={600} showToolbar={false}>
          <QuotePDF data={data} showWatermark={showWatermark} emitterSettings={emitterSettings} />
        </PDFViewer>
      </div>
      <PDFDownloadLink
        document={<QuotePDF data={data} showWatermark={showWatermark} emitterSettings={emitterSettings} />}
        fileName={`Devis-${data.quoteNumber}.pdf`}
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
