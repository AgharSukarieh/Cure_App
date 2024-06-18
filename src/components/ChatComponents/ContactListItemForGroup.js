import React from "react";
import { TouchableOpacity, Text, View, StyleSheet, Image } from "react-native";

const ContactGroupListItem = ({ user, onSelect, isSelected }) => {
	return (
		<TouchableOpacity onPress={onSelect} style={[styles.container, isSelected && styles.selected, !isSelected && styles.notSelected]}>
			<View style={styles.userStyle}>
				{user?.image
					? <Image source={{ uri: user?.image }} style={styles.image} />
					: <Image source={require("../../../assets/user.png")} style={styles.image} />
				}
				<Text style={styles.text}>{user.name}</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		textAlign: "center",
marginHorizontal: 15,
		marginTop: 10,
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#ccc",
	},
	selected: {
		backgroundColor: "#69bdf3",
		borderRadius: 10,
	},
	userStyle: {
		marginBottom: 5,
		gap: 10,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	text: {
		color: "#000",
	},
	image: {
		width: 60,
		height: 60,
		borderRadius: 30,
		marginRight: 10,
	},
	notSelected: {
		backgroundColor: "#eee",
		borderRadius: 10,
	}
});

export default ContactGroupListItem;
