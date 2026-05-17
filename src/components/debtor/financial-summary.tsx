import useSettingData from "@/hooks/use-setting-data";
import { calcLoanWorth, formatMoney } from "@/utils";
import { Text, View, StyleSheet } from "react-native";
import { LoanT } from "@/types";

type Props = {
  debtorLoans: LoanT[];
}
export default function FinancialSummary({ debtorLoans }: Props) {
  const { currencyCode } = useSettingData();
  const totalLoanWorth = debtorLoans.reduce((acc, loan) => acc + calcLoanWorth(loan), 0);
  const activeLoans = debtorLoans.filter(l => l.status === "granted" || l.status === "overdue");
  const settledLoans = debtorLoans.filter(l => l.status === "settled");

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Financial Overview</Text>
      <View style={styles.statsCard}>
        <View style={styles.mainStat}>
          <Text style={styles.statLabel}>Total Outstanding</Text>
          <Text style={styles.statValue} adjustsFontSizeToFit numberOfLines={1}>
            {formatMoney(totalLoanWorth, currencyCode)}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.subStatsRow}>
          <View style={styles.subStat}>
            <Text style={styles.subStatValue}>{activeLoans.length}</Text>
            <Text style={styles.subStatLabel}>Active Loans</Text>
          </View>
          <View style={styles.subStat}>
            <Text style={styles.subStatValue}>{settledLoans.length}</Text>
            <Text style={styles.subStatLabel}>Settled Loans</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  statsCard: {
    backgroundColor: "#4F46E5",
    borderRadius: 24,
    padding: 24,
    elevation: 8,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  mainStat: {
    alignItems: "center",
    marginBottom: 20,
  },
  statLabel: {
    fontSize: 14,
    color: "#E0E7FF",
    fontWeight: "500",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginBottom: 20,
  },
  subStatsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  subStat: {
    alignItems: "center",
  },
  subStatValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  subStatLabel: {
    fontSize: 12,
    color: "#E0E7FF",
    fontWeight: "500",
  },
});