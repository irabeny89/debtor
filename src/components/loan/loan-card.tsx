import { Ionicons } from "@expo/vector-icons";
import { LoanT } from "@/types";
import { calcLoanWorth, formatNumber, getCurrencySymbol } from "@/utils";
import React from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

type Props = {
  debtorName: string
} & LoanT
export default function LoanCard({ debtorName, ...loan }: Props) {
  const router = useRouter()
  const loanWorth = calcLoanWorth(loan) / 100;
  const isOverdue = loan.status === "overdue";
  const isSettled = loan.status === "settled";
  const currencySymbol = getCurrencySymbol(loan.currency);

  return (
    <Pressable
      onPress={() => router.push({ pathname: "/detail", params: { id: loan.id } })}
      style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}
    >
      <View style={styles.loanItemLeft}>
        <View style={[
          styles.loanIcon,
          { backgroundColor: isSettled ? "#D1FAE5" : isOverdue ? "#FEE2E2" : "#EEF2FF" }
        ]}>
          <Ionicons
            name={isSettled ? "checkmark-circle" : isOverdue ? "warning" : "time"}
            size={24}
            color={isSettled ? "#059669" : isOverdue ? "#DC2626" : "#4F46E5"}
          />
        </View>
        <View>
          <Text style={styles.debtorName}>{debtorName}</Text>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  containerPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  loanItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  loanIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  debtorName: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  loanAmount: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  loanDate: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  loanStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  loanStatusText: {
    fontSize: 12,
    fontWeight: "700",
  },
})