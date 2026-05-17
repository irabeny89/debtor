import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LoanT } from "../../types";

type Props = {
  loan: LoanT
}
export default function LoanPreference({ loan }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.settingsCard}>
        <View style={styles.settingsRow}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIconBox, { backgroundColor: "#EEF2FF" }]}>
              <Ionicons name="notifications" size={20} color="#4F46E5" />
            </View>
            <Text style={styles.settingLabel}>Notifications</Text>
          </View>
          <Text style={styles.settingValue}>{loan.notifyOnDue ? "Enabled" : "Disabled"}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.settingsRow}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIconBox, { backgroundColor: "#FDF4FF" }]}>
              <Ionicons name="calendar" size={20} color="#C026D3" />
            </View>
            <Text style={styles.settingLabel}>Late Fee Cycle</Text>
          </View>
          <Text style={styles.settingValue}>{loan.lateFeeCycle} Days</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    marginLeft: 4,
  },
  breakdownCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  breakdownLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 12,
  },
  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  settingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  settingValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
  },
})