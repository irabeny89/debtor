import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DebtorCard from "@/components/debtor/debtor-card";
import Tabs, { TabItem } from "@/components/tabs";
import Pagination from "@/components/pagination";
import useDebtorList from "@/hooks/use-debtor-list";
import { DebtorT } from "@/types";
import usePagination from "@/hooks/use-pagination";
import SearchInput from "@/components/search-input";
import { Ionicons } from "@expo/vector-icons";

const renderDebtor = ({ item }: { item: DebtorT }) => <DebtorCard data={item} />

export default function DebtorScreen() {
	const debtors = useDebtorList();
	const [search, setSearch] = useState("");
	const [activeTab, setActiveTab] = useState("All");

	const filterDebtors = () => {
		let filtered = debtors;

		if (activeTab !== "All") {
			filtered = filtered.filter((debtor) => debtor.status === activeTab);
		}

		if (search.trim()) {
			const query = search.toLowerCase().trim();
			filtered = filtered.filter((debtor) =>
				debtor.firstName.toLowerCase().includes(query) ||
				debtor.lastName.toLowerCase().includes(query) ||
				debtor.phone.includes(query) ||
				debtor.workPlace.toLowerCase().includes(query)
			);
		}

		return filtered;
	};

	const filteredDebtors = filterDebtors();
	const { paginatedData, currentPage, totalPages, setCurrentPage } = usePagination({
		itemsPerPage: 5,
		list: filteredDebtors,
		dependencies: [search, activeTab]
	})

	return (
		<View style={styles.container}>
			<SearchInput
				containerStyle={styles.searchContainer}
				placeholder="Find debtor"
				onChange={setSearch}
				text={search}
			/>
			{!filteredDebtors.length ? (
				<Text style={styles.noItemText}>You have not added any debtor</Text>
			) : (
				<View style={{ flex: 1 }}>
					<Tabs>
						<TabItem label="All" onPress={() => setActiveTab("All")} isActive={activeTab === "All"} />
						<TabItem label="Active" onPress={() => setActiveTab("Active")} isActive={activeTab === "Active"} />
						<TabItem label="Inactive" onPress={() => setActiveTab("Inactive")} isActive={activeTab === "Inactive"} />
						<TabItem label="Suspended" onPress={() => setActiveTab("Suspended")} isActive={activeTab === "Suspended"} />
					</Tabs>
					<FlatList
						data={paginatedData}
						renderItem={renderDebtor}
						keyExtractor={item => item.id}
						contentContainerStyle={styles.listContainer}
						ListFooterComponent={<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
					/>
					<TouchableOpacity style={styles.floatingAdd}>
						<Ionicons name="add" size={24} color="#FFFFFF" />
					</TouchableOpacity>
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
		paddingBottom: 130,
	},
	searchContainer: {
		paddingVertical: 0,
	},
	floatingAdd: {
		position: "absolute",
		bottom: 160,
		right: 20,
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: "#4F46E5",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 100,
		elevation: 10,
		shadowColor: "#4F46E5",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.15,
		shadowRadius: 20,
	}
});
