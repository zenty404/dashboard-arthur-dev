import { InvoiceItem } from "@/lib/invoice-defaults";

export interface QuoteData {
  quoteNumber: string;
  quoteDate: string;
  validityDays: number;
  clientName: string;
  clientAddress: string;
  clientCity: string;
  items: InvoiceItem[];
}

export const DEFAULT_QUOTE: QuoteData = {
  quoteNumber: `D-${new Date().getFullYear()}-01`,
  quoteDate: new Date().toLocaleDateString("fr-FR"),
  validityDays: 30,
  clientName: "",
  clientAddress: "",
  clientCity: "",
  items: [
    {
      id: "1",
      description: 'Forfait "Présence Web"',
      details: [
        "Création site internet vitrine (Format One-Page)",
        "Intégration textes et visuels",
        "Configuration nom de domaine et mise en ligne",
      ],
      quantity: 1,
      unitPrice: 250,
    },
  ],
};
