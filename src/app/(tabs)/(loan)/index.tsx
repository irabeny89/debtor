import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchInput from "@/components/search-input";
import Tabs, { TabItem } from "@/components/tabs";
import Pagination from "@/components/pagination";
import useLoanList from "@/hooks/use-loan-list";
import useDebtorList from "@/hooks/use-debtor-list";
import usePagination from "@/hooks/use-pagination";
import { LoanT } from "@/types";
import LoanCard from "@/components/loan/loan-card";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoanScreen() {
  const loans = useLoanList();
  const debtors = useDebtorList();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const getDebtorName = (debtorId: number) => {
    const debtor = debtors.find(d => d.id === debtorId);
    return debtor ? `${debtor.firstName} ${debtor.lastName}` : "Unknown Debtor";
  };

  const filterLoans = () => {
    let filtered = loans;

    if (activeTab !== "All") {
      filtered = filtered.filter(loan => loan.status === activeTab.toLowerCase());
    }

    if (search.trim()) {
      const query = search.toLowerCase().trim();
      filtered = filtered.filter(loan => {
        const debtorName = getDebtorName(loan.debtorId).toLowerCase();
        return debtorName.includes(query) || loan.amount.toString().includes(query);
      });
    }

    return filtered;
  };

  const filteredLoans = filterLoans();
  const { paginatedData, currentPage, totalPages, setCurrentPage } = usePagination({
    itemsPerPage: 10,
    list: filteredLoans,
    dependencies: [search, activeTab]
  });

  const renderLoanItem = ({ item: loan }: { item: LoanT }) => (
    <LoanCard {...loan} debtorName={getDebtorName(loan.debtorId)} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <SearchInput
        containerStyle={styles.searchContainer}
        placeholder="Find loan by debtor"
        onChange={setSearch}
        text={search}
      />
      <Tabs>
        <TabItem label="All" onPress={() => setActiveTab("All")} isActive={activeTab === "All"} />
        <TabItem label="Granted" onPress={() => setActiveTab("Granted")} isActive={activeTab === "Granted"} />
        <TabItem label="Overdue" onPress={() => setActiveTab("Overdue")} isActive={activeTab === "Overdue"} />
        <TabItem label="Settled" onPress={() => setActiveTab("Settled")} isActive={activeTab === "Settled"} />
      </Tabs>

      {!filteredLoans.length ? (
        <View style={styles.emptyState}>
          <Ionicons name="wallet-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyStateText}>No loans found</Text>
        </View>
      ) : (
        <FlatList
          data={paginatedData}
          renderItem={renderLoanItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    paddingBottom: 200
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  searchContainer: {
    paddingVertical: 0,
  },
  listContainer: {
    gap: 10,
    marginTop: 20,
    paddingBottom: 130,
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "50%",
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
});