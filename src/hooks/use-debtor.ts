import useDebtorList from "./use-debtor-list";

export default function useDebtor(id: number) {
  const debtors = useDebtorList();
  const debtor = debtors.find(debtor => debtor.id === id);
  return debtor;
}