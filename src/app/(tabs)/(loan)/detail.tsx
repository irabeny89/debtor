import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useLoan from "@/hooks/use-loan";
import useDebtor from "@/hooks/use-debtor";
import AmountCard from "@/components/loan/amount-card";
import DebtorBar from "@/components/loan/debtor-bar";
import LoanBreakdown from "@/components/loan/loan-breakdown";
import LoanPreference from "@/components/loan/loan-preference";
import ActionButtons from "@/components/loan/action-buttons";

type ParamsT = {
  id: string
}

export default function LoanDetailScreen() {
  const { id } = useLocalSearchParams<ParamsT>();
  const loan = useLoan(+id);
  const debtor = useDebtor(loan?.debtorId || 0);

  if (!loan || !debtor) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#EF4444" />
        <Text style={styles.errorText}>Loan not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <AmountCard loan={loan} />
      <DebtorBar debtor={debtor} />
      <LoanBreakdown loan={loan} />
      <LoanPreference loan={loan} />
      <ActionButtons loan={loan} />
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
    paddingBottom: 150,
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
});