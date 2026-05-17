import { useRouter } from "expo-router";
import React from "react";
import LoanForm, { LoanFormData } from "@/components/loan/loan-form";

export default function AddLoanScreen() {
  const router = useRouter();

  const handleSave = (data: LoanFormData) => {
    // TODO: Dispatch save action here
    router.back();
  };

  return (
    <LoanForm 
      onSubmit={handleSave}
      submitButtonText="Create Loan"
    />
  );
}