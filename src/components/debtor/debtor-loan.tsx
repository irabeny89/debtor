import { LoanT } from "@/types";
import { calcLoanWorth, formatNumber, getCurrencySymbol } from "@/utils";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Props = {
  loan: LoanT
}
export default function DebtorLoan({ loan }: Props) {
  const router = useRouter()
  const loanWorth = calcLoanWorth(loan) / 100;
  const isOverdue = loan.status === "overdue";
  const isSettled = loan.status === "settled";
  const currencySymbol = getCurrencySymbol(loan.currency);

  return (
    <TouchableOpacity key={loan.id} style={styles.loanItem} onPress={() => router.push({ pathname: "/(tabs)/(loan)/detail", params: { id: loan.id } })}>
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

const styles = StyleSheet.create({
  loanItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  loanItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  loanIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  loanAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  loanDate: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  loanStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  loanStatusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});