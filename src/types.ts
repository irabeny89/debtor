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
