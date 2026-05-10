import { Stack } from "expo-router";
import ScreenHeader from "@/components/screen-header";
import { TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function DebtorLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => (
            <ScreenHeader style={{ justifyContent: "space-between" }}>
              <ScreenHeader.Title title="Debtors" />
              <TouchableOpacity style={{
                width: 40,
                height: 40,
                borderRadius: 30,
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
              }}>
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
    </Stack>
  )
}