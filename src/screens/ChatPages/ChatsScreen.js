import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  FlatList,
  I18nManager,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AddFriendModal from "../../components/AddFriendModel";

const INITIAL_CHATS = [
  {
    id: "1",
    name: "David Wayne",
    title: "محادثة مع ديفيد",
    message: "Thanks a bunch! Have a great day 😊",
    time: "10:25",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    unread: 3,
    online: true,
    isOnline: true,
    status: "online",
    messages: [
      { id: 1, message: "مرحباً! كيف حالك؟", sender_id: 2, created_at: "2023-10-27T10:00:00Z" },
      { id: 2, message: "Thanks a bunch! Have a great day 😊", sender_id: 1, created_at: "2023-10-27T10:25:00Z" }
    ]
  },
  {
    id: "2",
    name: "Edward Davidson",
    title: "محادثة مع إدوارد",
    message: "Great, thanks so much!",
    time: "22:20 09/05",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    unread: 0,
    online: false,
    isOnline: false,
    status: "offline",
    messages: [
      { id: 1, message: "Great, thanks so much!", sender_id: 1, created_at: "2023-10-26T22:20:00Z" }
    ]
  },
  {
    id: "3",
    name: "Angela Kelly",
    title: "محادثة مع أنجيلا",
    message: "Appreciate it! See you soon! ❤️",
    time: "10:45 08/05",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    unread: 1,
    online: true,
    isOnline: true,
    status: "online",
    messages: [
      { id: 1, message: "Appreciate it! See you soon! ❤️", sender_id: 1, created_at: "2023-10-25T10:45:00Z" }
    ]
  },
];

const ChatItem = ({ chat , navigation }) => (
  <TouchableOpacity style={styles_chat.chatItem} onPress={() => navigation.navigate("ChatScreen" , { chat: chat })}>
    <View style={styles_chat.avatarContainer}>
      <Image source={{ uri: chat.avatar }} style={styles_chat.avatar} />
      {chat.online && <View style={styles_chat.onlineIndicator} />}
    </View>
    <View style={styles_chat.chatContent}>
      <View style={styles_chat.chatHeader}>
        <Text style={styles_chat.chatName}>{chat.name}</Text>
        <Text style={styles_chat.chatTime}>{chat.time}</Text>
      </View>
      <View style={styles_chat.messageContainer}>
        <Text style={styles_chat.chatMessage} numberOfLines={1}>
          {chat.message}
        </Text>
        {chat.unread > 0 && (
          <View style={styles_chat.unreadBadge}>
            <Text style={styles_chat.unreadText}>{chat.unread}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const ChatsScreen = () => {
  const [searchText, setSearchText] = useState("");
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const [showDropdown, setShowDropdown] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const [chats, setChats] = useState(INITIAL_CHATS);

  const [isAddFriendModalVisible, setAddFriendModalVisible] = useState(false);

  useEffect(() => {
    if (route.params?.newGroup) {
      const newGroup = route.params.newGroup;
      const newChatItem = {
        id: newGroup.id,
        name: newGroup.name,
        message: t('chatsScreen.groupCreated'),
        time: "Now",
        avatar: newGroup.avatar,
        unread: 0,
        online: true,
      };
      setChats((prevChats) => [newChatItem, ...prevChats]);
      navigation.setParams({ newGroup: undefined });
    }
  }, [route.params?.newGroup]);

  const handleAddNewContact = (newContact) => {
    console.log("Received new contact in ChatsScreen:", newContact);
    const newChatItem = {
      id: newContact.id,
      name: newContact.name,
      message: t('chatsScreen.contactAdded', { name: newContact.name }),
      time: "Now",
      avatar: newContact.avatar,
      unread: 0,
      online: false, 
    };
    setChats((prevChats) => [newChatItem, ...prevChats]);
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles_chat.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles_chat.header}>
        <Text style={[styles_chat.headerTitle, isRTL && styles_chat.rtlText]}>
          {t("chatsScreen.header") || "Chats"}
        </Text>
      </View>

      <View style={styles_chat.searchContainer}>
        <View style={styles_chat.searchBar}>
          <Text style={styles_chat.searchIcon}>🔍</Text>
          <TextInput
            style={[styles_chat.searchInput, isRTL && styles_chat.rtlText]}
            placeholder={t("chatsScreen.searchPlaceholder") || "Search..."}
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <TouchableOpacity
          style={styles_chat.addButton}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Icon name={showDropdown ? "x" : "plus"} size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {showDropdown && (
        <View style={styles_chat.dropdown}>
     
          <TouchableOpacity
            style={[styles_chat.optiones]}
            onPress={() => {
              setShowDropdown(false);
              setAddFriendModalVisible(true);
            }}
          >
            <Image
              source={require("../../../assets/icons/add_person.png")}
              style={styles_chat.logo}
            />
            <Text style={[styles_chat.TextOptions, isRTL && styles_chat.rtlText]}>
              {t("chatsScreen.addFriend") || "Add Friend"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles_chat.optiones}
            onPress={() => {
              setShowDropdown(false);
              navigation.navigate("AddGroup");
            }}
          >
            <Image
              source={require("../../../assets/icons/group.png")}
              style={styles_chat.logo}
            />
            <Text style={[styles_chat.TextOptions, isRTL && styles_chat.rtlText]}>
              {t("chatsScreen.createGroup") || "Create Group"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredChats}
        renderItem={({ item }) => <ChatItem chat={item} navigation={navigation} />}
        keyExtractor={(item) => item.id}
        style={styles_chat.chatList}
        showsVerticalScrollIndicator={false}
      />

   
      <AddFriendModal
        visible={isAddFriendModalVisible}
        onClose={() => setAddFriendModalVisible(false)}
        onAddContact={handleAddNewContact}
      />
    </SafeAreaView>
  );
};


const styles_chat = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#183E9F",
    marginBottom: 5,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#C7CCCD",
    paddingHorizontal: 15,
    paddingVertical: 2,
    marginRight: 10,
  },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: "#333", height: 45 },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: "#183E9F",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    position: "absolute",
    top: 140,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 10,
    padding: 18,
  },
  chatList: { flex: 1, paddingHorizontal: 20 },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatarContainer: { position: "relative", marginRight: 15 },
  avatar: { width: 50, height: 50, borderRadius: 25, resizeMode: "cover" },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: "#10B981",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  chatContent: { flex: 1 },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  chatName: { fontSize: 16, fontWeight: "600", color: "#333" },
  chatTime: { fontSize: 12, color: "#999" },
  messageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatMessage: { flex: 1, fontSize: 14, color: "#666", marginRight: 10 },
  unreadBadge: {
    backgroundColor: "#6B46C1",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  logo: { width: 24, height: 24, marginRight: 10 },
  TextOptions: { color: "#000000ff" },
  optiones: { flexDirection: "row", marginTop: 10 },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

export default ChatsScreen;
