import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import ScreenHeader from "@/components/screen-header";

export default function LoanLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => (
            <ScreenHeader style={{ justifyContent: "space-between" }}>
              <ScreenHeader.Title title="Loans" />
              <TouchableOpacity style={styles.addButton} onPress={() => router.push("/(tabs)/(loan)/add")}>
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
              <ScreenHeader.Title title="Loan Details" />
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
              <ScreenHeader.Title title="Add Loan" />
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