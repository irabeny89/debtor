import { StyleSheet } from "react-native";
import { Stack } from "expo-router";
import ScreenHeader from "@/components/screen-header";

export default function SettingLayout() {

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => (
            <ScreenHeader style={{ justifyContent: "space-between" }}>
              <ScreenHeader.Title title="Setting" />
            </ScreenHeader>
          )
        }}
      />
      <Stack.Screen
        name="backup"
        options={{
          header: () => (
            <ScreenHeader>
              <ScreenHeader.BackIcon />
              <ScreenHeader.Title title="Backup" />
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