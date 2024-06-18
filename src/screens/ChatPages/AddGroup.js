import { FlatList, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View, Button, Alert } from "react-native";
import ContactListItem from "../../components/ChatComponents/ContactListItem";
import { styles } from "../../components/styles";
import GoBack from "../../components/GoBack";
import React, { useEffect, useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { get, post } from "../../WebService/RequestBuilder";
import globalConstants from "../../config/globalConstants";
import ContactGroupListItem from "../../components/ChatComponents/ContactListItemForGroup";
import { posts } from "@reduxjs/toolkit/src/query/tests/mocks/server";

const AddGroup = ({ route, navigation }) => {
	const [txt, setTxt] = useState("");
	const [allnewusers, setallnewusers] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [groupName, setGroupName] = useState("");
	const handleTextChange = (newText) => {
		setTxt(newText);
		if (newText.length > 2) {
			get_users();
		}
	};

	const get_users = async () => {
		get(globalConstants.get_user_to_chat, null, { username: txt }).then((res) => {
			setallnewusers(res.data);
		}).catch((err) => {
			console.log(err);
		});
	};

	useEffect(() => {
		get_users();
	}, []);

	const handleUserSelect = (user) => {
		if (selectedUsers.includes(user)) {
			setSelectedUsers(selectedUsers.filter((u) => u !== user));
		} else {
			setSelectedUsers([...selectedUsers, user]);
		}

	};

	const createGroup = () => {
		let list_of_user_ids = [];
		console.log(selectedUsers.length);
		selectedUsers.forEach((user) => {
			console.log("user:", user.id);
			list_of_user_ids.push(user.id);
		});
		post(globalConstants.group_chat.create_group, {
			"users_ids[]": list_of_user_ids,
			name: groupName,
		}).then((res) => {
			console.log("res:", res);
			navigation.navigate("AllGroup");
		}).catch((err) => {
			console.log(err);
		});
	};

	return (
		<SafeAreaView style={styles.container}>
			<GoBack text={"Add New Group"} />
			<View style={style.searchView}>
				<TextInput
					placeholder="Search ...."
					value={txt}
					onChangeText={handleTextChange}
					placeholderTextColor={"#808080"}
					style={{ color: "#000000" }}
				/>
				<TouchableOpacity onPress={() => {
					get_users();
				}}>
					<FontAwesome name="search" size={26} color="grey" />
				</TouchableOpacity>
			</View>

			<FlatList
				data={allnewusers}
				renderItem={({ item }) => (
					<ContactGroupListItem user={item} onSelect={() => handleUserSelect(item)}
										  isSelected={selectedUsers.includes(item)} />
				)}
				style={{ backgroundColor: "#FFFFFF" }}
				showsVerticalScrollIndicator={false}
				keyExtractor={(item) => item.id.toString()}
			/>

			<View style={style.buttonContainer}>

				<TextInput placeholder="Enter Group Name" onChangeText={(e) => {
					setGroupName(e);
				}} />
				<Button title="Create Group" onPress={createGroup} />
			</View>
		</SafeAreaView>
	);
};

export default AddGroup;

const style = StyleSheet.create({
	mainview: {
		width: "90%",
		alignSelf: "center",
		backgroundColor: "#fff",
		borderRadius: 15,
		top: -20,
	},
	searchView: {
		width: "90%",
		backgroundColor: "#fff",
		alignSelf: "center",
		marginTop: 15,
		borderRadius: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 3,
		borderWidth: 1,
		borderColor: "grey",
		height: 45,
	},
	buttonContainer: {
		width: "90%",
		alignSelf: "center",
		marginVertical: 20,
	},
});
