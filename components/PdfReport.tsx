import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 50, backgroundColor: '#F5F5F0', color: '#3D5A73', fontFamily: 'Helvetica' },
  header: { borderBottom: 2, borderColor: '#3D5A73', paddingBottom: 20, marginBottom: 30 },
  brand: { fontSize: 24, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, marginTop: 20, marginBottom: 10, borderLeft: 4, paddingLeft: 10, borderColor: '#3D5A73' },
  body: { fontSize: 10, lineHeight: 1.6, color: '#333', marginBottom: 10 },
  statsRow: { flexDirection: 'row', gap: 15, marginTop: 20 },
  card: { flex: 1, backgroundColor: '#3D5A73', color: '#F5F5F0', padding: 15, borderRadius: 2 },
  cardLabel: { fontSize: 7, textTransform: 'uppercase', opacity: 0.8 },
  cardValue: { fontSize: 14, marginTop: 5 },
  priceBox: { marginTop: 40, padding: 30, border: 2, borderColor: '#3D5A73', textAlign: 'center' },
  footer: { position: 'absolute', bottom: 30, left: 50, fontSize: 8, opacity: 0.5 }
});

export const AgentTimmosReport = ({ data, cityInfo }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.brand}>Agent TimmoS</Text>
        <Text style={{ fontSize: 9, marginTop: 5 }}>RAPPORT D'EXPERTISE IMMOBILIÈRE</Text>
      </View>

      <Text style={styles.sectionTitle}>Cadre de Vie : {cityInfo.name}</Text>
      <Text style={styles.body}>{cityInfo.history}</Text>

      <View style={styles.statsRow}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Ventes Notaires (DVF)</Text>
          <Text style={styles.cardValue}>{data.m2Dvf} €/m²</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Annonces Actuelles</Text>
          <Text style={styles.cardValue}>{data.m2Ads} €/m²</Text>
        </View>
      </View>

      <View style={styles.priceBox}>
        <Text style={{ fontSize: 10, letterSpacing: 2, marginBottom: 10 }}>VALEUR VÉNALE ESTIMÉE</Text>
        <Text style={{ fontSize: 30 }}>{data.totalPrice.toLocaleString()} €</Text>
      </View>

      <Text style={styles.footer}>Document confidentiel édité par Agent TimmoS - {new Date().toLocaleDateString()}</Text>
    </Page>
  </Document>
);
