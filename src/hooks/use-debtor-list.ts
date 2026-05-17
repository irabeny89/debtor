import { useDatabase } from "@/context/database-context";
import { DebtorT } from "@/types";

export default function useDebtorList(): DebtorT[] {
  const { debtors } = useDatabase();
  return debtors;
}