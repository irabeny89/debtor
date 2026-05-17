import { useRouter, useLocalSearchParams } from "expo-router";
import React from "react";
import useLoan from "@/hooks/use-loan";
import { mockLoans } from "@/data/loan";
import LoanForm, { LoanFormData } from "@/components/loan/loan-form";

export default function EditLoanScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const loan = useLoan(+id);

  const handleSave = (data: LoanFormData) => {
    // TODO: Dispatch save action here
    if (loan) {
      const index = mockLoans.findIndex(l => l.id === loan.id);
      if (index !== -1) {
        mockLoans[index] = {
          ...mockLoans[index],
          debtorId: data.selectedDebtor,
          amount: parseFloat(data.amount) * 100, // assuming cents
          interest: parseFloat(data.interest) / 100,
          lateFeeCycle: parseInt(data.duration, 10),
          lateFeeRate: parseFloat(data.lateFee) / 100,
          notifyOnDue: data.notify,
          updatedAt: new Date(),
        };
      }
    }
    router.back();
  };

  return (
    <LoanForm 
      initialValues={loan ? {
        selectedDebtor: loan.debtorId,
        amount: (loan.amount / 100).toString(),
        interest: (loan.interest * 100).toString(),
        duration: loan.lateFeeCycle.toString(),
        lateFee: (loan.lateFeeRate * 100).toString(),
        notify: loan.notifyOnDue,
      } : undefined}
      onSubmit={handleSave}
      submitButtonText="Update Loan"
      updatedAt={loan?.updatedAt}
    />
  );
}
