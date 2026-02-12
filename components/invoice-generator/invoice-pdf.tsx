"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { EMITTER, BANK_DETAILS, InvoiceData } from "@/lib/invoice-defaults";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  emitterSection: {
    width: "45%",
  },
  clientSection: {
    width: "45%",
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 8,
    color: "#666",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  emitterName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  text: {
    marginBottom: 2,
    color: "#333",
  },
  invoiceTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 5,
    color: "#1a1a1a",
  },
  invoiceInfo: {
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: 10,
    borderRadius: 4,
  },
  tableHeaderCell: {
    color: "#fff",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    padding: 10,
    alignItems: "flex-start",
  },
  colDescription: {
    width: "50%",
  },
  colQuantity: {
    width: "15%",
    textAlign: "center",
  },
  colUnitPrice: {
    width: "17.5%",
    textAlign: "right",
  },
  colTotal: {
    width: "17.5%",
    textAlign: "right",
  },
  itemDescription: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  itemDetail: {
    fontSize: 8,
    color: "#666",
    marginBottom: 2,
    paddingLeft: 8,
  },
  totalsSection: {
    marginLeft: "auto",
    width: "40%",
    marginBottom: 30,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  totalRowFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 10,
    borderRadius: 4,
    marginTop: 5,
  },
  totalLabel: {
    color: "#666",
  },
  totalValue: {
    fontFamily: "Helvetica-Bold",
  },
  totalValueFinal: {
    fontFamily: "Helvetica-Bold",
    color: "#fff",
    fontSize: 12,
  },
  totalLabelFinal: {
    color: "#fff",
    fontSize: 12,
  },
  tvaNote: {
    fontSize: 8,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 30,
    textAlign: "center",
  },
  paymentSection: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 4,
  },
  paymentTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
  },
  paymentText: {
    marginBottom: 4,
    color: "#333",
  },
  bankDetails: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  bankLabel: {
    fontSize: 8,
    color: "#666",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#999",
  },
});

interface InvoicePDFProps {
  data: InvoiceData;
  showWatermark?: boolean;
}

export function InvoicePDF({ data, showWatermark = false }: InvoicePDFProps) {
  const totalHT = data.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const formatCurrency = (amount: number) =>
    amount.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " €";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.emitterSection}>
            <Text style={styles.sectionTitle}>Émetteur</Text>
            <Text style={styles.emitterName}>{EMITTER.name}</Text>
            <Text style={styles.text}>{EMITTER.address}</Text>
            <Text style={styles.text}>{EMITTER.city}</Text>
            <Text style={styles.text}>Tél : {EMITTER.phone}</Text>
            <Text style={styles.text}>Email : {EMITTER.email}</Text>
            <Text style={[styles.text, { marginTop: 8 }]}>
              SIRET : {EMITTER.siret}
            </Text>
          </View>
          <View style={styles.clientSection}>
            <Text style={styles.sectionTitle}>Client</Text>
            <Text style={[styles.text, { fontFamily: "Helvetica-Bold" }]}>
              {data.clientName || "Nom du client"}
            </Text>
            <Text style={styles.text}>
              {data.clientAddress || "Adresse du client"}
            </Text>
            <Text style={styles.text}>{data.clientCity || "Ville"}</Text>
          </View>
        </View>

        {/* Invoice Title */}
        <Text style={styles.invoiceTitle}>FACTURE N° {data.invoiceNumber}</Text>
        <Text style={styles.invoiceInfo}>
          Date d&apos;émission : {data.invoiceDate}
        </Text>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colDescription]}>
              Description de la prestation
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colQuantity]}>
              Quantité
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colUnitPrice]}>
              Prix Unitaire
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>
              Total HT
            </Text>
          </View>
          {data.items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <View style={styles.colDescription}>
                <Text style={styles.itemDescription}>{item.description}</Text>
                {item.details.map((detail, i) => (
                  <Text key={i} style={styles.itemDetail}>
                    • {detail}
                  </Text>
                ))}
              </View>
              <Text style={[styles.text, styles.colQuantity]}>
                {item.quantity}
              </Text>
              <Text style={[styles.text, styles.colUnitPrice]}>
                {formatCurrency(item.unitPrice)}
              </Text>
              <Text style={[styles.text, styles.colTotal]}>
                {formatCurrency(item.quantity * item.unitPrice)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total HT :</Text>
            <Text style={styles.totalValue}>{formatCurrency(totalHT)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TVA (non applicable) :</Text>
            <Text style={styles.totalValue}>0,00 €</Text>
          </View>
          <View style={styles.totalRowFinal}>
            <Text style={styles.totalLabelFinal}>NET À PAYER :</Text>
            <Text style={styles.totalValueFinal}>{formatCurrency(totalHT)}</Text>
          </View>
        </View>

        {/* TVA Note */}
        <Text style={styles.tvaNote}>
          TVA non applicable, article 293 B du CGI.
        </Text>

        {/* Payment Section */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>INFORMATIONS DE PAIEMENT</Text>
          <Text style={styles.paymentText}>
            Conditions de règlement : Paiement à réception de la facture.
          </Text>
          <Text style={styles.paymentText}>
            Mode de règlement : Virement bancaire (préféré), Chèque ou Espèces.
          </Text>
          <View style={styles.bankDetails}>
            <Text style={styles.bankLabel}>Coordonnées bancaires (RIB) :</Text>
            <Text style={styles.paymentText}>
              Titulaire : {BANK_DETAILS.holder}
            </Text>
            <Text style={styles.paymentText}>Banque : {BANK_DETAILS.bank}</Text>
            <Text style={styles.paymentText}>IBAN : {BANK_DETAILS.iban}</Text>
            <Text style={styles.paymentText}>BIC : {BANK_DETAILS.bic}</Text>
            <Text style={[styles.paymentText, { marginTop: 8, fontStyle: "italic" }]}>
              Merci d&apos;indiquer le numéro &quot;Facture {data.invoiceNumber}&quot; en
              libellé du virement.
            </Text>
          </View>
        </View>

        {/* Watermark */}
        {showWatermark && (
          <Text
            style={{
              position: "absolute",
              top: "45%",
              left: 0,
              right: 0,
              textAlign: "center",
              fontSize: 40,
              color: "#e0e0e0",
              opacity: 0.4,
              transform: "rotate(-30deg)",
              fontFamily: "Helvetica-Bold",
            }}
          >
            Version gratuite
          </Text>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          {EMITTER.name} • SIRET {EMITTER.siret} • {EMITTER.email}
        </Text>
      </Page>
    </Document>
  );
}
