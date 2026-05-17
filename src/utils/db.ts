import * as SQLite from "expo-sqlite";
import { DebtorT, LoanT } from "@/types";
import { mockDebtors } from "@/data/debtor";
import { mockLoans } from "@/data/loan";

const DB_NAME = "debtors.db";
let db: SQLite.SQLiteDatabase | null = null;

export function getDbConnection(): SQLite.SQLiteDatabase {
  if (!db) {
    db = SQLite.openDatabaseSync(DB_NAME);
  }
  return db;
}

export function initDb() {
  const database = getDbConnection();

  // Create Debtors Table
  database.execSync(`
    CREATE TABLE IF NOT EXISTS debtors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      gender TEXT NOT NULL,
      phone TEXT NOT NULL,
      workPlace TEXT NOT NULL,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  // Create Loans Table
  database.execSync(`
    CREATE TABLE IF NOT EXISTS loans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      debtorId INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      currency TEXT NOT NULL,
      interest REAL NOT NULL,
      dueDate TEXT NOT NULL,
      lateFeeRate REAL NOT NULL,
      lateFeeCycle INTEGER NOT NULL,
      status TEXT NOT NULL,
      notifyOnDue INTEGER NOT NULL,
      settledAt TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (debtorId) REFERENCES debtors (id) ON DELETE CASCADE
    );
  `);

  // Seed initial data if empty
  const debtorCount = database.getFirstSync<{ count: number }>(
    "SELECT COUNT(*) as count FROM debtors;"
  );

  if (debtorCount && debtorCount.count === 0) {
    console.log("Seeding SQLite database with mock data...");
    
    // Seed debtors
    for (const debtor of mockDebtors) {
      database.runSync(
        `INSERT INTO debtors (id, firstName, lastName, gender, phone, workPlace, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          debtor.id,
          debtor.firstName,
          debtor.lastName,
          debtor.gender,
          debtor.phone,
          debtor.workPlace,
          debtor.status,
          debtor.createdAt.toISOString(),
          debtor.updatedAt.toISOString(),
        ]
      );
    }

    // Seed loans
    for (const loan of mockLoans) {
      database.runSync(
        `INSERT INTO loans (id, debtorId, amount, currency, interest, dueDate, lateFeeRate, lateFeeCycle, status, notifyOnDue, settledAt, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          loan.id,
          loan.debtorId,
          loan.amount,
          loan.currency,
          loan.interest,
          loan.dueDate.toISOString(),
          loan.lateFeeRate,
          loan.lateFeeCycle,
          loan.status,
          loan.notifyOnDue ? 1 : 0,
          loan.settledAt ? loan.settledAt.toISOString() : null,
          loan.createdAt.toISOString(),
          loan.updatedAt.toISOString(),
        ]
      );
    }
    console.log("Database seeded successfully!");
  }
}

// Map database row to DebtorT
function mapDebtor(row: any): DebtorT {
  return {
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    gender: row.gender,
    phone: row.phone,
    workPlace: row.workPlace,
    status: row.status,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

// Map database row to LoanT
function mapLoan(row: any): LoanT {
  return {
    id: row.id,
    debtorId: row.debtorId,
    amount: row.amount,
    currency: row.currency,
    interest: row.interest,
    dueDate: new Date(row.dueDate),
    lateFeeRate: row.lateFeeRate,
    lateFeeCycle: row.lateFeeCycle,
    status: row.status,
    notifyOnDue: row.notifyOnDue === 1,
    settledAt: row.settledAt ? new Date(row.settledAt) : undefined,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

// Debtor DB Methods
export function fetchDebtors(): DebtorT[] {
  const database = getDbConnection();
  const rows = database.getAllSync("SELECT * FROM debtors ORDER BY firstName ASC;");
  return rows.map(mapDebtor);
}

export function insertDebtor(debtor: Omit<DebtorT, "id" | "createdAt" | "updatedAt">): DebtorT {
  const database = getDbConnection();
  const now = new Date().toISOString();
  const result = database.runSync(
    `INSERT INTO debtors (firstName, lastName, gender, phone, workPlace, status, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      debtor.firstName,
      debtor.lastName,
      debtor.gender,
      debtor.phone,
      debtor.workPlace,
      debtor.status,
      now,
      now,
    ]
  );
  
  return {
    id: result.lastInsertRowId,
    ...debtor,
    createdAt: new Date(now),
    updatedAt: new Date(now),
  };
}

export function updateDebtorInDb(id: number, debtor: Partial<DebtorT>): void {
  const database = getDbConnection();
  const now = new Date().toISOString();
  
  // Dynamically build update query
  const fields: string[] = [];
  const params: any[] = [];
  
  Object.entries(debtor).forEach(([key, val]) => {
    if (key !== "id" && key !== "createdAt" && key !== "updatedAt") {
      fields.push(`${key} = ?`);
      params.push(val instanceof Date ? val.toISOString() : val);
    }
  });
  
  fields.push("updatedAt = ?");
  params.push(now);
  params.push(id);
  
  database.runSync(
    `UPDATE debtors SET ${fields.join(", ")} WHERE id = ?;`,
    params
  );
}

