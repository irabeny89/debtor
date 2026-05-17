import { LoanT } from "@/types";
import { calcLoanWorth, formatMoney } from "@/utils";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  loan: LoanT;
}
export default function AmountCard({ loan }: Props) {
  const formattedLoanWorth = formatMoney(calcLoanWorth(loan), loan.currency);
  const isOverdue = loan.status === "overdue";
  const isSettled = loan.status === "settled";
  const statusColor = isSettled ? "#059669" : isOverdue ? "#DC2626" : "#4F46E5";
  const formattedDate = new Date(loan.dueDate).toLocaleDateString();
  return (
    <View style={[styles.mainCard, { backgroundColor: statusColor }]}>
      <View style={styles.statusBadgeContainer}>
        <View style={styles.statusBadge}>
          <Ionicons
            name={isSettled ? "checkmark-circle" : isOverdue ? "warning" : "time"}
            size={16}
            color={statusColor}
          />
          <Text style={[styles.statusBadgeText, { color: statusColor }]}>
            {loan.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.amountLabel}>Total Due</Text>
      <Text style={styles.amountValue}>{formattedLoanWorth}</Text>
      <Text style={styles.dueDateText}>
        Due on {formattedDate}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
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
})