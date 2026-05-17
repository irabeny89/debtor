import useLoanList from "./use-loan-list";

export default function useLoan(id: number) {
  const loans = useLoanList();
  const loan = loans.find(loan => loan.id === id);
  return loan;
}