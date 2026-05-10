import type { Dispatch, SetStateAction } from "react";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import SearchInput from "../search-input";

type Props = {
	onChange: Dispatch<SetStateAction<string>>;
	text: string;
};
export default function SearchAndAdd(props: Props) {
	return (
		<View style={styles.searchRow}>
			<SearchInput
				containerStyle={styles.searchContainer}
				placeholder="Find debtor"
				onChange={props.onChange}
				text={props.text}
			/>
			<TouchableOpacity style={styles.addBtn}>
				<Text style={styles.addBtnLabel}>Add debtor</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 10,
		paddingVertical: 20,
	},
	searchRow: {
		flexDirection: "row",
		gap: 10,
		alignItems: "center",
		paddingRight: 10,
	},
	searchContainer: {
		width: "75%",
	},
	addBtn: {
		width: "25%",
		backgroundColor: "black",
		paddingVertical: 15,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	addBtnLabel: {
		color: "white",
		fontWeight: "semibold",
	},
});
