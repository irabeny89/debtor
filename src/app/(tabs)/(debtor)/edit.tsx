import { useRouter, useLocalSearchParams } from "expo-router";
import useDebtor from "@/hooks/use-debtor";
import { mockDebtors } from "@/data/debtor";
import DebtorForm, { DebtorFormData } from "@/components/debtor/debtor-form";

export default function EditDebtorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const debtor = useDebtor(id);

  const handleSave = (data: DebtorFormData) => {
    // TODO: In a real app, dispatch to store or make API call here
    if (debtor) {
      const index = mockDebtors.findIndex(d => d.id === id);
      if (index !== -1) {
        mockDebtors[index] = {
          ...mockDebtors[index],
          ...data,
          updatedAt: new Date(),
        };
      }
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
