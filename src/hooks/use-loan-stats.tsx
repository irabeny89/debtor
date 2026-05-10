import { mockLoans } from "@/data/loan";

export default function useLoanStats() {
  const loans = mockLoans
  const totalGranted = loans.reduce((acc, loan) => acc + loan.amount, 0)
  const active = loans.filter(loan => loan.status === "granted").reduce((acc, loan) => acc + loan.amount, 0)
  const settled = loans.filter(loan => loan.status === "settled").reduce((acc, loan) => acc + loan.amount, 0)
  const unsettled = loans.filter(loan => loan.status === "overdue").reduce((acc, loan) => acc + loan.amount, 0)
  return {
    totalGranted,
    active,
    settled,
    unsettled
  }
}