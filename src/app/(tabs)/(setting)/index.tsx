import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { mockDebtors } from "@/data/debtor";
import { mockLoans } from "@/data/loan";

export default function SettingsScreen() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [lastBackup, setLastBackup] = useState<string>("Never");

  const handleBackup = async () => {
    setIsBackingUp(true);
    // Simulate cloud backup latency
    setTimeout(async () => {
      setIsBackingUp(false);
      const backupData = {
        debtors: mockDebtors,
        loans: mockLoans,
        backedUpAt: new Date().toISOString(),
      };
      
      const dateString = new Date().toLocaleDateString();
      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastBackup(`${dateString} at ${timeString}`);

      Alert.alert(
        "Backup Successful",
        "Your debtors, loans, and settings have been safely backed up to the secure cloud storage.",
        [
          {
            text: "Share Backup",
            onPress: async () => {
              try {
                await Share.share({
                  message: JSON.stringify(backupData, null, 2),
                  title: "DebtorApp Backup Data",
                });
              } catch (error) {
                console.log("Error sharing backup", error);
              }
            },
          },
          { text: "OK", style: "default" },
        ]
      );
    }, 2000);
  };

  const handleRestore = () => {
    Alert.alert(
      "Restore Data",
      "Are you sure you want to restore your data? This will overwrite any current unsaved changes with the last cloud backup.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Restore",
          style: "destructive",
          onPress: () => {
            setIsRestoring(true);
            // Simulate restoring data latency
            setTimeout(() => {
              setIsRestoring(false);
              Alert.alert(
                "Restore Successful",
                "Data has been successfully restored to the last saved backup state."
              );
            }, 2000);
          },
        },
      ]
    );
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
                <Ionicons name="cloud-done-outline" size={32} color="#4F46E5" />
              </View>
              <View style={styles.cloudInfo}>
                <Text style={styles.cloudTitle}>Cloud Synchronization</Text>
                <Text style={styles.cloudSubtitle}>Securely backup and restore all your records</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.backupMetaRow}>
              <Text style={styles.metaLabel}>Last Backup Status</Text>
              <Text style={styles.metaValue}>{lastBackup}</Text>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.backupButton]} 
              onPress={handleBackup}
              disabled={isBackingUp || isRestoring}
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
              disabled={isBackingUp || isRestoring}
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
