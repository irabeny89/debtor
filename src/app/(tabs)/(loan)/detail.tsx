import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useLoan from "@/hooks/use-loan";
import useDebtor from "@/hooks/use-debtor";
import { calcLoanWorth, formatNumber, getCurrencySymbol } from "@/utils";

type ParamsT = {
  id: string
}

export default function LoanDetailScreen() {
  const { id } = useLocalSearchParams<ParamsT>();
  const router = useRouter();
  const loan = useLoan(id);
  const debtor = useDebtor(loan?.debtorId || "");

  if (!loan || !debtor) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#EF4444" />
        <Text style={styles.errorText}>Loan not found</Text>
      </View>
    );
  }

  const loanWorth = calcLoanWorth(loan) / 100;
  const originalAmount = loan.amount / 100;
  const currencySymbol = getCurrencySymbol(loan.currency);
  const isOverdue = loan.status === "overdue";
  const isSettled = loan.status === "settled";

  const statusColor = isSettled ? "#059669" : isOverdue ? "#DC2626" : "#4F46E5";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      
      {/* Main Amount Card */}
      <View style={[styles.mainCard, { backgroundColor: statusColor }]}>
        <View style={styles.statusBadgeContainer}>
          <View style={styles.statusBadge}>
            <Ionicons name={isSettled ? "checkmark-circle" : isOverdue ? "warning" : "time"} size={16} color={statusColor} />
            <Text style={[styles.statusBadgeText, { color: statusColor }]}>
              {loan.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.amountLabel}>Total Due</Text>
        <Text style={styles.amountValue}>
          {currencySymbol}{formatNumber(loanWorth)}
        </Text>
        <Text style={styles.dueDateText}>
          Due on {new Date(loan.dueDate).toLocaleDateString()}
        </Text>
      </View>

      {/* Debtor Summary Card */}
      <TouchableOpacity 
        style={styles.debtorCard}
        onPress={() => router.push({ pathname: "/(tabs)/(debtor)/detail", params: { id: debtor.id } })}
      >
        <View style={styles.debtorLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(debtor.firstName?.[0] || "") + (debtor.lastName?.[0] || "")}
            </Text>
          </View>
          <View>
            <Text style={styles.debtorName}>{debtor.firstName} {debtor.lastName}</Text>
            <Text style={styles.debtorPhone}>{debtor.phone}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      {/* Breakdown Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Loan Breakdown</Text>
        <View style={styles.breakdownCard}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Principal Amount</Text>
            <Text style={styles.breakdownValue}>{currencySymbol}{formatNumber(originalAmount)}</Text>
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

      {/* Settings/Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingsRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBox, { backgroundColor: "#EEF2FF" }]}>
                <Ionicons name="notifications" size={20} color="#4F46E5" />
              </View>
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Text style={styles.settingValue}>{loan.notifyOnDue ? "Enabled" : "Disabled"}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.settingsRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBox, { backgroundColor: "#FDF4FF" }]}>
                <Ionicons name="calendar" size={20} color="#C026D3" />
              </View>
              <Text style={styles.settingLabel}>Late Fee Cycle</Text>
            </View>
            <Text style={styles.settingValue}>{loan.lateFeeCycle} Days</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionContainer}>
        {!isSettled && (
          <TouchableOpacity style={styles.primaryAction}>
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={styles.primaryActionText}>Mark as Settled</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.secondaryAction}
          onPress={() => router.push(`/(tabs)/(loan)/edit?id=${id}`)}
        >
          <Ionicons name="pencil" size={20} color="#4B5563" />
          <Text style={styles.secondaryActionText}>Edit Loan Details</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  mainCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  statusBadgeContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  amountLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 40,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  dueDateText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  debtorCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  debtorLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4F46E5",
  },
  debtorName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  debtorPhone: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
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
  settingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  settingValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  actionContainer: {
    gap: 12,
    marginTop: 8,
  },
  primaryAction: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 16,
    gap: 8,
    elevation: 4,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryAction: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  secondaryActionText: {
    color: "#4B5563",
    fontSize: 16,
    fontWeight: "600",
  },
});