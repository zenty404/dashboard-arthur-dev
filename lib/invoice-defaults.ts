export interface InvoiceItem {
  id: string;
  description: string;
  details: string[];
  quantity: number;
  unitPrice: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  clientName: string;
  clientAddress: string;
  clientCity: string;
  items: InvoiceItem[];
}

export const DEFAULT_INVOICE: InvoiceData = {
  invoiceNumber: `${new Date().getFullYear()}-01`,
  invoiceDate: new Date().toLocaleDateString("fr-FR"),
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
