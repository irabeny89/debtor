import { mockDebtors } from "@/data/debtor";
import { DebtorT } from "@/types";

export default function useDebtorList(): DebtorT[] {
  const debtors = mockDebtors
  return debtors
}