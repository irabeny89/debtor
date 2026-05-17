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
