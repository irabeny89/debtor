import { LoanT } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
  loan: LoanT
}

export default function ActionButtons({ loan }: Props) {
  const isSettled = loan.status === "settled";
  return (
    <View style={styles.actionContainer}>
      {!isSettled && (
        <TouchableOpacity style={styles.primaryAction}>
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          <Text style={styles.primaryActionText}>Mark as Settled</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.secondaryAction}
        onPress={() => router.push(`/(tabs)/(loan)/edit?id=${loan.id}`)}
      >
        <Ionicons name="pencil" size={20} color="#4B5563" />
        <Text style={styles.secondaryActionText}>Edit Loan Details</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  actionContainer: {
    gap: 12,
    marginTop: 8,
  },
  primaryAction: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 16,
    gap: 8,
    elevation: 4,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryAction: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  secondaryActionText: {
    color: "#4B5563",
    fontSize: 16,
    fontWeight: "600",
  },
})