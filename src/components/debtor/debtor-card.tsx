import { Text, View, StyleSheet } from "react-native";
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
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Ionicons name={"person-outline"} size={16} />
        <Text style={styles.name}>{`${data.firstName} ${data.lastName}`}</Text>
      </View>
      <View style={styles.row}>
        <Ionicons name="briefcase-outline" size={16} />
        <Text>{data.workPlace}</Text>
      </View>
      <View style={styles.row}>
        <Ionicons name="call-outline" size={16} />
        <Text>{data.phone}</Text>
      </View>
      <View style={styles.row}>
        <Ionicons name="wallet-outline" size={16} />
        <Text style={styles.loanNumber}>{debtorLoans.length}</Text><Text>loans</Text>
      </View>
      <View style={styles.row}>
        <Ionicons name="cash-outline" size={16} />
        <Text style={styles.loanWorth}>{formatMoney(loanWorth, "NGN")}</Text><Text>worth</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 2,
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: "center",
    gap: 5
  },
  name: {
    fontSize: 16,
    fontWeight: "semibold",
  },
  loanNumber: {
    fontWeight: "semibold",
    fontSize: 16
  },
  loanWorth: {
    fontWeight: "semibold",
    fontSize: 16
  }
})