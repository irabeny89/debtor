import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type FaqItem = {
  id: string;
  category: "general" | "loans" | "security" | "backup";
  question: string;
  answer: string;
};

const FAQ_DATA: FaqItem[] = [
  {
    id: "g1",
    category: "general",
    question: "How do I add a new debtor?",
    answer: "Go to the Debtors tab and tap the '+' button in the top right corner. Fill in the debtor's first name, last name, phone number, work place, and other optional details, then tap 'Create Debtor' to save.",
  },
  {
    id: "g2",
    category: "general",
    question: "How do I edit debtor details?",
    answer: "Navigate to the Debtor list, select the debtor you want to modify to open their details page, and tap the 'Edit' button in the top right corner to update their information.",
  },
  {
    id: "l1",
    category: "loans",
    question: "How do I record a new loan?",
    answer: "Open a debtor's detail page, scroll to their Loan History section, and tap 'Record New Loan'. Enter the loan principal, interest rate (e.g., 10%), due date, and late fee terms, then save.",
  },
  {
    id: "l2",
    category: "loans",
    question: "How is loan interest calculated?",
    answer: "Interest is computed as a fixed percentage on the loan principal. For instance, a loan of ₦100,000 at 10% interest results in a total repayment amount of ₦110,000.",
  },
  {
    id: "l3",
    category: "loans",
    question: "What are late fee cycles?",
    answer: "Late fee cycles determine how often late fees accumulate once a loan passes its due date. You can configure them to accumulate daily, weekly, or monthly at a specified percentage or fixed rate.",
  },
  {
    id: "s1",
    category: "security",
    question: "Is my data stored securely?",
    answer: "Yes! All your records are securely stored locally inside an offline SQLite database on your device. No personal financial information or debtor records are sent to external servers without your explicit action.",
  },
  {
    id: "s2",
    category: "security",
    question: "Does this app require an active internet connection?",
    answer: "No, Debtor Tracker Mobile is built as an offline-first application. You can manage debtors, loans, calculate interest, and make backups completely offline without any internet connection.",
  },
  {
    id: "b1",
    category: "backup",
    question: "How do local backups work?",
    answer: "Under Settings > Data Management, tap 'Back Up Now'. This instantly packs all your debtors and loans into a safe 'local_backup.json' file on your device. You can also tap 'Share File' to save it to external drives, AirDrop, or email.",
  },
  {
    id: "b2",
    category: "backup",
    question: "How do I import/export CSV files?",
    answer: "Under Settings > File Import & Export, you can export your debtors or loans into standard CSV files to view in Excel or Google Sheets. You can also import CSV files to append or replace your current database records.",
  },
];

export default function HelpScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "general" | "loans" | "security" | "backup">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Search Header */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            placeholder="Search help topics & FAQs..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Category Filter Badges */}
      <View style={styles.badgeContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgeScroll}>
          {(["all", "general", "loans", "security", "backup"] as const).map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.badge,
                activeCategory === cat ? styles.badgeActive : styles.badgeInactive,
              ]}
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setActiveCategory(cat);
              }}
            >
              <Text
                style={[
                  styles.badgeText,
                  activeCategory === cat ? styles.badgeTextActive : styles.badgeTextInactive,
                ]}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* FAQ Scroll View */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <TouchableOpacity
                key={faq.id}
                style={[styles.faqCard, isExpanded && styles.faqCardExpanded]}
                onPress={() => toggleExpand(faq.id)}
                activeOpacity={0.7}
              >
                <View style={styles.faqHeader}>
                  <Text style={[styles.faqQuestion, isExpanded && styles.faqQuestionActive]}>
                    {faq.question}
                  </Text>
                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={isExpanded ? "#4F46E5" : "#9CA3AF"}
                  />
                </View>
                {isExpanded ? (
                  <View style={styles.faqAnswerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="help-circle-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>No results found</Text>
            <Text style={styles.emptyStateSubtitle}>
              Try searching with different keywords or category filters.
            </Text>
          </View>
        )}

        {/* Contact Support Section */}
        <View style={styles.supportFooter}>
          <Text style={styles.supportTitle}>Still need help?</Text>
          <Text style={styles.supportSubtitle}>
            Our visual instructions and setup assistance can help you with anything.
          </Text>
          <TouchableOpacity style={styles.supportButton}>
            <Ionicons name="mail-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.supportButtonText}>Contact support@debtorapp.com</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingBottom: 80,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: "#F9FAFB",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500",
  },
  badgeContainer: {
    paddingVertical: 10,
    backgroundColor: "#F9FAFB",
  },
  badgeScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  badgeActive: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  badgeInactive: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  badgeTextActive: {
    color: "#FFFFFF",
  },
  badgeTextInactive: {
    color: "#4B5563",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  faqCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  faqCardExpanded: {
    borderColor: "#E0E7FF",
    elevation: 4,
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
    lineHeight: 20,
  },
  faqQuestionActive: {
    color: "#4F46E5",
  },
  faqAnswerContainer: {
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginBottom: 12,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 22,
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4B5563",
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
  },
  supportFooter: {
    backgroundColor: "#EEF2FF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E1B4B",
    marginBottom: 6,
  },
  supportSubtitle: {
    fontSize: 12,
    color: "#4F46E5",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 16,
    fontWeight: "500",
  },
  supportButton: {
    backgroundColor: "#4F46E5",
    height: 46,
    borderRadius: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  supportButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
