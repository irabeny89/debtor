import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { DebtorT, LoanT } from "@/types";
import { mockDebtors } from "@/data/debtor";
import DebtorLoan from "./debtor-loan";

type Props = {
  debtorId: number;
  debtor: DebtorT;
  debtorLoans: LoanT[];
}

export default function LoanHistory({ debtorId, debtor, debtorLoans }: Props) {
  const renderLoanHistory = (loan: LoanT) => (
    <DebtorLoan loan={loan} key={loan.id} />
  )

  const handleDeleteDebtor = () => {
    Alert.alert(
      "Delete Debtor",
      `Are you sure you want to delete ${debtor.firstName} ${debtor.lastName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const index = mockDebtors.findIndex(d => d.id === debtorId);
            if (index !== -1) {
              mockDebtors.splice(index, 1);
            }
            router.back();
          }
        }
      ]
    );
  };
  return (
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

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteDebtor}
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
            <Text style={styles.deleteButtonText}>Delete Debtor</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.loansList}>
          {debtorLoans.map(renderLoanHistory)}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
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
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
  },
  deleteButtonText: {
    color: "#EF4444",
    fontWeight: "600",
    fontSize: 15,
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
})