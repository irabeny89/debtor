import { documentDirectory, writeAsStringAsync, readAsStringAsync, EncodingType } from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";
import { DebtorT, LoanT } from "@/types";

// Helper to escape CSV values
function escapeCsvValue(val: any): string {
  if (val === null || val === undefined) return "";
  let str = "";
  if (val instanceof Date) {
    str = val.toISOString();
  } else {
    str = String(val);
  }
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Convert debtors to CSV format
export function debtorsToCsv(debtors: DebtorT[]): string {
  const headers = ["id", "firstName", "lastName", "gender", "phone", "workPlace", "status", "createdAt", "updatedAt"];
  const rows = debtors.map(d => [
    d.id,
    d.firstName,
    d.lastName,
    d.gender,
    d.phone,
    d.workPlace,
    d.status,
    d.createdAt.toISOString(),
    d.updatedAt.toISOString()
  ]);
  return [headers.join(","), ...rows.map(row => row.map(escapeCsvValue).join(","))].join("\n");
}

// Convert loans to CSV format
export function loansToCsv(loans: LoanT[]): string {
  const headers = [
    "id", "debtorId", "amount", "currency", "interest", "dueDate",
    "lateFeeRate", "lateFeeCycle", "status", "notifyOnDue", "settledAt",
    "createdAt", "updatedAt"
  ];
  const rows = loans.map(l => [
    l.id,
    l.debtorId,
    l.amount,
    l.currency,
    l.interest,
    l.dueDate.toISOString(),
    l.lateFeeRate,
    l.lateFeeCycle,
    l.status,
    l.notifyOnDue ? 1 : 0,
    l.settledAt ? l.settledAt.toISOString() : "",
    l.createdAt.toISOString(),
    l.updatedAt.toISOString()
  ]);
  return [headers.join(","), ...rows.map(row => row.map(escapeCsvValue).join(","))].join("\n");
}

// State-machine-based robust CSV parser
export function parseCsv(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentValue = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentValue += '"';
          i++; // skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        currentValue += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(currentValue);
        currentValue = "";
      } else if (char === '\n' || char === '\r') {
        if (char === '\r' && nextChar === '\n') {
          i++; // skip \n
        }
        row.push(currentValue);
        result.push(row);
        row = [];
        currentValue = "";
      } else {
        currentValue += char;
      }
    }
  }

  if (row.length > 0 || currentValue !== "") {
    row.push(currentValue);
    result.push(row);
  }

  return result.filter(r => r.length > 0 && r.some(cell => cell.trim() !== ""));
}

// Exporters
export async function exportDataToJson(debtors: DebtorT[], loans: LoanT[]) {
  const backupData = {
    debtors,
    loans,
    backedUpAt: new Date().toISOString(),
  };
  
  const fileUri = `${documentDirectory}debtors_and_loans_backup.json`;
  await writeAsStringAsync(fileUri, JSON.stringify(backupData, null, 2), {
    encoding: EncodingType.UTF8,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, { mimeType: "application/json", dialogTitle: "Export Database JSON Backup" });
  } else {
    Alert.alert("Sharing Not Available", "File sharing is not supported on this device.");
  }
}

export async function exportDebtorsToCsvFile(debtors: DebtorT[]) {
  const csvData = debtorsToCsv(debtors);
  const fileUri = `${documentDirectory}debtors.csv`;
  await writeAsStringAsync(fileUri, csvData, {
    encoding: EncodingType.UTF8,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, { mimeType: "text/csv", dialogTitle: "Export Debtors to CSV" });
  } else {
    Alert.alert("Sharing Not Available", "File sharing is not supported on this device.");
  }
}

export async function exportLoansToCsvFile(loans: LoanT[]) {
  const csvData = loansToCsv(loans);
  const fileUri = `${documentDirectory}loans.csv`;
  await writeAsStringAsync(fileUri, csvData, {
    encoding: EncodingType.UTF8,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, { mimeType: "text/csv", dialogTitle: "Export Loans to CSV" });
  } else {
    Alert.alert("Sharing Not Available", "File sharing is not supported on this device.");
  }
}

// Importer
export async function importFromFile(): Promise<{
  type: "json" | "debtors-csv" | "loans-csv";
  debtors?: any[];
  loans?: any[];
} | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/json", "text/comma-separated-values", "text/csv"],
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const selectedFile = result.assets[0];
    const fileContent = await readAsStringAsync(selectedFile.uri, {
      encoding: EncodingType.UTF8,
    });

    const fileName = selectedFile.name.toLowerCase();

    // Handle JSON import
    if (fileName.endsWith(".json")) {
      try {
        const parsed = JSON.parse(fileContent);
        if (Array.isArray(parsed.debtors) && Array.isArray(parsed.loans)) {
          return {
            type: "json",
            debtors: parsed.debtors,
            loans: parsed.loans,
          };
        } else {
          Alert.alert("Invalid File Format", "JSON backup must contain both debtors and loans lists.");
          return null;
        }
      } catch (err) {
        Alert.alert("Import Failed", "Failed to parse JSON file.");
        return null;
      }
    }

    // Handle CSV import
    if (fileName.endsWith(".csv")) {
      const parsed = parseCsv(fileContent);
      if (parsed.length === 0) {
        Alert.alert("Import Failed", "CSV file is empty.");
        return null;
      }

      const headers = parsed[0].map(h => h.trim());
      
      // Determine if Debtors or Loans CSV based on header matches
      const isDebtorCsv = headers.includes("firstName") && headers.includes("phone");
      const isLoanCsv = headers.includes("debtorId") && headers.includes("amount");

      if (isDebtorCsv) {
        const debtorsList = parsed.slice(1).map(row => {
          const debtor: any = {};
          headers.forEach((header, index) => {
            let val: any = row[index];
            if (header === "id") val = Number(val);
            if (header === "createdAt" || header === "updatedAt") val = new Date(val);
            debtor[header] = val;
          });
          return debtor;
        });

        return {
          type: "debtors-csv",
          debtors: debtorsList,
        };
      } else if (isLoanCsv) {
        const loansList = parsed.slice(1).map(row => {
          const loan: any = {};
          headers.forEach((header, index) => {
            let val: any = row[index];
            if (header === "id" || header === "debtorId" || header === "amount" || header === "lateFeeCycle") {
              val = Number(val);
            } else if (header === "interest" || header === "lateFeeRate") {
              val = parseFloat(val);
            } else if (header === "notifyOnDue") {
              val = val === "1" || val === "true" || val === true;
            } else if (header === "dueDate" || header === "createdAt" || header === "updatedAt") {
              val = new Date(val);
            } else if (header === "settledAt") {
              val = val ? new Date(val) : undefined;
            }
            loan[header] = val;
          });
          return loan;
        });

        return {
          type: "loans-csv",
          loans: loansList,
        };
      } else {
        Alert.alert("Import Failed", "Could not identify standard headers in the CSV file.");
        return null;
      }
    }

    Alert.alert("Unsupported File", "Only CSV and JSON formats are supported.");
    return null;
  } catch (error) {
    console.error("Import file error:", error);
    Alert.alert("Import Failed", "An error occurred during file import.");
    return null;
  }
}
