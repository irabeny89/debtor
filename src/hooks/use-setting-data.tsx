import type { CurrencyCodeT } from "@/types";

export type SettingDataT<T extends string> = {
	currencyCode: CurrencyCodeT<T>;
};
export default function useSettingData<T extends string>(): SettingDataT<T> {
	return {
		currencyCode: "NGN" as CurrencyCodeT<T>,
	};
}
