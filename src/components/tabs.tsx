import type { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type TabsProps = {
	children: ReactNode;
};

type TabItemProps = {
	label: string;
	onPress: () => void;
	isActive?: boolean;
};

export function TabItem({ isActive = false, label, onPress }: TabItemProps) {
	return (
		<TouchableOpacity
			onPress={onPress}
			activeOpacity={0.5}
			style={styles.tabItemContainer}
		>
			<Text style={[styles.tabLabel, isActive && styles.tabItemActive]}>
				{label}
			</Text>
			{isActive ? <View style={styles.tabBarUnderline} /> : null}
		</TouchableOpacity>
	);
}

export default function Tabs({ children }: TabsProps) {
	return (
		<ScrollView style={styles.tabsContainer} horizontal>
			{children}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	tabsContainer: {
		flexDirection: "row",
		gap: 20,
		paddingBottom: 20,
		paddingLeft: 10,
		marginTop: 30,
	},
	tabLabel: {
		paddingHorizontal: 15,
		borderRadius: 20,
		overflow: "hidden",
		fontSize: 14,
		fontWeight: "bold",
		color: "grey",
	},
	tabItemContainer: {
		gap: 5,
		paddingHorizontal: 10
	},
	tabItemActive: {
		color: "black",
	},
	tabBarUnderline: {
		width: "40%",
		height: 2,
		backgroundColor: "black",
		alignSelf: "center"
	}
});
