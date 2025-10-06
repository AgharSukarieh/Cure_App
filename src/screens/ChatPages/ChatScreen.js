import {
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Keyboard,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import globalConstants from '../../config/globalConstants';
import { usePusher } from '../../contexts/PusherContext';
import { get } from '../../WebService/RequestBuilder';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Message from '../../components/ChatComponents/Message';
import InputBox from '../../components/ChatComponents/InputBox';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Colors = {
  primary: '#3660CC',
  accent: '#4B8DFA',
  background: '#F5F5F5',
  myMessage: '#C7DFFF',
  theirMessage: '#FFFFFF',
  text: '#000000',
  gray: '#8E8E93',
  online: '#4CAF50',
  offline: '#9E9E9E',
};

const ChatHeader = ({ partner, onBackPress, isLoading, isGroup }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <View style={styles.avatarContainer}>
          <Image 
            source={require('../../../assets/images/avatar.png')} 
            style={styles.avatar} 
          />
          {!isGroup && (
            <View style={[
              styles.statusIndicator,
              { backgroundColor: partner?.isOnline ? Colors.online : Colors.offline }
            ]} />
          )}
          {isGroup && (
            <View style={styles.groupIndicator}>
              <Ionicons name="people" size={10} color="white" />
            </View>
          )}
        </View>
        
        <View style={styles.headerTextContainer}>
          <Text style={styles.partnerName}>
            {partner?.name || 'Loading...'}
            {isGroup && ' 👥'}
          </Text>
          <Text style={styles.statusText}>
            {isLoading ? 'Loading...' : (
              isGroup ? `${partner?.membersCount || 'Group'}` : (partner?.isOnline ? 'Online' : 'Offline')
            )}
          </Text>
        </View>
      </View>
      
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="call-outline" size={22} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="videocam-outline" size={22} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="ellipsis-vertical" size={22} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ChatScreen = ({ route, navigation }) => {
  const { id, name, user_id, func, isGroup, chatData } = route.params;
  const { user } = useAuth();
  const { data, dataForGroup } = usePusher() || {};
  
  console.log('💬 ChatScreen params:', { id, name, user_id, isGroup, chatData });
  
  const [chats, setChats] = useState([]);
  const [page, setPage] = useState(1);
  const [chatIdNew, setChatIdNew] = useState(id);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  const flatListRef = useRef(null);

  // تحديد الـ endpoints بناءً على نوع المحادثة
  const getMessagesEndpoint = isGroup 
    ? globalConstants.group_chat.get_mess 
    : globalConstants.single_chat.get_mess;
    
  const putSeenMessagesEndpoint = isGroup 
    ? globalConstants.group_chat.seen_chat 
    : globalConstants.single_chat.seen_chat;

  const sendMessageEndpoint = isGroup
    ? globalConstants.group_chat.send_message
    : globalConstants.single_chat.send_message;
    
  console.log('🔗 ChatScreen endpoints:', {
    isGroup,
    getMessagesEndpoint,
    putSeenMessagesEndpoint,
    sendMessageEndpoint
  });

  const getChats = async (pageNum = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      console.log('📨 جلب الرسائل:', {
        endpoint: getMessagesEndpoint,
        chatId: chatIdNew,
        isGroup: isGroup,
        page: pageNum
      });
      
      // استخدام المعلمة الصحيحة بناءً على نوع المحادثة
      const params = isGroup 
        ? { page: pageNum, group_id: chatIdNew }
        : { page: pageNum, chat_id: chatIdNew };
      
      const res = await get(getMessagesEndpoint, null, params);

      console.log('📨 استجابة الرسائل:', res);

      if (res.data && Array.isArray(res.data)) {
        // عكس ترتيب الرسائل لعرضها من الأسفل إلى الأعلى
        const messages = [...res.data].reverse();
        
        if (pageNum === 1) {
          setChats(messages);
        } else {
          setChats(prev => [...messages, ...prev]);
        }
        
        // التحقق إذا كان هناك المزيد من الرسائل
        if (res.data.length < 20) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        // التمرير إلى الأسفل بعد تحميل الرسائل الجديدة
        if (pageNum === 1 && flatListRef.current) {
          setTimeout(() => {
            flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
          }, 100);
        }
      }
    } catch (err) {
      console.log('Error fetching chats:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const putSeen = async () => {
    if (chatIdNew) {
      try {
        // استخدام المعلمة الصحيحة بناءً على نوع المحادثة
        const params = isGroup 
          ? { group_id: chatIdNew }
          : { chat_id: chatIdNew };
        
        await get(putSeenMessagesEndpoint, null, params);
        if (func) func();
      } catch (err) {
        console.log('Error marking as seen:', err);
      }
    }
  };

  const loadMoreMessages = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      getChats(nextPage, true);
    }
  };

  const handleNewMessage = () => {
    // تحديد البيانات الحالية بناءً على نوع المحادثة
    const currentData = isGroup ? dataForGroup : data;
    console.log('🔄 تحديث الرسائل:', { 
      currentData, 
      chatIdNew, 
      id, 
      isGroup,
      data,
      dataForGroup
    });
    
    // التحقق إذا كانت الرسالة الجديدة تخص هذه المحادثة
    if (currentData) {
      const isRelevantMessage = isGroup 
        ? currentData.group_id == id || currentData.receiver_id == id
        : currentData.chat_id == id;
      
      if (isRelevantMessage) {
        console.log('🆕 رسالة جديدة للمحادثة الحالية، إعادة التحميل...');
        setPage(1);
        getChats(1);
        putSeen();
      }
    }
  };

  const handleChatIdUpdate = (newChatId) => {
    if (!chatIdNew && newChatId) {
      console.log('🆔 تحديث chatId:', newChatId);
      setChatIdNew(newChatId);
      // إعادة تحميل الرسائل بعد تعيين chatId جديد
      setTimeout(() => getChats(1), 100);
    }
  };

  // تحميل الرسائل عند فتح الشاشة أو تغيير chatId
  useEffect(() => {
    if (chatIdNew) {
      console.log('🚀 تحميل الرسائل الأولية');
      getChats(1);
      putSeen();
    }
  }, [chatIdNew]);

  // تحديث الرسائل عند استلام بيانات جديدة من Pusher
  useEffect(() => {
    console.log('📡 استقبال تحديث من Pusher');
    handleNewMessage();
  }, [data, dataForGroup]);

  // تحديث عند تغيير المعلمة isGroup
  useEffect(() => {
    if (chatIdNew) {
      console.log('🔄 تغيير نوع المحادثة، إعادة التحميل');
      getChats(1);
    }
  }, [isGroup]);

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading more messages...</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="chatbubble-ellipses-outline" size={64} color={Colors.gray} />
        <Text style={styles.emptyTitle}>No messages yet</Text>
        <Text style={styles.emptyText}>
          {isGroup 
            ? 'Start the conversation in this group' 
            : 'Start a conversation by sending a message'
          }
        </Text>
      </View>
    );
  };

  const partnerInfo = {
    name: name || 'Unknown',
    isOnline: true,
    membersCount: chatData?.members_count || chatData?.participants_count
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ChatHeader 
        partner={partnerInfo}
        onBackPress={() => navigation.goBack()}
        isLoading={isLoading}
        isGroup={isGroup}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        style={styles.container}
        enabled={true}
      >
        <View style={styles.messagesContainer}>
          {isLoading && chats.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading messages...</Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={chats}
              renderItem={({ item }) => (
                <Message 
                  message={item} 
                  currentUserId={user?.id} 
                  isGroup={isGroup}
                />
              )}
              keyExtractor={(item, index) => 
                item.id ? `${isGroup ? 'group' : 'single'}_${item.id}` : `message_${index}`
              }
              style={styles.messagesList}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
              onEndReached={loadMoreMessages}
              onEndReachedThreshold={0.1}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={renderEmpty}
              initialNumToRender={15}
              maxToRenderPerBatch={10}
              windowSize={11}
              removeClippedSubviews={true}
              inverted={false}
            />
          )}
        </View>

        <View style={[styles.inputContainer, { 
          paddingBottom: keyboardHeight > 0 ? 10 : 0,
          marginBottom: keyboardHeight > 0 ? 0 : 0
        }]}>
          <InputBox 
            receiverID={user_id} 
            getChat={getChats}
            submit={handleChatIdUpdate}
            chatId={chatIdNew}
            isGroup={isGroup}
            sendMessageEndpoint={sendMessageEndpoint}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  groupIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    backgroundColor: '#6B46C1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  partnerName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  statusText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'flex-end',
    minHeight: '100%',
  },
  inputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    position: 'relative',
    zIndex: 1000,
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
    color: Colors.gray,
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
    color: Colors.gray,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ChatScreen;