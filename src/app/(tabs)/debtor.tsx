import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import DebtorCard from "@/components/debtor/debtor-card";
import SearchAndAdd from "@/components/debtor/search-and-add";
import Tabs, { TabItem } from "@/components/tabs";
import useDebtorList from "@/hooks/use-debtor-list";
import { DebtorT } from "@/types";

const renderDebtor = ({ item }: { item: DebtorT }) => <DebtorCard data={item} />

export default function DebtorScreen() {
	const debtors = useDebtorList();
	const [search, setSearch] = useState("");
	const [activeTab, setActiveTab] = useState("All");
	const filterDebtorsByTab = () => {
		switch (activeTab) {
			case "Active":
				return debtors.filter((debtor) => debtor.status === "Active");
			case "Inactive":
				return debtors.filter((debtor) => debtor.status === "Inactive");
			case "Suspended":
				return debtors.filter((debtor) => debtor.status === "Suspended");
			default:
				return debtors;
		}
	};

	const filteredDebtors = filterDebtorsByTab();

	return (
		<View style={styles.container}>
			<SearchAndAdd onChange={setSearch} text={search} />
			{!filteredDebtors.length ? (
				<Text style={styles.noItemText}>You have not added any debtor</Text>
			) : (
				<View>
					<Tabs>
						<TabItem label="All" onPress={() => setActiveTab("All")} isActive={activeTab === "All"} />
						<TabItem label="Active" onPress={() => setActiveTab("Active")} isActive={activeTab === "Active"} />
						<TabItem label="Inactive" onPress={() => setActiveTab("Inactive")} isActive={activeTab === "Inactive"} />
						<TabItem label="Suspended" onPress={() => setActiveTab("Suspended")} isActive={activeTab === "Suspended"} />
					</Tabs>
					<FlatList
						data={filteredDebtors}
						renderItem={renderDebtor}
						keyExtractor={item => item.id}
						contentContainerStyle={styles.listContainer}
					/>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 10,
		paddingVertical: 20,
	},
	noItemText: {
		marginTop: "60%",
		marginLeft: "25%",
	},
	listContainer: {
		gap: 15,
		marginTop: 20,
		paddingBottom: 50,
	}
});
