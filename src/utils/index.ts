import type { CurrencyCodeT, LoanT } from "@/types";

/**
 * Format values into decimal value (e.g 2.3k).
 *
 * * Default to `decimal` unless specified.
 * @param value the value to format
 * @param maxSigDigit the maximum number of significant digits to display
 * @returns the formatted string
 */
export function formatNumber(value: number, maxSigDigit: number = 3) {
	return new Intl.NumberFormat("en-NG", {
		style: "decimal",
		maximumSignificantDigits: maxSigDigit,
		notation: "compact",
	}).format(value);
}

/**
 * Formats a number as money (e.g. ₦2,000.00). 
 * Note that this function divides the value by 100, so ensure to multiply your input by 100 before passing it to this function.
 *
 * @param value the value to format
 * @param currency currency code (e.g. `NGN`, `USD`, `EUR`, `GBP`)
 * @param maxFracDigit maximum number of fraction digits to display (default: 2)
 * @returns the formatted money string (e.g. `₦2,000.00`)
 */
export function formatMoney<T extends string>(
	value: number,
	currency: CurrencyCodeT<T>,
	maxFracDigit: number = 2
) {
	return Intl.NumberFormat("en-NG", {
		style: "currency",
		currency,
		maximumFractionDigits: maxFracDigit,
	}).format(value / 100);
}

/**
 * Returns the currency code symbol (e.g. `₦`, `$`, `€`, `£`) for a given currency code.
 * @param currencyCode currency code as string
 * @returns the currency code symbol (e.g. `₦`, `$`, `€`, `£`)
 */
export function getCurrencySymbol(currencyCode: string) {
	const symbolMap = new Map([
		["ngn", "₦"],
		["usd", "$"],
		["eur", "€"],
		["gbp", "£"],
	])
	const code = currencyCode.toLowerCase();
	if (symbolMap.has(code)) return symbolMap.get(code)!;
	return "#";
}

/**
 * Debounces a function to run at most once per every 'limit' milliseconds.
 *
 * @param {Function} func The function to debounce.
 * @param {number} delay The delay in milliseconds before the function is executed.
 */
export function debounce<F extends (...args: unknown[]) => void>(
	func: F,
	delay: number,
) {
	let timeoutId: NodeJS.Timeout | number | null = null;

	return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
		if (timeoutId) clearTimeout(timeoutId);

		timeoutId = setTimeout(() => {
			func.apply(this, args);
		}, delay);
	};
}

/**
 * Capitalizes the first letter of every word in a given string.
 * @param str The input string.
 * @returns The string with all words capitalized.
 */
export function capitalizeWords(str: string) {
	return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatDate(date: Date) {
	return new Intl.DateTimeFormat("en-NG", {
		year: "numeric",
		month: "short",
		day: "2-digit",
	}).format(date);
}

export function formatDateTime(date: Date) {
	return new Intl.DateTimeFormat("en-NG", {
		year: "numeric",
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
}

/**
 * Truncates text if it exceeds the specified maximum length, appending "...".
 * @param text The input string.
 * @param maxLength The maximum allowed length before truncation.
 * @returns The original or truncated string.
 */
export function truncateText(text: string, maxLength: number) {
	if (text.length <= maxLength) return text;
	return `${text.slice(0, maxLength)}...`;
}
/**
 * Validates a phone number using a regex that generally matches E.164 format.
 * E.164 numbers are 15 digits long maximum, starting with an optional '+' sign,
 * followed by 0 to 14 digits (first digit must be 0-9).
 */
export function isPhoneValid(phone: string) {
	const phoneRegex = /^\+?[0-9]\d{1,14}$/; // E.164 format
	return phoneRegex.test(phone);
}

/**
 * Calculates the worth of a loan including interest and late fees.
 * @param loan Loan object
 * @returns The worth of the loan
 */
export function calcLoanWorth(loan: LoanT): number {
	const interestAmount = loan.interest * loan.amount
	let lateFeeAmount = 0
	if (loan.status === "overdue") {
		const daysOverdue = (new Date().getTime() - loan.dueDate.getTime()) / (1000 * 60 * 60 * 24);
		if (daysOverdue > 0) {
			const lateFeeTimes = Math.floor(daysOverdue / loan.lateFeeCycle)
			lateFeeAmount = lateFeeTimes * loan.lateFeeRate * loan.amount
		}
	} else if (loan.status === "settled" && loan.settledAt && loan.settledAt > loan.dueDate) {
		const daysOverdue = (loan.settledAt.getTime() - loan.dueDate.getTime()) / (1000 * 60 * 60 * 24);
		if (daysOverdue > 0) {
			const lateFeeTimes = Math.floor(daysOverdue / loan.lateFeeCycle)
			lateFeeAmount = lateFeeTimes * loan.lateFeeRate * loan.amount
		}
	}
	return loan.amount + interestAmount + lateFeeAmount
}