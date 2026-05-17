import { useRouter } from "expo-router";
import DebtorForm, { DebtorFormData } from "@/components/debtor/debtor-form";

export default function AddDebtorScreen() {
  const router = useRouter();

  const handleSave = (data: DebtorFormData) => {
    // TODO: In a real app, dispatch to store or make API call here

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
