import { mockLoans } from "@/data/loan";

/**
 * Calculates statistical data about loans granted.
 *
 * @returns statistical data about loans granted
 */
export default function useLoanStats() {
  const loans = mockLoans
  const totalGranted = loans.reduce((acc, loan) => acc + loan.amount, 0) / 100
  const active = loans.filter(loan => loan.status === "granted").reduce((acc, loan) => acc + loan.amount, 0) / 100
  const settled = loans.filter(loan => loan.status === "settled").reduce((acc, loan) => acc + loan.amount, 0) / 100
  const unsettled = loans.filter(loan => loan.status === "overdue").reduce((acc, loan) => acc + loan.amount, 0) / 100
  return {
    totalGranted,
    active,
    settled,
    unsettled
  }
}