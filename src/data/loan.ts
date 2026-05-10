import { LoanT } from "@/types";

export const mockLoans: LoanT[] = [
  {
    id: "1",
    debtorId: "1",
    amount: 1000,
    currency: "NGN",
    /** percentage */
    interest: 0.15,
    dueDate: new Date(),
    /** percentage */
    lateFeeRate: 0.05,
    lateFeeCycle: 30,
    status: "overdue",
    notifyOnDue: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    debtorId: "2",
    amount: 2000,
    currency: "NGN",
    /** percentage */
    interest: 0.15,
    dueDate: new Date(),
    /** percentage */
    lateFeeRate: 0.05,
    lateFeeCycle: 30,
    status: "granted",
    notifyOnDue: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];