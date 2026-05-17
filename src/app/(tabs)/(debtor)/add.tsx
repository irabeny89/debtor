import { useRouter } from "expo-router";
import DebtorForm, { DebtorFormData } from "@/components/debtor/debtor-form";
import { useDatabase } from "@/context/database-context";

export default function AddDebtorScreen() {
  const router = useRouter();
  const { addDebtor } = useDatabase();

  const handleSave = (data: DebtorFormData) => {
    addDebtor({
      ...data,
      status: "Inactive",
    });

    // Go back to the previous screen
    router.back();
  };

  return (
    <DebtorForm 
      onSubmit={handleSave}
      headerIcon="person-add"
      headerSubtitle="Enter the debtor's details below to add them to your record."
      submitButtonText="Save Debtor"
    />
  );
}
