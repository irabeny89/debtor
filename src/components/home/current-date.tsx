import { StyleSheet, Text, View } from "react-native";
import { formatDate } from "@/utils";

export default function CurrentDate() {
	return (
		<View style={styles.dateContainer}>
			<Text style={styles.dateLabel}>Currently</Text>
			<Text style={styles.dateText}>{formatDate(new Date())}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	dateContainer: {
		justifyContent: "center",
		alignItems: "center",
		marginVertical: 30,
	},
	dateLabel: {
		fontSize: 26,
		fontWeight: "bold",
	},
	dateText: {
		fontSize: 24,
	},
});
