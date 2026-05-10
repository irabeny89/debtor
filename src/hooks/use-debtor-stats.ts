import { mockDebtors } from "@/data/debtor";

export default function useDebtorStats() {
  const debtors = mockDebtors
  const total = debtors.length
  const active = debtors.filter(debtor => debtor.status === "Active").length
  const inActive = debtors.filter(debtor => debtor.status === "Inactive").length
  const suspended = debtors.filter(debtor => debtor.status === "Suspended").length
  return {
    total,
    active,
    inActive,
    suspended
  }
}