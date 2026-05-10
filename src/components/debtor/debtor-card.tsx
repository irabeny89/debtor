import { Text, View, StyleSheet, Pressable } from "react-native";
import { DebtorT } from "@/types";
import { Ionicons } from "@expo/vector-icons"
import useLoanList from "@/hooks/use-loan-list";
import { calcLoanWorth, formatMoney } from "@/utils";

type Props = {
  data: DebtorT
}

export default function DebtorCard({ data }: Props) {
  const loans = useLoanList();
  const debtorLoans = loans.filter(loan => loan.debtorId === data.id);
  const loanWorth = debtorLoans.reduce((acc, loan) => acc + calcLoanWorth(loan), 0);

  const initials = `${data.firstName?.[0] || ""}${data.lastName?.[0] || ""}`.toUpperCase();

  return (
    <Pressable style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.name}>{`${data.firstName} ${data.lastName}`}</Text>
          <View style={styles.phoneRow}>
            <Ionicons name="call" size={14} color="#6B7280" />
            <Text style={styles.phoneText}>{data.phone}</Text>
          </View>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <View style={styles.detailIconContainer}>
            <Ionicons name="briefcase" size={16} color="#8B5CF6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailLabel}>Workplace</Text>
            <Text style={styles.detailValue} numberOfLines={1}>{data.workPlace || "N/A"}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.detailsRow, { marginTop: 12 }]}>
        <View style={styles.statsCard}>
          <View style={[styles.statsIcon, { backgroundColor: '#DBEAFE' }]}>
            <Ionicons name="wallet" size={18} color="#2563EB" />
          </View>
          <View style={styles.statsTextContainer}>
            <Text style={styles.statsLabel}>Active Loans</Text>
            <Text style={styles.statsValue}>{debtorLoans.length}</Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={[styles.statsIcon, { backgroundColor: '#D1FAE5' }]}>
            <Ionicons name="cash" size={18} color="#059669" />
          </View>
          <View style={styles.statsTextContainer}>
            <Text style={styles.statsLabel}>Total Worth</Text>
            <Text style={[styles.statsValue, { color: '#059669' }]} numberOfLines={1} adjustsFontSizeToFit>{formatMoney(loanWorth, "NGN")}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  containerPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563EB",
    letterSpacing: 1,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  phoneText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 16,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 10,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  detailIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EDE9FE",
    justifyContent: "center",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
  },
  statsCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  statsIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  statsTextContainer: {
    flex: 1,
  },
  statsLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statsValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
});