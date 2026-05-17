import { useRouter, useLocalSearchParams } from "expo-router";
import useDebtor from "@/hooks/use-debtor";
import DebtorForm, { DebtorFormData } from "@/components/debtor/debtor-form";
import { useDatabase } from "@/context/database-context";

export default function EditDebtorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const debtorId = Number(id);
  const debtor = useDebtor(debtorId);
  const { updateDebtor } = useDatabase();

  const handleSave = (data: DebtorFormData) => {
    if (debtor) {
      updateDebtor(debtorId, data);
    }

    // Go back to the previous screen
    router.back();
  };

  return (
    <DebtorForm
      initialValues={debtor ? {
        firstName: debtor.firstName,
        lastName: debtor.lastName,
        phone: debtor.phone,
        workPlace: debtor.workPlace,
        gender: debtor.gender as "m" | "f",
      } : undefined}
      onSubmit={handleSave}
      headerIcon="pencil"
      headerSubtitle="Update the debtor's details below."
      submitButtonText="Update Debtor"
      updatedAt={debtor?.updatedAt}
    />
  );
}
