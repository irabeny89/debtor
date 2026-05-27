import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  exportDataToJson,
  exportDebtorsToCsvFile,
  exportLoansToCsvFile,
  importFromFile,
  shareDebtorsTemplateCsv,
  shareLoansTemplateCsv,
  shareJsonTemplate,
} from "@/utils/file-transfer";
import { DebtorT, LoanT } from "@/types";

type Props = {
  debtors: DebtorT[]
  loans: LoanT[]
  importDebtors: (debtors: DebtorT[], replace: boolean) => void
  importLoans: (loans: LoanT[], replace: boolean) => void
  restoreDatabase: (debtors: DebtorT[], loans: LoanT[]) => void
}
export default function ImportAndExport({ debtors, loans, importDebtors, importLoans, restoreDatabase }: Props) {
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

  const handleDownloadDebtorsTemplate = async () => {
    try {
      await shareDebtorsTemplateCsv();
    } catch (error) {
      Alert.alert("Download Failed", "Could not download debtors CSV template.");
    }
  };

  const handleDownloadLoansTemplate = async () => {
    try {
      await shareLoansTemplateCsv();
    } catch (error) {
      Alert.alert("Download Failed", "Could not download loans CSV template.");
    }
  };

  const handleDownloadJsonTemplate = async () => {
    try {
      await shareJsonTemplate();
    } catch (error) {
      Alert.alert("Download Failed", "Could not download JSON backup template.");
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

      {/* Import Templates */}
      <Text style={styles.subHeader}>Import Templates</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.templateButton]}
          onPress={handleDownloadJsonTemplate}
        >
          <Ionicons name="download-outline" size={16} color="#4F46E5" style={styles.buttonIcon} />
          <Text style={styles.templateButtonText}>JSON Backup</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.templateButton]}
          onPress={handleDownloadDebtorsTemplate}
        >
          <Ionicons name="download-outline" size={16} color="#4F46E5" style={styles.buttonIcon} />
          <Text style={styles.templateButtonText}>Debtors CSV</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.templateButton]}
          onPress={handleDownloadLoansTemplate}
        >
          <Ionicons name="download-outline" size={16} color="#4F46E5" style={styles.buttonIcon} />
          <Text style={styles.templateButtonText}>Loans CSV</Text>
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
  templateButton: {
    backgroundColor: "#EEF2FF",
    borderWidth: 1.5,
    borderColor: "#C7D2FE",
  },
  templateButtonText: {
    color: "#4F46E5",
    fontSize: 12,
    fontWeight: "700",
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
})