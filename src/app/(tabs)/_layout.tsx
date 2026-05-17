import IonIcons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { DatabaseProvider } from "@/context/database-context";

export default function RootLayout() {
	return (
		<DatabaseProvider>
			<Tabs
				screenOptions={{
					headerShown: false,
					tabBarStyle: styles.tabBarStyle,
					tabBarLabelStyle: styles.tabBarLabelStyle,
					tabBarActiveTintColor: "#4F46E5",
					tabBarInactiveTintColor: "#9CA3AF",
				}}
			>
				<Tabs.Screen
					name="index"
					options={{
						title: "Home",
						tabBarIcon: ({ focused, color }) => (
							<View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
								<IonIcons name={focused ? "home" : "home-outline"} size={22} color={color} />
							</View>
						),
					}}
				/>
				<Tabs.Screen
					name="(debtor)"
					options={{
						title: "Debtors",
						headerShown: false,
						tabBarIcon: ({ focused, color }) => (
							<View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
								<IonIcons name={focused ? "people" : "people-outline"} size={22} color={color} />
							</View>
						),
					}}
				/>
				<Tabs.Screen
					name="(loan)"
					options={{
						title: "Loans",
						headerShown: false,
						tabBarIcon: ({ focused, color }) => (
							<View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
								<IonIcons name={focused ? "wallet" : "wallet-outline"} size={22} color={color} />
							</View>
						),
					}}
				/>
				<Tabs.Screen
					name="(setting)"
					options={{
						title: "Settings",
						headerShown: false,
						tabBarIcon: ({ focused, color }) => (
							<View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
								<IonIcons name={focused ? "settings" : "settings-outline"} size={22} color={color} />
							</View>
						),
					}}
				/>
			</Tabs>
		</DatabaseProvider>
	);
}

const styles = StyleSheet.create({
	tabBarStyle: {
		position: "absolute",
		bottom: 20,
		marginHorizontal: 16,
		borderRadius: 24,
		height: 75,
		elevation: 10,
		shadowColor: "#4F46E5",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.15,
		shadowRadius: 20,
		backgroundColor: "#FFFFFF",
		borderTopWidth: 0,
		paddingBottom: 8,
		paddingTop: 8,
	},
	iconWrapper: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	activeIconWrapper: {
		backgroundColor: "#EEF2FF",
	},
	tabBarLabelStyle: {
		fontSize: 11,
		fontWeight: "600",
		marginTop: 2,
	},
});
