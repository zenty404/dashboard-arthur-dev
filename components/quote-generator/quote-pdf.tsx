"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { EMITTER, BANK_DETAILS } from "@/lib/invoice-defaults";
import { QuoteData } from "@/lib/quote-defaults";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingBottom: 50,
    fontSize: 9,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  emitterSection: {
    width: "45%",
  },
  clientSection: {
    width: "45%",
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 7,
    color: "#666",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  emitterName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  text: {
    marginBottom: 1,
    color: "#333",
  },
  quoteTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 3,
    color: "#1a1a1a",
  },
  quoteInfo: {
    textAlign: "center",
    marginBottom: 15,
    color: "#666",
    fontSize: 9,
  },
  table: {
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: 7,
    borderRadius: 4,
  },
  tableHeaderCell: {
    color: "#fff",
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    padding: 7,
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
    marginBottom: 2,
  },
  itemDetail: {
    fontSize: 7,
    color: "#666",
    marginBottom: 1,
    paddingLeft: 8,
  },
  totalsSection: {
    marginLeft: "auto",
    width: "40%",
    marginBottom: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  totalRowFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 3,
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
    fontSize: 11,
  },
  totalLabelFinal: {
    color: "#fff",
    fontSize: 11,
  },
  tvaNote: {
    fontSize: 7,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 8,
    textAlign: "center",
  },
  bottomSection: {
    flexDirection: "row",
    gap: 12,
  },
  conditionsSection: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 4,
    flex: 1,
  },
  conditionsTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
  },
  conditionsText: {
    marginBottom: 2,
    color: "#333",
    fontSize: 8,
  },
  signatureSection: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    width: "40%",
  },
  signatureAccord: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginBottom: 15,
    textAlign: "center",
  },
  signatureLabel: {
    marginBottom: 18,
    color: "#333",
    fontSize: 8,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 7,
    color: "#999",
  },
});

interface QuotePDFProps {
  data: QuoteData;
}

export function QuotePDF({ data }: QuotePDFProps) {
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
            <Text style={[styles.text, { marginTop: 4 }]}>
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

        {/* Quote Title */}
        <Text style={styles.quoteTitle}>DEVIS N° {data.quoteNumber}</Text>
        <Text style={styles.quoteInfo}>
          Date d&apos;émission : {data.quoteDate} • Validité : {data.validityDays} jours
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
            <Text style={styles.totalLabelFinal}>TOTAL :</Text>
            <Text style={styles.totalValueFinal}>{formatCurrency(totalHT)}</Text>
          </View>
        </View>

        {/* TVA Note */}
        <Text style={styles.tvaNote}>
          TVA non applicable, article 293 B du CGI.
        </Text>

        {/* Conditions + Signature side by side */}
        <View style={styles.bottomSection}>
          <View style={styles.conditionsSection}>
            <Text style={styles.conditionsTitle}>CONDITIONS</Text>
            <Text style={styles.conditionsText}>
              Validité : {data.validityDays} jours à compter de la date d&apos;émission.
            </Text>
            <Text style={styles.conditionsText}>
              Retourner signé avec la mention &quot;Bon pour accord&quot;.
            </Text>
            <Text style={[styles.conditionsText, { marginTop: 4 }]}>
              Règlement : Virement bancaire, Chèque ou Espèces.
            </Text>
            <View style={{ marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: "#ddd" }}>
              <Text style={{ fontSize: 7, color: "#666" }}>Coordonnées bancaires :</Text>
              <Text style={styles.conditionsText}>
                {BANK_DETAILS.holder} — {BANK_DETAILS.bank}
              </Text>
              <Text style={styles.conditionsText}>IBAN : {BANK_DETAILS.iban}</Text>
              <Text style={styles.conditionsText}>BIC : {BANK_DETAILS.bic}</Text>
            </View>
          </View>

          <View style={styles.signatureSection}>
            <Text style={styles.signatureAccord}>Bon pour accord</Text>
            <Text style={styles.signatureLabel}>Date :</Text>
            <Text style={styles.signatureLabel}>Signature du client :</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          {EMITTER.name} • SIRET {EMITTER.siret} • {EMITTER.email}
        </Text>
      </Page>
    </Document>
  );
}
