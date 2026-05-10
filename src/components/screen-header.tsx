import { router } from "expo-router";
import React, { ReactNode } from "react";
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  children: ReactNode
  style?: ViewStyle
}

export default function ScreenHeader({ children, style }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[{ paddingTop: insets.top + 20 }, styles.screenHeader, style]}>
      {children}
    </View>
  );
}

ScreenHeader.BackIcon = () => (
  <TouchableOpacity onPress={() => router.back()}>
    <Ionicons name="arrow-back" size={24} color="#111827" />
  </TouchableOpacity>
)

ScreenHeader.Title = ({ title }: { title: string }) => (
  <Text style={styles.title}>
    {title}
  </Text>
)

const styles = StyleSheet.create({
  screenHeader: {
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827'
  }
})