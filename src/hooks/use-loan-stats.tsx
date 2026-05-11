import { mockLoans } from "@/data/loan";
import useSettingData from "./use-setting-data";

/**
 * Calculates statistical data about loans granted.
 *
 * @returns statistical data about loans granted
 */
export default function useLoanStats() {
  const { currencyCode } = useSettingData()
  const loans = mockLoans
  const totalGranted = loans.reduce((acc, loan) => acc + loan.amount, 0) / 100
  const active = loans.filter(loan => loan.status === "granted").reduce((acc, loan) => acc + loan.amount, 0) / 100
  const settled = loans.filter(loan => loan.status === "settled").reduce((acc, loan) => acc + loan.amount, 0) / 100
  const unsettled = loans.filter(loan => loan.status === "overdue").reduce((acc, loan) => acc + loan.amount, 0) / 100
  return {
    currencyCode: loans[0]?.currency || currencyCode,
    totalGranted,
    active,
    settled,
    unsettled
  }
}