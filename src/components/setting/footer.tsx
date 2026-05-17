import { StyleSheet, Text, View } from "react-native"

export default function Footer() {
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>Debtor Tracker Mobile v1.0.0</Text>
      <Text style={styles.footerSubText}>Safeguarding your records with premium care.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  footerContainer: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  footerSubText: {
    fontSize: 10,
    color: "#BDC3C7",
    marginTop: 4,
  },
})