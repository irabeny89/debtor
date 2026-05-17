type UppercaseLetter =
	| "A"
	| "B"
	| "C"
	| "D"
	| "E"
	| "F"
	| "G"
	| "H"
	| "I"
	| "J"
	| "K"
	| "L"
	| "M"
	| "N"
	| "O"
	| "P"
	| "Q"
	| "R"
	| "S"
	| "T"
	| "U"
	| "V"
	| "W"
	| "X"
	| "Y"
	| "Z";

export type CurrencyCodeT<T extends string> =
	T extends `${UppercaseLetter}${UppercaseLetter}${UppercaseLetter}`
	? T extends `${string}${string}${string}${infer Rest}`
	? Rest extends ""
	? T
	: never
	: never
	: never;

export type DebtorT = {
	id: number;
	firstName: string;
	lastName: string;
	gender: "m" | "f"
	phone: string;
	workPlace: string;
	/**
	 * `Active` when on loan, `Inactive` when not on loan, `Suspended` when banned
	 */
	status: "Active" | "Inactive" | "Suspended";
	createdAt: Date;
	updatedAt: Date;
};

export type LoanT = {
	id: number;
	debtorId: DebtorT["id"];
	amount: number;
	currency: CurrencyCodeT<"NGN">;
	/** percentage */
	interest: number;
	dueDate: Date;
	/** percentage */
	lateFeeRate: number;
	/** days after which late fee will be calculated again */
	lateFeeCycle: number
	status: "overdue" | "granted" | "settled"
	notifyOnDue: boolean;
	settledAt?: Date;
	createdAt: Date;
	updatedAt: Date;
};
