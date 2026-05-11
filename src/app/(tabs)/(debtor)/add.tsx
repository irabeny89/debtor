import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from "react-native";

export default function AddDebtorScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [workPlace, setWorkPlace] = useState("");
  const [gender, setGender] = useState<"m" | "f">("m");

  const handleSave = () => {
    // Basic validation
    if (!firstName || !lastName || !phone) return;

    // In a real app, dispatch to store or make API call here

    // Go back to the previous screen
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>

        <View style={styles.headerInfo}>
          <View style={styles.iconCircle}>
            <Ionicons name="person-add" size={32} color="#4F46E5" />
          </View>
          <Text style={styles.headerSubtitle}>Enter the debtor's details below to add them to your record.</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>First Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. John"
              placeholderTextColor="#9CA3AF"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Last Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. Doe"
              placeholderTextColor="#9CA3AF"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[styles.genderButton, gender === "m" && styles.genderButtonActive]}
              onPress={() => setGender("m")}
            >
              <Ionicons name="male" size={20} color={gender === "m" ? "#FFFFFF" : "#6B7280"} />
              <Text style={[styles.genderText, gender === "m" && styles.genderTextActive]}>Male</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.genderButton, gender === "f" && styles.genderButtonActive]}
              onPress={() => setGender("f")}
            >
              <Ionicons name="female" size={20} color={gender === "f" ? "#FFFFFF" : "#6B7280"} />
              <Text style={[styles.genderText, gender === "f" && styles.genderTextActive]}>Female</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. 08012345678"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Workplace / Address</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="briefcase-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. Acme Corp, Lagos"
              placeholderTextColor="#9CA3AF"
              value={workPlace}
              onChangeText={setWorkPlace}
            />
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, (!firstName || !lastName || !phone) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!firstName || !lastName || !phone}
        >
          <Text style={styles.saveButtonText}>Save Debtor</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  headerInfo: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    height: "100%",
  },
  genderContainer: {
    flexDirection: "row",
    gap: 12,
  },
  genderButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    gap: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  genderButtonActive: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  genderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  genderTextActive: {
    color: "#FFFFFF",
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 110 : 100, // Clearance for absolute tab bar
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  saveButton: {
    backgroundColor: "#4F46E5",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
