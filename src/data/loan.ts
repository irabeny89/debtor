import { LoanT } from "@/types";

export const mockLoans: LoanT[] = [
  {
    id: "1",
    debtorId: "1",
    amount: 100_000_00,
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
    amount: 200_000_00,
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
    {
    id: "3",
    debtorId: "10",
    amount: 150_000_00,
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
    id: "4",
    debtorId: "2",
    amount: 200_000_00,
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
    {
    id: "5",
    debtorId: "1",
    amount: 80_000_00,
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
    id: "6",
    debtorId: "12",
    amount: 50_000_00,
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
    {
    id: "7",
    debtorId: "13",
    amount: 120_000_00,
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
    id: "8",
    debtorId: "14",
    amount: 20_000_00,
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
    {
    id: "9",
    debtorId: "15",
    amount: 15_000_00,
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
    id: "10",
    debtorId: "2",
    amount: 300_000_00,
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
    {
    id: "11",
    debtorId: "5",
    amount: 100_000_00,
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
    id: "12",
    debtorId: "8",
    amount: 250_000_00,
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
    {
    id: "13",
    debtorId: "11",
    amount: 100_000_00,
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
    id: "14",
    debtorId: "4",
    amount: 400_000_00,
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
    {
    id: "15",
    debtorId: "7",
    amount: 220_000_00,
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
    id: "16",
    debtorId: "9",
    amount: 90_000_00,
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