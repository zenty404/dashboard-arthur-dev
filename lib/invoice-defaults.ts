export const EMITTER = {
  name: "Arthur LASNIER",
  address: "92 rue des Labours",
  city: "77700 Magny-le-Hongre",
  phone: "06 52 37 93 43",
  email: "contact@arthur-dev.eu",
  siret: "999 696 735 00011",
};

export const BANK_DETAILS = {
  holder: "Arthur LASNIER",
  bank: "Crédit Mutuel",
  iban: "FR76 1027 8059 0000 0218 9420 203",
  bic: "CMCIFR2A",
};

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
