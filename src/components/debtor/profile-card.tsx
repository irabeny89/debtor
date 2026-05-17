import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  id: number;
  firstName: string;
  lastName: string;
  status: string;
  gender: string;
  phone: string;
  workPlace: string;
}

export default function ProfileCard({
  id,
  firstName,
  lastName,
  status,
  gender,
  phone,
  workPlace
}: Props) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
  return (
    <View style={styles.profileCard}>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push(`/(tabs)/(debtor)/edit?id=${id}`)}
      >
        <Ionicons name="pencil" size={18} color="#4F46E5" />
      </TouchableOpacity>

      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{initials}</Text>
        <View style={[
          styles.statusIndicator,
          { backgroundColor: status === "Active" ? "#10B981" : status === "Suspended" ? "#EF4444" : "#9CA3AF" }
        ]} />
      </View>
      <Text style={styles.nameText}>{firstName} {lastName}</Text>

      <View style={styles.badgeContainer}>
        <View style={[styles.badge, { backgroundColor: status === "Active" ? "#D1FAE5" : status === "Suspended" ? "#FEE2E2" : "#F3F4F6" }]}>
          <Text style={[styles.badgeText, { color: status === "Active" ? "#065F46" : status === "Suspended" ? "#991B1B" : "#374151" }]}>
            {status}
          </Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name={gender === "m" ? "male" : "female"} size={12} color="#4F46E5" />
          <Text style={[styles.badgeText, { color: "#4F46E5", marginLeft: 4 }]}>
            {gender === "m" ? "Male" : "Female"}
          </Text>
        </View>
      </View>

      <View style={styles.contactInfo}>
        <View style={styles.infoRow}>
          <View style={styles.iconBox}>
            <Ionicons name="call" size={16} color="#4F46E5" />
          </View>
          <Text style={styles.infoText}>{phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.iconBox}>
            <Ionicons name="briefcase" size={16} color="#4F46E5" />
          </View>
          <Text style={styles.infoText}>{workPlace}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    marginBottom: 24,
  },
  editButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#4F46E5",
  },
  statusIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  contactInfo: {
    width: "100%",
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 16,
    gap: 12,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "500",
    flex: 1,
  },
})