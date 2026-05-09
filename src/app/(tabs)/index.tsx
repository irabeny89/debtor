import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CurrentDate from "@/components/home/current-date";
import DebtorStats from "@/components/home/debtor-stats";
import LoanStats from "@/components/home/loan-stats";

export default function Index() {
	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<CurrentDate />
				<DebtorStats />
				<LoanStats />
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContainer: {
		gap: 40,
	},
});
