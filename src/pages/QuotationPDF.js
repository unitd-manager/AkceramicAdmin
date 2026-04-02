import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image
} from "@react-pdf/renderer";
import logoImage from "../../src/upload/Ak Ceramic World logo.jpg"

const styles = StyleSheet.create({

  page: {
    padding: 20,
    fontSize: 10,
    backgroundColor: "#f4f6f8"
  },

  // 🔥 HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 8,
    marginBottom: 15
  },

  logo: {
    width: 150,
    height: 125,
    borderRadius:50
  },

  company: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginRight:220
  },

  subtitle: {
    color: "#cbd5e1",
    fontSize: 10
  },

  // 🔥 CARD
  card: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },

  label: {
    fontSize: 9,
    color: "#64748b"
  },

  value: {
    fontSize: 11,
    fontWeight: "bold"
  },

  // 🔥 TABLE
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    color: "#fff",
    padding: 6,
    borderRadius: 6,
    marginTop: 10
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding:23,
    borderBottom: "1px solid #eee"
  },

  cell: {
    flex: 1,
    fontSize: 9
  },

  imageCell: {
    width: 55,
    height: 55,
    marginRight: 16
  },

  productImage: {
    width: 50,
    height: 70,
    borderRadius: 5
  },

  totalBox: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#16a34a",
    borderRadius: 8
  },

  totalText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold"
  }

});

export default function QuotationPDF({ order, items }) {

  const total = items.reduce((sum, i) => sum + Number(i.price), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* 🔥 HEADER */}
        <View style={styles.header}>
              <Image src={logoImage} style={styles.logo} />
          <View>
            <Text style={styles.company}>AK CERAMIC WORLD</Text>
            <Text style={styles.subtitle}>7/14V, opp. to Royal Enfield Showroom, next to Urban Dhaba,</Text>
            <Text style={styles.subtitle}>70D, Tuckerammalpuram, Tirunelveli, Tamil Nadu 627007</Text>
          </View>

          {/* ✅ LOGO FROM PUBLIC */}
        

        </View>

        {/* 🔥 CUSTOMER */}
        <View style={styles.card}>
          <Text style={styles.value}>Order #{order.order_id}</Text>

          <Text style={styles.label}>Customer</Text>
          <Text style={styles.value}>{order.name}</Text>

          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{order.phone}</Text>

          <Text style={styles.label}>City</Text>
          <Text style={styles.value}>{order.city}</Text>
        </View>

        {/* 🔥 TABLE HEADER */}
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, { flex: 0.8 }]}>Image</Text>
          <Text style={styles.cell}>Product</Text>
          <Text style={styles.cell}>Price</Text>
          <Text style={styles.cell}>Area</Text>
          <Text style={styles.cell}>Total Amount</Text>
        </View>

        {/* 🔥 ITEMS WITH IMAGE */}
        {items.map((item, i) => (

          <View key={i} style={styles.row}>

            {/* PRODUCT IMAGE */}
            <View style={styles.imageCell}>
              <Image
                src={
                  item.image
                    ? `http://localhost:5000/uploads/${item.image}`  
                    : "/no-image.png"
                }
                style={styles.productImage}
              />
            </View>

            <Text style={styles.cell}>{item.product_name}</Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}>{item.total_area} Sq.ft</Text>
            <Text style={styles.cell}></Text>

          </View>

        ))}

        {/* 🔥 TOTAL */}
        <View style={styles.totalBox}>
          <Text style={styles.totalText}>
            Total Amount: ₹{order.total_amount || total}
          </Text>
        </View>

      </Page>
    </Document>
  );
}