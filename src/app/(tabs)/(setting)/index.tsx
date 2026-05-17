import React from "react";
import {
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDatabase } from "@/context/database-context";

import BackupAndRestore from "@/components/setting/backup-and-restore";
import ImportAndExport from "@/components/setting/import-and-export";
import GeneralSetting from "@/components/setting/general-setting";
import Support from "@/components/setting/support";
import Footer from "@/components/setting/footer";

export default function SettingsScreen() {
  const {
    debtors,
    loans,
    restoreDatabase,
    clearDatabase,
    seedDatabase,
    importDebtors,
    importLoans
  } = useDatabase();

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <BackupAndRestore
          debtors={debtors}
          loans={loans}
          clearDatabase={clearDatabase}
          seedDatabase={seedDatabase}
          restoreDatabase={restoreDatabase}
        />
        <ImportAndExport
          debtors={debtors}
          loans={loans}
          importDebtors={importDebtors}
          importLoans={importLoans}
          restoreDatabase={restoreDatabase}
        />
        <GeneralSetting />
        <Support />
        <Footer />
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
});
