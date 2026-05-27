import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CurrentDate from "@/components/home/current-date";
import DebtorStats from "@/components/home/debtor-stats";
import LoanStats from "@/components/home/loan-stats";
import { StatusBar } from "expo-status-bar";

export default function Index() {
	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style="inverted" />
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
		gap: 20,
		paddingBottom: 120,
	},
});
