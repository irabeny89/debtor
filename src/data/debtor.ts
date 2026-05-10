import { DebtorT } from "@/types";

export const mockDebtors: DebtorT[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    phone: "1234567890",
    workPlace: "ABC Corp",
    status: "Active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Doe",
    phone: "1234567890",
    workPlace: "ABC Corp",
    status: "Inactive",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    firstName: "Bob",
    lastName: "Doe",
    phone: "1234567890",
    workPlace: "ABC Corp",
    status: "Suspended",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];