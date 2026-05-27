import React, { useState } from "react";
import { View, TouchableOpacity, ActivityIndicator, Text, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DebtorT, LoanT } from "@/types";
import {
  documentDirectory,
  writeAsStringAsync,
  readAsStringAsync,
  EncodingType,
} from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

type Props = {
  debtors: DebtorT[]
  loans: LoanT[]
  clearDatabase: () => void
  seedDatabase: () => void
  restoreDatabase: (debtors: any[], loans: any[]) => void
}
export default function BackupAndRestore({
  debtors,
  loans,
  clearDatabase,
  seedDatabase,
  restoreDatabase
}: Props) {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [lastBackup, setLastBackup] = useState<string>("Never");

  const handleBackup = async () => {
    setIsBackingUp(true);
    setTimeout(async () => {
      try {
        const backupData = {
          debtors: debtors,
          loans: loans,
          backedUpAt: new Date().toISOString(),
        };
        const fileUri = `${documentDirectory}local_backup.json`;
        await writeAsStringAsync(fileUri, JSON.stringify(backupData, null, 2), {
          encoding: EncodingType.UTF8,
        });

        const dateString = new Date().toLocaleDateString();
        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastBackup(`${dateString} at ${timeString}`);
        setIsBackingUp(false);

        Alert.alert(
          "Backup Successful",
          "Your data has been successfully saved to your local device storage.",
          [
            {
              text: "Share File",
              onPress: async () => {
                try {
                  if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(fileUri, { mimeType: "application/json", dialogTitle: "Share Local Backup" });
                  } else {
                    Alert.alert("Error", "Sharing is not available.");
                  }
                } catch (error) {
                  console.log("Error sharing local backup", error);
                }
              },
            },
            { text: "OK", style: "default" },
          ]
        );
      } catch (error) {
        setIsBackingUp(false);
        Alert.alert("Backup Failed", "Failed to write local backup file.");
        console.error(error);
      }
    }, 1000);
  };

  const handleRestore = () => {
    Alert.alert(
      "Restore Data",
      "Are you sure you want to restore your data? This will overwrite your current database with your last local backup.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Restore",
          style: "destructive",
          onPress: () => {
            setIsRestoring(true);
            setTimeout(async () => {
              try {
                const fileUri = `${documentDirectory}local_backup.json`;
                const fileContent = await readAsStringAsync(fileUri, {
                  encoding: EncodingType.UTF8,
                });
                const parsed = JSON.parse(fileContent);

                if (Array.isArray(parsed.debtors) && Array.isArray(parsed.loans)) {
                  // Map dates back to Date objects
                  const parsedDebtors = parsed.debtors.map((d: any) => ({
                    ...d,
                    createdAt: new Date(d.createdAt),
                    updatedAt: new Date(d.updatedAt),
                  }));
                  const parsedLoans = parsed.loans.map((l: any) => ({
                    ...l,
                    dueDate: new Date(l.dueDate),
                    settledAt: l.settledAt ? new Date(l.settledAt) : undefined,
                    createdAt: new Date(l.createdAt),
                    updatedAt: new Date(l.updatedAt),
                  }));

                  restoreDatabase(parsedDebtors, parsedLoans);
                  setIsRestoring(false);
                  Alert.alert(
                    "Restore Successful",
                    "Data has been successfully restored from your local backup."
                  );
                } else {
                  setIsRestoring(false);
                  Alert.alert("Restore Failed", "Backup file format is invalid.");
                }
              } catch (error) {
                setIsRestoring(false);
                Alert.alert(
                  "No Backup Found",
                  "Could not find a local backup file on this device. Please create a backup first."
                );
              }
            }, 1500);
          },
        },
      ]
    );
  };

  const handleClear = () => {
    Alert.alert(
      "Clear Database",
      "Are you sure you want to delete ALL debtors and loans from your SQLite database? This action is irreversible.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => {
            setIsClearing(true);
            setTimeout(() => {
              try {
                clearDatabase();
                setIsClearing(false);
                Alert.alert("Success", "All database tables have been cleared completely.");
              } catch (error) {
                setIsClearing(false);
                Alert.alert("Error", "Failed to clear database.");
                console.error(error);
              }
            }, 1000);
          },
        },
      ]
    );
  };

  const handleSeed = () => {
    Alert.alert(
      "Load Mock Data",
      "This will replace all your current data with the default mock debtors and loans. Proceed?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Load Mocks",
          style: "default",
          onPress: () => {
            setIsSeeding(true);
            setTimeout(() => {
              try {
                seedDatabase();
                setIsSeeding(false);
                Alert.alert("Success", "Database seeded with original mock data successfully!");
              } catch (error) {
                setIsSeeding(false);
                Alert.alert("Error", "Failed to seed database.");
                console.error(error);
              }
            }, 1000);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Data Management</Text>

      <View style={styles.cloudCard}>
        <View style={styles.cloudHeader}>
          <View style={styles.cloudIconContainer}>
            <Ionicons name="save-outline" size={32} color="#4F46E5" />
          </View>
          <View style={styles.cloudInfo}>
            <Text style={styles.cloudTitle}>Local Backup & Restore</Text>
            <Text style={styles.cloudSubtitle}>Save and restore your records directly on your device</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.backupMetaRow}>
          <Text style={styles.metaLabel}>Last Local Backup</Text>
          <Text style={styles.metaValue}>{lastBackup}</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.backupButton]}
          onPress={handleBackup}
          disabled={isBackingUp || isRestoring || isClearing || isSeeding}
        >
          {isBackingUp ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="cloud-upload" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText} allowFontScaling={false}>
                Back Up Now
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.restoreButton]}
          onPress={handleRestore}
          disabled={isBackingUp || isRestoring || isClearing || isSeeding}
        >
          {isRestoring ? (
            <ActivityIndicator size="small" color="#4F46E5" />
          ) : (
            <>
              <Ionicons name="cloud-download-outline" size={20} color="#4F46E5" style={styles.buttonIcon} />
              <Text style={styles.restoreText} allowFontScaling={false}>
                Restore Data
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={[styles.actionsContainer, { marginTop: 12 }]}>
        <TouchableOpacity
          style={[styles.actionButton, styles.seedButton]}
          onPress={handleSeed}
          disabled={isBackingUp || isRestoring || isClearing || isSeeding}
        >
          {isSeeding ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="people" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText} allowFontScaling={false}>
                Load Mock Data
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.clearButton]}
          onPress={handleClear}
          disabled={isBackingUp || isRestoring || isClearing || isSeeding}
        >
          {isClearing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText} allowFontScaling={false}>
                Clear All Data
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
    paddingLeft: 4,
  },
  cloudCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  cloudHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  cloudIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  cloudInfo: {
    flex: 1,
  },
  cloudTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  cloudSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 16,
  },
  backupMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  metaValue: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "600",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  backupButton: {
    backgroundColor: "#4F46E5",
  },
  restoreButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#EEF2FF",
  },
  seedButton: {
    backgroundColor: "#10B981",
  },
  clearButton: {
    backgroundColor: "#EF4444",
  },
  subHeader: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    marginTop: 16,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  exportJsonButton: {
    backgroundColor: "#6366F1",
  },
  exportCsvButton: {
    backgroundColor: "#4B5563",
  },
  importFileButton: {
    width: "100%",
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#4F46E5",
    backgroundColor: "#F5F3FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  importFileText: {
    color: "#4F46E5",
    fontSize: 14,
    fontWeight: "700",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  restoreText: {
    color: "#4F46E5",
    fontSize: 12,
    fontWeight: "700",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
})