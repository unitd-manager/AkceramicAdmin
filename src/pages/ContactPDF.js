import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20 },
  row: {
    flexDirection: "row",
    borderBottom: "1px solid #ccc",
    padding: 5
  },
  cell: { flex: 1 }
});

export default function ContactPDF({ users }) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text>Contact List</Text>

        {users.map((u, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.cell}>{u.name}</Text>
            <Text style={styles.cell}>{u.phone}</Text>
            <Text style={styles.cell}>{u.email}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}