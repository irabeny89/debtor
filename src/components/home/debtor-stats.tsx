import MaIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, Text, View } from "react-native";
import useDebtorStats from "@/hooks/use-debtor-stats";

export default function DebtorStats() {
	const { total, active, inActive, suspended } = useDebtorStats();
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Debtor Stats</Text>
			<View style={styles.box}>
				<MaIcons name="group" size={120} />
				<View style={styles.stats}>
					<View style={styles.row}>
						<Text style={styles.number}>{total}</Text>
						<Text style={styles.text}>Total</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.number}>{active}</Text>
						<Text style={styles.text}>Active</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.number}>{inActive}</Text>
						<Text style={styles.text}>Inactive</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.number}>{suspended}</Text>
						<Text style={styles.text}>Suspended</Text>
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginHorizontal: 10,
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		marginBottom: 4,
	},
	box: {
		paddingHorizontal: 20,
		flexDirection: "row",
		gap: 10,
    alignItems: "center",
    borderWidth: 2,
		borderRadius: 2,
	},
	stats: {
		flex: 1,
	},
	row: {
    flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	number: {
		fontSize: 24,
    fontWeight: "bold",
    width: 55,
		textAlign: "right"
	},
	text: {
		flex: 1,
		fontSize: 16,
		textAlign: "left",
	},
});
