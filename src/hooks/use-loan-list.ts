import { mockLoans } from "@/data/loan";
import { LoanT } from "@/types";

export default function useLoanList(): LoanT[] {
  const loans = mockLoans
  return loans
}