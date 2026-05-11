import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import useDebtor from "@/hooks/use-debtor";
import useLoanList from "@/hooks/use-loan-list";
import { calcLoanWorth, formatNumber, getCurrencySymbol } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import useSettingData from "@/hooks/use-setting-data";
import { LoanT } from "@/types";

type ParamsT = {
  id: string
}

const renderLoanHistory = (currencySymbol: string) => (loan: LoanT) => {
  const loanWorth = calcLoanWorth(loan) / 100;
  const isOverdue = loan.status === "overdue";
  const isSettled = loan.status === "settled";

  return (
    <TouchableOpacity key={loan.id} style={styles.loanItem}>
      <View style={styles.loanItemLeft}>
        <View style={[
          styles.loanIcon,
          { backgroundColor: isSettled ? "#D1FAE5" : isOverdue ? "#FEE2E2" : "#EEF2FF" }
        ]}>
          <Ionicons
            name={isSettled ? "checkmark-circle" : isOverdue ? "warning" : "time"}
            size={20}
            color={isSettled ? "#059669" : isOverdue ? "#DC2626" : "#4F46E5"}
          />
        </View>
        <View>
          <Text style={styles.loanAmount}>{currencySymbol}{formatNumber(loanWorth)}</Text>
          <Text style={styles.loanDate}>
            Due: {new Date(loan.dueDate).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View style={[
        styles.loanStatusBadge,
        { backgroundColor: isSettled ? "#D1FAE5" : isOverdue ? "#FEE2E2" : "#EEF2FF" }
      ]}>
        <Text style={[
          styles.loanStatusText,
          { color: isSettled ? "#059669" : isOverdue ? "#DC2626" : "#4F46E5" }
        ]}>
          {loan.status.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default function DetailScreen() {
  const { id } = useLocalSearchParams<ParamsT>();
  const debtor = useDebtor(id);
  const loans = useLoanList();
  const debtorLoans = loans.filter(loan => loan.debtorId === id);
  const { currencyCode } = useSettingData();
  const currencySymbol = getCurrencySymbol(debtorLoans[0]?.currency || currencyCode);

  if (!debtor) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#EF4444" />
        <Text style={styles.errorText}>Debtor not found</Text>
      </View>
    );
  }

  const initials = `${debtor.firstName?.[0] || ""}${debtor.lastName?.[0] || ""}`.toUpperCase();
  const totalLoanWorth = debtorLoans.reduce((acc, loan) => acc + calcLoanWorth(loan), 0) / 100;
  const activeLoans = debtorLoans.filter(l => l.status === "granted" || l.status === "overdue");
  const settledLoans = debtorLoans.filter(l => l.status === "settled");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Profile Header Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{initials}</Text>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: debtor.status === "Active" ? "#10B981" : debtor.status === "Suspended" ? "#EF4444" : "#9CA3AF" }
          ]} />
        </View>
        <Text style={styles.nameText}>{debtor.firstName} {debtor.lastName}</Text>

        <View style={styles.badgeContainer}>
          <View style={[styles.badge, { backgroundColor: debtor.status === "Active" ? "#D1FAE5" : debtor.status === "Suspended" ? "#FEE2E2" : "#F3F4F6" }]}>
            <Text style={[styles.badgeText, { color: debtor.status === "Active" ? "#065F46" : debtor.status === "Suspended" ? "#991B1B" : "#374151" }]}>
              {debtor.status}
            </Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name={debtor.gender === "m" ? "male" : "female"} size={12} color="#4F46E5" />
            <Text style={[styles.badgeText, { color: "#4F46E5", marginLeft: 4 }]}>
              {debtor.gender === "m" ? "Male" : "Female"}
            </Text>
          </View>
        </View>

        <View style={styles.contactInfo}>
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="call" size={16} color="#4F46E5" />
            </View>
            <Text style={styles.infoText}>{debtor.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="briefcase" size={16} color="#4F46E5" />
            </View>
            <Text style={styles.infoText}>{debtor.workPlace}</Text>
          </View>
        </View>
      </View>

      {/* Financial Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Overview</Text>
        <View style={styles.statsCard}>
          <View style={styles.mainStat}>
            <Text style={styles.statLabel}>Total Outstanding</Text>
            <Text style={styles.statValue} adjustsFontSizeToFit numberOfLines={1}>
              {currencySymbol}{formatNumber(totalLoanWorth)}
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

      {/* Loan History */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Loan History</Text>
          <TouchableOpacity onPress={() => router.push("/add")}>
            <Text style={styles.seeAllText}>+ Add Loan</Text>
          </TouchableOpacity>
        </View>

        {!debtorLoans.length ? (
          <View style={styles.emptyState}>
            <Ionicons name="wallet-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>No loans recorded yet.</Text>
          </View>
        ) : (
          <View style={styles.loansList}>
            {debtorLoans.map(renderLoanHistory(currencySymbol))}
          </View>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120, // Tab bar clearance
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 10,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#4F46E5",
  },
  statusIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  contactInfo: {
    width: "100%",
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 16,
    gap: 12,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "500",
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4F46E5",
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
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  loansList: {
    gap: 12,
  },
  loanItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  loanItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  loanIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  loanAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  loanDate: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  loanStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  loanStatusText: {
    fontSize: 11,
    fontWeight: "700",
  },
});