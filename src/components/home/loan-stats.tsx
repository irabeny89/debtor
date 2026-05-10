import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import useLoanStats from "@/hooks/use-loan-stats";
import useSettingData from "@/hooks/use-setting-data";
import { formatNumber, getCurrencySymbol } from "@/utils";

export default function LoanStats() {
	const { totalGranted, active, settled, unsettled } = useLoanStats();
	const { currencyCode } = useSettingData();
	const currencySymbol = getCurrencySymbol(currencyCode);

	return (
		<View style={styles.container}>
			<Text style={styles.headerTitle}>Finances</Text>

			<View style={styles.mainCardShadow}>
				<View style={styles.mainCard}>
					<Image
						source={require("@/assets/images/static.photos-abstract.webp")}
						style={StyleSheet.absoluteFill}
						contentFit="cover"
					/>
					<View style={styles.overlay} />

					<View style={styles.mainCardContent}>
						<View style={styles.mainCardHeader}>
							<View style={styles.iconContainer}>
								<Ionicons name="wallet" size={24} color="#FFFFFF" />
							</View>
							<Text style={styles.mainCardLabel}>Total Granted</Text>
						</View>
						<Text style={styles.mainCardValue} adjustsFontSizeToFit numberOfLines={1}>
							{currencySymbol}{formatNumber(totalGranted)}
						</Text>
					</View>
				</View>
			</View>

			<View style={styles.gridContainer}>
				<View style={styles.gridItem}>
					<View style={[styles.smallIconContainer, { backgroundColor: "#D1FAE5" }]}>
						<Ionicons name="checkmark-done-circle" size={20} color="#059669" />
					</View>
					<Text style={styles.gridValue} adjustsFontSizeToFit numberOfLines={1}>
						{currencySymbol}{formatNumber(settled)}
					</Text>
					<Text style={styles.gridLabel}>Settled</Text>
				</View>

				<View style={styles.gridItem}>
					<View style={[styles.smallIconContainer, { backgroundColor: "#FEE2E2" }]}>
						<Ionicons name="alert-circle" size={20} color="#DC2626" />
					</View>
					<Text style={styles.gridValue} adjustsFontSizeToFit numberOfLines={1}>
						{currencySymbol}{formatNumber(unsettled)}
					</Text>
					<Text style={styles.gridLabel}>Unsettled</Text>
				</View>

				<View style={styles.gridItem}>
					<View style={[styles.smallIconContainer, { backgroundColor: "#FEF3C7" }]}>
						<Ionicons name="timer" size={20} color="#D97706" />
					</View>
					<Text style={styles.gridValue} adjustsFontSizeToFit numberOfLines={1}>
						{currencySymbol}{formatNumber(active)}
					</Text>
					<Text style={styles.gridLabel}>Active</Text>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 16,
		marginVertical: 10,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: "800",
		color: "#111827",
		marginBottom: 8,
		letterSpacing: -0.5,
	},
	mainCardShadow: {
		marginTop: 8,
		shadowColor: "#0D9488",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.3,
		shadowRadius: 16,
		elevation: 8,
	},
	mainCard: {
		height: 140,
		borderRadius: 24,
		overflow: "hidden",
		backgroundColor: "#0D9488",
	},
	overlay: {
		position: "absolute",
		top: 0, left: 0, right: 0, bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.4)",
	},
	mainCardContent: {
		flex: 1,
		padding: 20,
		justifyContent: "space-between",
	},
	mainCardHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	iconContainer: {
		width: 44,
		height: 44,
		borderRadius: 14,
		backgroundColor: "rgba(255, 255, 255, 0.25)",
		justifyContent: "center",
		alignItems: "center",
	},
	mainCardLabel: {
		fontSize: 16,
		color: "#CCFBF1",
		fontWeight: "600",
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	mainCardValue: {
		fontSize: 42,
		fontWeight: "800",
		color: "#FFFFFF",
		includeFontPadding: false,
	},
	gridContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 12,
		marginTop: 16,
	},
	gridItem: {
		flex: 1,
		backgroundColor: "#FFFFFF",
		borderRadius: 20,
		padding: 16,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.05,
		shadowRadius: 12,
		elevation: 2,
		borderWidth: 1,
		borderColor: "#F3F4F6",
	},
	smallIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 12,
	},
	gridValue: {
		fontSize: 20,
		fontWeight: "800",
		color: "#111827",
		marginBottom: 4,
	},
	gridLabel: {
		fontSize: 11,
		color: "#6B7280",
		fontWeight: "700",
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
});
