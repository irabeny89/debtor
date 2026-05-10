import { Ionicons } from "@expo/vector-icons";
import type { Dispatch, SetStateAction } from "react";
import {
	StyleSheet,
	TextInput,
	View,
	type ViewStyle,
} from "react-native";

type Props = {
	placeholder: string;
	text: string;
	onChange: Dispatch<SetStateAction<string>>;
	containerStyle?: ViewStyle;
};
export default function SearchInput(props: Props) {
	return (
		<View style={[styles.container, props.containerStyle]}>
			<Ionicons
				name="search"
				size={20}
				color="#666"
				style={styles.searchIcon}
			/>
			<TextInput
				style={styles.input}
				placeholder={props.placeholder}
				onChangeText={props.onChange}
				value={props.text}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#002B36",
		borderRadius: 10,
		paddingHorizontal: 10,
		height: 50,
	},
	searchIcon: {
		marginRight: 10,
	},
	input: {
		flex: 1, // Ensures the input takes up all remaining space
		paddingVertical: 10,
		color: "#424242",
	},
});
