import FinancialSummary from "@/components/debtor/financial-summary";
import LoanHistory from "@/components/debtor/loan-history";
import ProfileCard from "@/components/debtor/profile-card";
import useDebtor from "@/hooks/use-debtor";
import useLoanList from "@/hooks/use-loan-list";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type ParamsT = {
  id: string
}

export default function DetailScreen() {
  const { id } = useLocalSearchParams<ParamsT>();
  const debtor = useDebtor(+id);
  const loans = useLoanList();
  const debtorLoans = loans.filter(loan => loan.debtorId === +id);

  if (!debtor) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#EF4444" />
        <Text style={styles.errorText}>Debtor not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <ProfileCard
        id={debtor.id}
        firstName={debtor.firstName}
        lastName={debtor.lastName}
        status={debtor.status}
        gender={debtor.gender}
        phone={debtor.phone}
        workPlace={debtor.workPlace}
      />
      <FinancialSummary debtorLoans={debtorLoans} />
      <LoanHistory debtorId={Number(id)} debtor={debtor} debtorLoans={debtorLoans} />
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
});