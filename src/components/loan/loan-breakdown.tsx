import { LoanT } from "@/types";
import { calcLoanWorth, formatMoney, formatNumber } from "@/utils";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  loan: LoanT
}

export default function LoanBreakdown({ loan }: Props) {
  const formattedLoanWorth = formatMoney(calcLoanWorth(loan), loan.currency);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Loan Breakdown</Text>
      <View style={styles.breakdownCard}>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Principal Amount</Text>
          <Text style={styles.breakdownValue}>{formattedLoanWorth}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Interest Rate</Text>
          <Text style={styles.breakdownValue}>{(loan.interest * 100).toFixed(1)}%</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Late Fee Rate</Text>
          <Text style={styles.breakdownValue}>{(loan.lateFeeRate * 100).toFixed(1)}%</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Date Granted</Text>
          <Text style={styles.breakdownValue}>{new Date(loan.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    marginLeft: 4,
  },
  breakdownCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  breakdownLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 12,
  },
  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
})