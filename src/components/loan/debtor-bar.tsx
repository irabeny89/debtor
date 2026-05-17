import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DebtorT } from "@/types";

type Props = {
  debtor: DebtorT;
}

export default function DebtorBar({ debtor }: Props) {
  const initials = (debtor.firstName?.[0] || "") + (debtor.lastName?.[0] || "")
  return (
    <TouchableOpacity 
        style={styles.debtorCard}
        onPress={() => router.push({ pathname: "/(tabs)/(debtor)/detail", params: { id: debtor.id } })}
      >
        <View style={styles.debtorLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View>
            <Text style={styles.debtorName}>{debtor.firstName} {debtor.lastName}</Text>
            <Text style={styles.debtorPhone}>{debtor.phone}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  debtorCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  debtorLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4F46E5",
  },
  debtorName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  debtorPhone: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
})