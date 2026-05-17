import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Support() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Support</Text>

      <TouchableOpacity style={styles.settingRow}>
        <View style={styles.settingLeft}>
          <View style={[styles.iconBox, { backgroundColor: "#FFFBEB" }]}>
            <Ionicons name="help-circle-outline" size={20} color="#F59E0B" />
          </View>
          <Text style={styles.settingLabel}>Help & FAQs</Text>
        </View>
        <View style={styles.settingRight}>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingRow}>
        <View style={styles.settingLeft}>
          <View style={[styles.iconBox, { backgroundColor: "#F5F3FF" }]}>
            <Ionicons name="star-outline" size={20} color="#8B5CF6" />
          </View>
          <Text style={styles.settingLabel}>Rate the App</Text>
        </View>
        <View style={styles.settingRight}>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
    paddingLeft: 4,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
})