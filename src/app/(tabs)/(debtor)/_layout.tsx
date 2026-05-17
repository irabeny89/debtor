import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import ScreenHeader from "@/components/screen-header";

export default function DebtorLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => (
            <ScreenHeader style={{ justifyContent: "space-between" }}>
              <ScreenHeader.Title title="Debtors" />
              <TouchableOpacity style={styles.addButton} onPress={() => router.push("/(tabs)/(debtor)/add")}>
                <Ionicons name="add" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </ScreenHeader>
          )
        }}
      />
      <Stack.Screen
        name="detail"
        options={{
          header: () => (
            <ScreenHeader>
              <ScreenHeader.BackIcon />
              <ScreenHeader.Title title="Debtor Details" />
            </ScreenHeader>
          )
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          header: () => (
            <ScreenHeader>
              <ScreenHeader.BackIcon />
              <ScreenHeader.Title title="Add Debtor" />
            </ScreenHeader>
          )
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          header: () => (
            <ScreenHeader>
              <ScreenHeader.BackIcon />
              <ScreenHeader.Title title="Edit Debtor" />
            </ScreenHeader>
          )
        }}
      />
    </Stack>
  )
}

const styles = StyleSheet.create({
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  }
})