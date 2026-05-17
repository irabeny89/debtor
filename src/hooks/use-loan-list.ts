import { useDatabase } from "@/context/database-context";
import { LoanT } from "@/types";

export default function useLoanList(): LoanT[] {
  const { loans } = useDatabase();
  return loans;
}