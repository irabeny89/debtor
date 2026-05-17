import { useRouter } from "expo-router";
import React from "react";
import LoanForm, { LoanFormData } from "@/components/loan/loan-form";
import { useDatabase } from "@/context/database-context";

export default function AddLoanScreen() {
  const router = useRouter();
  const { addLoan, updateDebtor } = useDatabase();

  const handleSave = (data: LoanFormData) => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + parseInt(data.duration, 10));

    addLoan({
      debtorId: data.selectedDebtor,
      amount: parseFloat(data.amount) * 100,
      currency: "NGN",
      interest: parseFloat(data.interest) / 100,
      dueDate,
      lateFeeRate: parseFloat(data.lateFee) / 100,
      lateFeeCycle: parseInt(data.duration, 10),
      status: "granted",
      notifyOnDue: data.notify,
    });

    // Automatically set the debtor to Active status since they have a loan
    updateDebtor(data.selectedDebtor, { status: "Active" });

    router.back();
  };

  return (
    <LoanForm 
      onSubmit={handleSave}
      submitButtonText="Create Loan"
    />
  );
}