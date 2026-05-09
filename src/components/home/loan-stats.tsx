import MaIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, Text, View } from "react-native";
import useLoanStats from "@/hooks/use-loan-stats";
import useSettingData from "@/hooks/use-setting-data";
import { formatNumber, getCurrencySymbol } from "@/utils";

export default function LoanStats() {
	const { granted, settled, unsettled } = useLoanStats();
	const { currencyCode } = useSettingData();
	const currencySymbol = getCurrencySymbol(currencyCode);
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Loan Stats</Text>
			<View style={styles.box}>
				<MaIcons name="attach-money" size={120} color="black" />
				<View style={styles.stats}>
					<View style={styles.row}>
						<Text style={styles.number}>
              {currencySymbol}{formatNumber(granted)}
						</Text>
						<Text style={styles.text}>Granted</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.number}>
							{currencySymbol}{formatNumber(settled)}
						</Text>
						<Text style={styles.text}>Settled</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.number}>
							{currencySymbol}{formatNumber(unsettled)}
						</Text>
						<Text style={styles.text}>Unsettled</Text>
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginVertical: 30,
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
		width: 95,
		textAlign: "right",
	},
	text: {
		flex: 1,
		fontSize: 16,
		textAlign: "left",
	},
});
