import FaIcons from "@expo/vector-icons/FontAwesome";
import IonIcons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

export default function RootLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: styles.tabBarStyle,
				tabBarItemStyle: styles.tabBarItemStyle,
				tabBarLabelStyle: styles.tabBarLabelStyle,
				tabBarIconStyle: styles.tabBarIconStyle,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: () => <FaIcons name="home" size={24} color="black" />,
				}}
			/>
			<Tabs.Screen
				name="debtor"
				options={{
					title: "Debtor",
					tabBarIcon: () => <IonIcons name="person" size={24} color="black" />,
				}}
			/>
			<Tabs.Screen
				name="loan"
				options={{
					title: "Loan",
					tabBarIcon: () => (
						<FaIcons name="dollar" size={24} color="black" />
					),
				}}
			/>
			<Tabs.Screen
				name="setting"
				options={{
					title: "Setting",
					tabBarIcon: () => <FaIcons name="cog" size={24} color="black" />,
				}}
			/>
		</Tabs>
	);
}

const styles = StyleSheet.create({
	tabBarStyle: {
		position: "absolute",
		bottom: 20,
		marginHorizontal: 10,
		borderRadius: 40,
		height: 75,
		width: "95%",
		elevation: 5,
		// Optional: Add shadow for floating effect
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 5,
	},
	tabBarItemStyle: {
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
	},
	tabBarLabelStyle: {
		fontSize: 12,
		marginBottom: 8,
	},
	tabBarIconStyle: {
		marginTop: 8,
	},
});