export function deleteDebtorFromDb(id: number): void {
  const database = getDbConnection();
  // Cascade delete loans for this debtor
  database.runSync("DELETE FROM loans WHERE debtorId = ?;", [id]);
  database.runSync("DELETE FROM debtors WHERE id = ?;", [id]);
}

// Loan DB Methods
export function fetchLoans(): LoanT[] {
  const database = getDbConnection();
  const rows = database.getAllSync("SELECT * FROM loans ORDER BY createdAt DESC;");
  return rows.map(mapLoan);
}

export function insertLoan(loan: Omit<LoanT, "id" | "createdAt" | "updatedAt">): LoanT {
  const database = getDbConnection();
  const now = new Date().toISOString();
  const result = database.runSync(
    `INSERT INTO loans (debtorId, amount, currency, interest, dueDate, lateFeeRate, lateFeeCycle, status, notifyOnDue, settledAt, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      loan.debtorId,
      loan.amount,
      loan.currency,
      loan.interest,
      loan.dueDate.toISOString(),
      loan.lateFeeRate,
      loan.lateFeeCycle,
      loan.status,
      loan.notifyOnDue ? 1 : 0,
      loan.settledAt ? loan.settledAt.toISOString() : null,
      now,
      now,
    ]
  );
  
  return {
    id: result.lastInsertRowId,
    ...loan,
    createdAt: new Date(now),
    updatedAt: new Date(now),
  };
}

export function updateLoanInDb(id: number, loan: Partial<LoanT>): void {
  const database = getDbConnection();
  const now = new Date().toISOString();
  
  const fields: string[] = [];
  const params: any[] = [];
  
  Object.entries(loan).forEach(([key, val]) => {
    if (key !== "id" && key !== "createdAt" && key !== "updatedAt") {
      fields.push(`${key} = ?`);
      if (val instanceof Date) {
        params.push(val.toISOString());
      } else if (typeof val === "boolean") {
        params.push(val ? 1 : 0);
      } else {
        params.push(val);
      }
    }
  });
  
  fields.push("updatedAt = ?");
  params.push(now);
  params.push(id);
  
  database.runSync(
    `UPDATE loans SET ${fields.join(", ")} WHERE id = ?;`,
    params
  );
}

export function deleteLoanFromDb(id: number): void {
  const database = getDbConnection();
  database.runSync("DELETE FROM loans WHERE id = ?;", [id]);
}

export function restoreDb(debtors: DebtorT[], loans: LoanT[]): void {
  const database = getDbConnection();
  
  // Clear tables
  database.runSync("DELETE FROM loans;");
  database.runSync("DELETE FROM debtors;");

  // Re-insert debtors
  for (const debtor of debtors) {
    database.runSync(
      `INSERT INTO debtors (id, firstName, lastName, gender, phone, workPlace, status, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        debtor.id,
        debtor.firstName,
        debtor.lastName,
        debtor.gender,
        debtor.phone,
        debtor.workPlace,
        debtor.status,
        debtor.createdAt instanceof Date ? debtor.createdAt.toISOString() : new Date(debtor.createdAt).toISOString(),
        debtor.updatedAt instanceof Date ? debtor.updatedAt.toISOString() : new Date(debtor.updatedAt).toISOString(),
      ]
    );
  }

  // Re-insert loans
  for (const loan of loans) {
    database.runSync(
      `INSERT INTO loans (id, debtorId, amount, currency, interest, dueDate, lateFeeRate, lateFeeCycle, status, notifyOnDue, settledAt, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        loan.id,
        loan.debtorId,
        loan.amount,
        loan.currency,
        loan.interest,
        loan.dueDate instanceof Date ? loan.dueDate.toISOString() : new Date(loan.dueDate).toISOString(),
        loan.lateFeeRate,
        loan.lateFeeCycle,
        loan.status,
        loan.notifyOnDue ? 1 : 0,
        loan.settledAt ? (loan.settledAt instanceof Date ? loan.settledAt.toISOString() : new Date(loan.settledAt).toISOString()) : null,
        loan.createdAt instanceof Date ? loan.createdAt.toISOString() : new Date(loan.createdAt).toISOString(),
        loan.updatedAt instanceof Date ? loan.updatedAt.toISOString() : new Date(loan.updatedAt).toISOString(),
      ]
    );
  }
}

export function clearDb(): void {
  const database = getDbConnection();
  database.runSync("DELETE FROM loans;");
  database.runSync("DELETE FROM debtors;");
}

export function seedDb(): void {
  restoreDb(mockDebtors, mockLoans);
}
