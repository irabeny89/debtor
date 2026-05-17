import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, Switch } from "react-native";
import useDebtorList from "@/hooks/use-debtor-list";
import useSettingData from "@/hooks/use-setting-data";
import { getCurrencySymbol } from "@/utils";
import { DebtorT } from "@/types";

export type LoanFormData = {
  selectedDebtor: string;
  amount: string;
  interest: string;
  duration: string;
  lateFee: string;
  notify: boolean;
};

type LoanFormProps = {
  initialValues?: Partial<LoanFormData>;
  onSubmit: (data: LoanFormData) => void;
  submitButtonText: string;
  updatedAt?: Date;
};

const renderDebtor = (selectedDebtor: string, setSelectedDebtor: (id: string) => void) => (debtor: DebtorT) => {
  const isActive = selectedDebtor === debtor.id;
  return (
    <TouchableOpacity
      key={debtor.id}
      style={[styles.debtorBubble, isActive && styles.debtorBubbleActive]}
      onPress={() => setSelectedDebtor(debtor.id)}
    >
      <View style={[styles.debtorAvatar, isActive && styles.debtorAvatarActive]}>
        <Text style={[styles.debtorAvatarText, isActive && styles.debtorAvatarTextActive]}>
          {(debtor.firstName?.[0] || "") + (debtor.lastName?.[0] || "")}
        </Text>
      </View>
      <Text style={[styles.debtorName, isActive && styles.debtorNameActive]}>
        {debtor.firstName}
      </Text>
    </TouchableOpacity>
  );
}

export default function LoanForm({
  initialValues,
  onSubmit,
  submitButtonText,
  updatedAt,
}: LoanFormProps) {
  const debtors = useDebtorList();
  const { currencyCode } = useSettingData();
  const currencySymbol = getCurrencySymbol(currencyCode);

  const [selectedDebtor, setSelectedDebtor] = useState(initialValues?.selectedDebtor || "");
  const [amount, setAmount] = useState(initialValues?.amount || "");
  const [interest, setInterest] = useState(initialValues?.interest || "");
  const [duration, setDuration] = useState(initialValues?.duration || "");
  const [lateFee, setLateFee] = useState(initialValues?.lateFee || "");
  const [notify, setNotify] = useState<boolean>(initialValues?.notify ?? true);

  useEffect(() => {
    if (initialValues) {
      if (initialValues.selectedDebtor !== undefined) setSelectedDebtor(initialValues.selectedDebtor);
      if (initialValues.amount !== undefined) setAmount(initialValues.amount);
      if (initialValues.interest !== undefined) setInterest(initialValues.interest);
      if (initialValues.duration !== undefined) setDuration(initialValues.duration);
      if (initialValues.lateFee !== undefined) setLateFee(initialValues.lateFee);
      if (initialValues.notify !== undefined) setNotify(initialValues.notify);
    }
  }, [initialValues]);

  const hasValidInputs = useMemo(() => {
    return selectedDebtor && amount && duration;
  }, [selectedDebtor, amount, duration]);

  const handleSave = () => {
    if (!hasValidInputs) return;
    onSubmit({ selectedDebtor, amount, interest, duration, lateFee, notify });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>

        {/* Debtor Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Debtor</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.debtorList}>
            {debtors.map(renderDebtor(selectedDebtor, setSelectedDebtor))}
          </ScrollView>
        </View>

        {/* Amount Input */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Principal Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>{currencySymbol}</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>

        {/* Loan Details Form */}
        <View style={styles.formGrid}>
          <View style={styles.formGroupHalf}>
            <Text style={styles.label}>Interest Rate (%)</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="pie-chart-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. 15"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                value={interest}
                onChangeText={setInterest}
              />
            </View>
          </View>

          <View style={styles.formGroupHalf}>
            <Text style={styles.label}>Duration (Days)</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. 30"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                value={duration}
                onChangeText={setDuration}
              />
            </View>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Late Fee Rate (%)</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="alert-circle-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. 5"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
              value={lateFee}
              onChangeText={setLateFee}
            />
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsContainer}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconBox}>
                <Ionicons name="notifications" size={20} color="#4F46E5" />
              </View>
              <View>
                <Text style={styles.settingTitle}>Due Notifications</Text>
                <Text style={styles.settingSubtitle}>Send alerts when due date approaches</Text>
              </View>
            </View>
            <Switch
              value={notify}
              onValueChange={setNotify}
              trackColor={{ false: "#E5E7EB", true: "#4F46E5" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {updatedAt && (
          <View style={styles.lastUpdatedContainer}>
            <Ionicons name="time-outline" size={16} color="#6B7280" style={styles.lastUpdatedIcon} />
            <Text style={styles.lastUpdatedText}>
              Last updated: {new Date(updatedAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, (!hasValidInputs) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!hasValidInputs}
        >
          <Text style={styles.saveButtonText}>{submitButtonText}</Text>
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
    paddingVertical: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  debtorList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  debtorBubble: {
    alignItems: "center",
    width: 72,
    gap: 8,
  },
  debtorBubbleActive: {
    opacity: 1,
  },
  debtorAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  debtorAvatarActive: {
    borderColor: "#4F46E5",
    backgroundColor: "#EEF2FF",
  },
  debtorAvatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6B7280",
  },
  debtorAvatarTextActive: {
    color: "#4F46E5",
  },
  debtorName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
  },
  debtorNameActive: {
    color: "#4F46E5",
  },
  amountSection: {
    backgroundColor: "#4F46E5",
    marginHorizontal: 24,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    elevation: 8,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  amountLabel: {
    fontSize: 14,
    color: "#E0E7FF",
    fontWeight: "500",
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginRight: 4,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: "800",
    color: "#FFFFFF",
    minWidth: 100,
  },
  formGrid: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  formGroupHalf: {
    flex: 1,
  },
  formGroup: {
    marginBottom: 24,
    paddingHorizontal: 24,
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
  settingsContainer: {
    marginHorizontal: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  settingSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
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
  lastUpdatedContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
    gap: 6,
  },
  lastUpdatedIcon: {
    marginRight: 2,
  },
  lastUpdatedText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
});
