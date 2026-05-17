import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDatabase } from "@/context/database-context";
import {
  documentDirectory,
  writeAsStringAsync,
  readAsStringAsync,
  EncodingType,
} from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import {
  exportDataToJson,
  exportDebtorsToCsvFile,
  exportLoansToCsvFile,
  importFromFile,
} from "@/utils/file-transfer";

export default function SettingsScreen() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [lastBackup, setLastBackup] = useState<string>("Never");
  const {
    debtors,
    loans,
    restoreDatabase,
    clearDatabase,
    seedDatabase,
    importDebtors,
    importLoans
  } = useDatabase();

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

  const handleExportJson = async () => {
    try {
      await exportDataToJson(debtors, loans);
    } catch (error) {
      Alert.alert("Export Failed", "Could not export database to JSON backup.");
    }
  };

  const handleExportDebtorsCsv = async () => {
    try {
      await exportDebtorsToCsvFile(debtors);
    } catch (error) {
      Alert.alert("Export Failed", "Could not export debtors to CSV.");
    }
  };

  const handleExportLoansCsv = async () => {
    try {
      await exportLoansToCsvFile(loans);
    } catch (error) {
      Alert.alert("Export Failed", "Could not export loans to CSV.");
    }
  };

  const handleImportFile = async () => {
    const importResult = await importFromFile();
    if (!importResult) return;

    const { type, debtors: importedDebtors, loans: importedLoans } = importResult;

    if (type === "json" && importedDebtors && importedLoans) {
      Alert.alert(
        "Import JSON Backup",
        `This will completely wipe your database and restore ${importedDebtors.length} debtors and ${importedLoans.length} loans from your backup file. Proceed?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Restore Backup",
            style: "destructive",
            onPress: () => {
              restoreDatabase(importedDebtors, importedLoans);
              Alert.alert("Import Successful", "JSON backup data restored successfully!");
            }
          }
        ]
      );
    } else if (type === "debtors-csv" && importedDebtors) {
      Alert.alert(
        "Import Debtors CSV",
        `Found ${importedDebtors.length} debtors. How would you like to import them?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Append",
            onPress: () => {
              importDebtors(importedDebtors, false);
              Alert.alert("Import Successful", `Appended ${importedDebtors.length} debtors.`);
            }
          },
          {
            text: "Overwrite",
            style: "destructive",
            onPress: () => {
              importDebtors(importedDebtors, true);
              Alert.alert("Import Successful", `Replaced database with ${importedDebtors.length} debtors.`);
            }
          }
        ]
      );
    } else if (type === "loans-csv" && importedLoans) {
      Alert.alert(
        "Import Loans CSV",
        `Found ${importedLoans.length} loans. How would you like to import them?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Append",
            onPress: () => {
              importLoans(importedLoans, false);
              Alert.alert("Import Successful", `Appended ${importedLoans.length} loans.`);
            }
          },
          {
            text: "Overwrite",
            style: "destructive",
            onPress: () => {
              importLoans(importedLoans, true);
              Alert.alert("Import Successful", `Replaced database with ${importedLoans.length} loans.`);
            }
          }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Backup & Restore Section */}
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
                  <Text style={styles.buttonText}>Back Up Now</Text>
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
                  <Text style={styles.restoreText}>Restore Data</Text>
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
                  <Text style={styles.buttonText}>Load Mock Data</Text>
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
                  <Text style={styles.buttonText}>Clear All Data</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* File Exchange Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>File Import & Export</Text>

          <View style={styles.cloudCard}>
            <View style={styles.cloudHeader}>
              <View style={[styles.cloudIconContainer, { backgroundColor: "#F3F4F6" }]}>
                <Ionicons name="document-text-outline" size={26} color="#4B5563" />
              </View>
              <View style={styles.cloudInfo}>
                <Text style={styles.cloudTitle}>Offline File Exchange</Text>
                <Text style={styles.cloudSubtitle}>Import or export your records in CSV or JSON files</Text>
              </View>
            </View>
          </View>

          {/* Export Actions */}
          <Text style={styles.subHeader}>Export Data</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.exportJsonButton]}
              onPress={handleExportJson}
            >
              <Ionicons name="share-social-outline" size={16} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>JSON Backup</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.exportCsvButton]}
              onPress={handleExportDebtorsCsv}
            >
              <Ionicons name="people-outline" size={16} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Debtors CSV</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.exportCsvButton]}
              onPress={handleExportLoansCsv}
            >
              <Ionicons name="wallet-outline" size={16} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Loans CSV</Text>
            </TouchableOpacity>
          </View>

          {/* Import Action */}
          <Text style={styles.subHeader}>Import Data</Text>
          <TouchableOpacity
            style={styles.importFileButton}
            onPress={handleImportFile}
          >
            <Ionicons name="document-attach-outline" size={20} color="#4F46E5" style={styles.buttonIcon} />
            <Text style={styles.importFileText}>Choose File (JSON / CSV)</Text>
          </TouchableOpacity>
        </View>

        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>General Settings</Text>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: "#EEF2FF" }]}>
                <Ionicons name="cash-outline" size={20} color="#4F46E5" />
              </View>
              <Text style={styles.settingLabel}>Default Currency</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>NGN (₦)</Text>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: "#ECFDF5" }]}>
                <Ionicons name="notifications-outline" size={20} color="#10B981" />
              </View>
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>Enabled</Text>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: "#FEF2F2" }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#EF4444" />
              </View>
              <Text style={styles.settingLabel}>Security & Privacy</Text>
            </View>
            <View style={styles.settingRight}>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Support</Text>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: "#FFFBEB" }]}>
                <Ionicons name="help-circle-outline" size={20} color="#F59E0B" />
              </View>
              <Text style={styles.settingLabel}>Help & FAQs</Text>
            </View>
            <View style={styles.settingRight}>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: "#F5F3FF" }]}>
                <Ionicons name="star-outline" size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.settingLabel}>Rate the App</Text>
            </View>
            <View style={styles.settingRight}>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Debtor Tracker Mobile v1.0.0</Text>
          <Text style={styles.footerSubText}>Safeguarding your records with premium care.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
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
    fontSize: 14,
    fontWeight: "700",
  },
  restoreText: {
    color: "#4F46E5",
    fontSize: 14,
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
  settingLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  footerContainer: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  footerSubText: {
    fontSize: 10,
    color: "#BDC3C7",
    marginTop: 4,
  },
});
