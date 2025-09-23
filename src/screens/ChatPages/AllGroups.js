import React, { useEffect, useState } from "react";
import { styles } from "../../components/styles";
import {
	FlatList,
	SafeAreaView,
} from "react-native";
import GoBack from "../../components/GoBack";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import globalConstants from "../../config/globalConstants";
import ChatGroupListItem from "../../components/ChatComponents/ChatGroupListItem";
import { useAuth } from "../../contexts/AuthContext";
import { get } from "../../WebService/RequestBuilder";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

dayjs.extend(relativeTime);
const getConvEndpoint = globalConstants.group_chat.get_conv;

const AllGroups = () => {
	const navigation = useNavigation();
	const { user } = useAuth();
	const [chats, setChats] = useState([]);
	const [page, setPage] = useState(1);

	const getChats = (page) => {
		get(getConvEndpoint, null, { page: page }).then((res) => {
			if (chats?.length > 0) {
				if (!(page > 1)) {
					setChats([]);
				}
				setChats((prev) => [...prev, ...res.data]);
			} else {
				setChats(res.data);
			}
			// console.log("chats", res);
		}).catch((err) => {
			console.log(err);
		});
	};


	const renderList = () => {
		setChats((prev) => [...prev]);
		setPage(1);
		getChats(1);
	};

	useEffect(() => {
		getChats(1);
	}, []);
	useFocusEffect(
		React.useCallback(() => {
			getChats(1);
		}, [])
	);
	return (
		<SafeAreaView style={styles.container}>
			<GoBack text={"Group"} addButton addButtonFunc={() => {
				navigation.navigate("AddGroup");
			}} />

			<FlatList
				data={chats}
				renderItem={({ item }) => <ChatGroupListItem item={item} func={renderList} />}
				keyExtractor={(item, index) => index.toString()}
				onEndReached={() => {
					setPage(page + 1);
					getChats(page + 1);
				}}
				showsVerticalScrollIndicator={false}
			/>
		</SafeAreaView>
	);
};

export default AllGroups;
