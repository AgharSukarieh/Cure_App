import React, { useState, useEffect, useCallback } from "react";
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
  ActivityIndicator,
  RefreshControl
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from '@react-navigation/native';
import AddFriendModal from "../../components/AddFriendModel";
import { useAuth } from "../../contexts/AuthContext";
import { usePusher } from "../../contexts/PusherContext";
import { get } from "../../WebService/RequestBuilder";
import globalConstants from "../../config/globalConstants";

const getSingleConvEndpoint = globalConstants.single_chat.get_conv;
const getGroupConvEndpoint = globalConstants.group_chat.get_conv;

const formatTime = (dateString) => {
  if (!dateString) return 'Now';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Now';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

const ChatItem = ({ chat, navigation }) => {
  console.log('🖼️ Chat Image Info:', {
    chatId: chat.id,
    chatName: chat.name,
    isGroup: chat.isGroup,
    avatar: chat.avatar,
    profile_image: chat.profile_image,
    group_avatar: chat.group_avatar,
    senderProfileImage: chat.sender?.medicals?.profile_image,
    lastMessageSenderProfileImage: chat.last_message?.sender?.medicals?.profile_image,
    messageSenderProfileImage: chat.message?.sender?.medicals?.profile_image
  });

  return (
  <TouchableOpacity style={styles_chat.chatItem} onPress={() => {
    if (chat.isGroup) {
      navigation.navigate("ChatScreen", { 
        id: chat.id,
        name: chat.name || chat.title,
        user_id: chat.id, 
        isGroup: true,
        chatData: chat
      });
    } else {
      navigation.navigate("ChatScreen", { 
        id: chat.id,
        name: chat.name || chat.title,
        user_id: chat.user_id || chat.partner_id,
        isGroup: false,
        chatData: chat
      });
    }
  }}>
    <View style={styles_chat.avatarContainer}>
      <Image 
        source={
          chat.profile_image_url && chat.profile_image_url !== null
            ? { uri: chat.profile_image_url }
            : chat.isGroup 
              ? require("../../../assets/images/avatar.png")
              : require("../../../assets/user.png")
        } 
        style={styles_chat.avatar} 
      />
      {chat.isGroup ? (
        <View style={styles_chat.groupIndicator}>
          <Icon name="users" size={12} color="#fff" />
        </View>
      ) : (
        chat.online && <View style={styles_chat.onlineIndicator} />
      )}
    </View>
    <View style={styles_chat.chatContent}>
      <View style={styles_chat.chatHeader}>
        <Text style={styles_chat.chatName}>
          {chat.name || chat.title}
          {chat.isGroup && " 👥"}
        </Text>
        <Text style={styles_chat.chatTime}>
          {formatTime(chat.last_message_time || chat.time)}
        </Text>
      </View>
      <View style={styles_chat.messageContainer}>
        <Text style={styles_chat.chatMessage} numberOfLines={1}>
          {typeof chat.last_message === 'string' 
            ? chat.last_message 
            : typeof chat.message === 'string' 
              ? chat.message 
              : chat.last_message?.text || chat.message?.text || 'آخر رسالة'
          }
        </Text>
        {chat.unread_count > 0 && (
          <View style={styles_chat.unreadBadge}>
            <Text style={styles_chat.unreadText}>{chat.unread_count}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
  );
};

const ChatsScreen = () => {
  const [searchText, setSearchText] = useState("");
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const [showDropdown, setShowDropdown] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  
  const { user } = useAuth();
  const { data, dataForGroup } = usePusher() || {};
  
  const [chats, setChats] = useState([]);
  const [page, setPage] = useState(1);
  const [groupPage, setGroupPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasMoreGroups, setHasMoreGroups] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [isAddFriendModalVisible, setAddFriendModalVisible] = useState(false);

 
  const getSingleChats = useCallback(async (pageNum = 1) => {
    try {
      console.log('🔍 جلب المحادثات الفردية - الصفحة:', pageNum);
      const res = await get(getSingleConvEndpoint, null, { page: pageNum });
      
      
      console.log('📊 Single Chats Response:');
      console.log('Full Response:', JSON.stringify(res, null, 2));
      console.log('Response Data:', res?.data);
      console.log('Data Type:', typeof res?.data);
      console.log('Is Array:', Array.isArray(res?.data));
      console.log('Data Length:', res?.data?.length);
      
      if (res && res.data && Array.isArray(res.data)) {
        const formattedChats = res.data
          .filter(chat => chat && chat.id)
          .map(chat => ({
            id: chat.id || chat.chat_id,
            name: chat.name || chat.title || chat.partner_name,
            title: chat.title,
            message: chat.last_message,
            last_message: chat.last_message,
            time: formatTime(chat.last_message_time || chat.updated_at),
            last_message_time: chat.last_message_time || chat.updated_at,
            avatar:  chat.profile_image || chat.partner_avatar,
            unread: chat.unread_count || 0,
            unread_count: chat.unread_count || 0,
            online: chat.is_online || chat.status === 'online',
            isOnline: chat.is_online || chat.status === 'online',
            status: chat.status,
            user_id: chat.user_id || chat.partner_id,
            partner_id: chat.partner_id,
            isGroup: false,
            ...chat
          }));

       
        console.log('📋 Formatted Single Chats:');
        console.log('Formatted Chats:', JSON.stringify(formattedChats, null, 2));
        console.log('Formatted Chats Count:', formattedChats.length);
        console.log('First Chat:', formattedChats[0]);

        return formattedChats;
      }
    } catch (err) {
      console.log('Error fetching single chats:', err);
    }
    return [];
  }, []);

  
  const getGroupChats = useCallback(async (pageNum = 1) => {
    try {
      console.log('🔍 جلب المحادثات الجماعية - الصفحة:', pageNum);
      const res = await get(getGroupConvEndpoint, null, { page: pageNum });
      
    
      console.log('📊 Group Chats Response:');
      console.log('Full Response:', JSON.stringify(res, null, 2));
      console.log('Response Data:', res?.data);
      console.log('Data Type:', typeof res?.data);
      console.log('Is Array:', Array.isArray(res?.data));
      console.log('Data Length:', res?.data?.length);
      
      if (res && res.data && Array.isArray(res.data)) {
        const formattedChats = res.data
          .filter(chat => chat && chat.id)
          .map(chat => ({
            id: chat.id || chat.chat_id,
            name: chat.name || chat.title || chat.group_name,
            title: chat.title,
            message: chat.last_message,
            last_message: chat.last_message,
            time: formatTime(chat.last_message_time || chat.updated_at),
            last_message_time: chat.last_message_time || chat.updated_at,
            avatar: chat.avatar || chat.group_avatar || chat.profile_image,
            unread: chat.unread_count || 0,
            unread_count: chat.unread_count || 0,
            online: true, 
            isOnline: true,
            status: 'online',
            user_id: chat.created_by || chat.admin_id,
            isGroup: true,
            members_count: chat.members_count || chat.participants_count,
            ...chat
          }));

     
        console.log('📋 Formatted Group Chats:');
        console.log('Formatted Chats:', JSON.stringify(formattedChats, null, 2));
        console.log('Formatted Chats Count:', formattedChats.length);
        console.log('First Chat:', formattedChats[0]);

        return formattedChats;
      }
    } catch (err) {
      console.log('Error fetching group chats:', err);
    }
    return [];
  }, []);

 
  const getAllChats = useCallback(async (pageNum = 1, isLoadMore = false) => {
    if (isLoadMore) {
      if ((!hasMore && !hasMoreGroups) || isLoadingMore) return;
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      console.log('🚀 جلب جميع المحادثات - الصفحة:', pageNum, 'Load More:', isLoadMore);
      
     
      const [singleChats, groupChats] = await Promise.all([
        getSingleChats(pageNum),
        getGroupChats(pageNum)
      ]);

     
      console.log('📊 Final Results:');
      console.log('Single Chats:', singleChats);
      console.log('Group Chats:', groupChats);
      console.log('Single Chats Count:', singleChats?.length);
      console.log('Group Chats Count:', groupChats?.length);

      const allChats = [...singleChats, ...groupChats];
      
      console.log('📋 All Chats Combined:');
      console.log('All Chats:', JSON.stringify(allChats, null, 2));
      console.log('All Chats Count:', allChats.length);

     
      const sortedChats = allChats.sort((a, b) => {
        const timeA = new Date(a.last_message_time || a.time || 0);
        const timeB = new Date(b.last_message_time || b.time || 0);
        return timeB - timeA;
      });

      if (pageNum === 1) {
        setChats(sortedChats);
      } else {
        setChats(prev => [...prev, ...sortedChats]);
      }
      
     
      const hasMoreSingle = singleChats.length >= 10;
      const hasMoreGroup = groupChats.length >= 10;
      setHasMore(hasMoreSingle);
      setHasMoreGroups(hasMoreGroup);

    } catch (err) {
      console.log('Error fetching all chats:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setRefreshing(false);
    }
  }, [hasMore, hasMoreGroups, isLoadingMore, getSingleChats, getGroupChats]);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setGroupPage(1);
    setHasMore(true);
    setHasMoreGroups(true);
    getAllChats(1);
  };

  const loadMoreChats = () => {
    if (!isLoadingMore && (hasMore || hasMoreGroups)) {
      const nextPage = page + 1;
      const nextGroupPage = groupPage + 1;
      setPage(nextPage);
      setGroupPage(nextGroupPage);
      getAllChats(nextPage, true);
    }
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles_chat.loadingFooter}>
        <ActivityIndicator size="small" color="#183E9F" />
        <Text style={styles_chat.loadingText}>Loading more chats...</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    
    return (
      <View style={styles_chat.emptyContainer}>
        <Icon name="message-circle" size={64} color="#DDD" />
        <Text style={styles_chat.emptyTitle}>No chats yet</Text>
        <Text style={styles_chat.emptyText}>
          Start a conversation by adding a friend or creating a group
        </Text>
      </View>
    );
  };


  useEffect(() => {
    if (data || dataForGroup) {
      console.log('🔄 تحديث المحادثات من Pusher:', { data, dataForGroup });
      setPage(1);
      setGroupPage(1);
      getAllChats(1);
    }
  }, [data, dataForGroup]);

 
  useFocusEffect(
    useCallback(() => {
      getAllChats(1);
    }, [getAllChats])
  );

  
  useEffect(() => {
    if (route.params?.newGroup) {
      const newGroup = route.params.newGroup;
      const newChatItem = {
        id: newGroup.id,
        name: newGroup.name,
        message: t('chatsScreen.groupCreated'),
        last_message: t('chatsScreen.groupCreated'),
        time: "Now",
        last_message_time: new Date().toISOString(),
        avatar: newGroup.avatar,
        unread: 0,
        unread_count: 0,
        online: true,
        isOnline: true,
        isGroup: true,
        members_count: newGroup.members?.length || 1
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
      last_message: t('chatsScreen.contactAdded', { name: newContact.name }),
      time: "Now",
      last_message_time: new Date().toISOString(),
      avatar: newContact.avatar,
      unread: 0,
      unread_count: 0,
      online: false,
      isOnline: false,
      isGroup: false
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
              navigation.navigate("ContactChat");
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

      {isLoading && chats.length === 0 ? (
        <View style={styles_chat.loadingContainer}>
          <ActivityIndicator size="large" color="#183E9F" />
          <Text style={styles_chat.loadingText}>Loading chats...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredChats}
          renderItem={({ item }) => <ChatItem chat={item} navigation={navigation} />}
          keyExtractor={(item) => `${item.isGroup ? 'group' : 'single'}_${item.id}`}
          style={styles_chat.chatList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#183E9F"]}
              tintColor="#183E9F"
            />
          }
          onEndReached={loadMoreChats}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
        />
      )}

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
  groupIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    backgroundColor: "#6B46C1",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ChatsScreen;