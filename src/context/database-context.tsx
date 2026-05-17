import React, { createContext, useContext, useState, useEffect } from "react";
import { DebtorT, LoanT } from "@/types";
import {
  initDb,
  fetchDebtors,
  fetchLoans,
  insertDebtor,
  updateDebtorInDb,
  deleteDebtorFromDb,
  insertLoan,
  updateLoanInDb,
  deleteLoanFromDb,
  restoreDb,
  clearDb,
  seedDb,
  importDebtorsListInDb,
  importLoansListInDb,
} from "@/utils/db";

type DatabaseContextT = {
  debtors: DebtorT[];
  loans: LoanT[];
  addDebtor: (debtor: Omit<DebtorT, "id" | "createdAt" | "updatedAt">) => DebtorT;
  updateDebtor: (id: number, debtor: Partial<DebtorT>) => void;
  deleteDebtor: (id: number) => void;
  addLoan: (loan: Omit<LoanT, "id" | "createdAt" | "updatedAt">) => LoanT;
  updateLoan: (id: number, loan: Partial<LoanT>) => void;
  deleteLoan: (id: number) => void;
  refreshData: () => void;
  restoreDatabase: (debtors: DebtorT[], loans: LoanT[]) => void;
  clearDatabase: () => void;
  seedDatabase: () => void;
  importDebtors: (debtors: DebtorT[], replace: boolean) => void;
  importLoans: (loans: LoanT[], replace: boolean) => void;
};

const DatabaseContext = createContext<DatabaseContextT | undefined>(undefined);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [debtors, setDebtors] = useState<DebtorT[]>([]);
  const [loans, setLoans] = useState<LoanT[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      initDb();
      refreshData();
      setIsReady(true);
    } catch (error) {
      console.error("Database initialization failed:", error);
    }
  }, []);

  const refreshData = () => {
    const d = fetchDebtors();
    const l = fetchLoans();
    setDebtors(d);
    setLoans(l);
  };

  const addDebtor = (debtorData: Omit<DebtorT, "id" | "createdAt" | "updatedAt">) => {
    const newDebtor = insertDebtor(debtorData);
    setDebtors((prev) => [...prev, newDebtor].sort((a, b) => a.firstName.localeCompare(b.firstName)));
    return newDebtor;
  };

  const updateDebtor = (id: number, debtorData: Partial<DebtorT>) => {
    updateDebtorInDb(id, debtorData);
    setDebtors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...debtorData, updatedAt: new Date() } : d))
    );
  };

  const deleteDebtor = (id: number) => {
    deleteDebtorFromDb(id);
    setDebtors((prev) => prev.filter((d) => d.id !== id));
    setLoans((prev) => prev.filter((l) => l.debtorId !== id));
  };

  const addLoan = (loanData: Omit<LoanT, "id" | "createdAt" | "updatedAt">) => {
    const newLoan = insertLoan(loanData);
    setLoans((prev) => [newLoan, ...prev]);
    return newLoan;
  };

  const updateLoan = (id: number, loanData: Partial<LoanT>) => {
    updateLoanInDb(id, loanData);
    setLoans((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...loanData, updatedAt: new Date() } : l))
    );
  };

  const deleteLoan = (id: number) => {
    deleteLoanFromDb(id);
    setLoans((prev) => prev.filter((l) => l.id !== id));
  };

  const restoreDatabase = (restoredDebtors: any[], restoredLoans: any[]) => {
    restoreDb(restoredDebtors, restoredLoans);
    refreshData();
  };

  const clearDatabase = () => {
    clearDb();
    refreshData();
  };

  const seedDatabase = () => {
    seedDb();
    refreshData();
  };

  const importDebtors = (debtorsList: any[], replace: boolean) => {
    importDebtorsListInDb(debtorsList, replace);
    refreshData();
  };

  const importLoans = (loansList: any[], replace: boolean) => {
    importLoansListInDb(loansList, replace);
    refreshData();
  };

  if (!isReady) {
    return null; // Or a splash screen
  }

  return (
    <DatabaseContext.Provider
      value={{
        debtors,
        loans,
        addDebtor,
        updateDebtor,
        deleteDebtor,
        addLoan,
        updateLoan,
        deleteLoan,
        refreshData,
        restoreDatabase,
        clearDatabase,
        seedDatabase,
        importDebtors,
        importLoans,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
}
