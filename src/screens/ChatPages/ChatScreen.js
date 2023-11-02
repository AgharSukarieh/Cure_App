import {
  ImageBackground,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
  SafeAreaView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import bg from '../../../assets/BG.png'
import Message from '../../components/ChatComponents/Message';
import InputBox from '../../components/ChatComponents/InputBox';
import GoBack from '../../components/GoBack';
import { useAuth } from '../../contexts/AuthContext';
import globalConstants from '../../config/globalConstants';
import { usePusher } from '../../contexts/PusherContext';
import { get } from '../../WebService/RequestBuilder';
const getMessagesEndpoint = globalConstants.single_chat.get_mess;
const putSeenMessagesEndpoint = globalConstants.single_chat.seen_chat

const ChatScreen = ({ route, navigation }) => {
  const { id, name, user_id, func} = route.params;
  const { user } = useAuth();
  const {data} = usePusher();
  const [chats, setChats] = useState([]);
  const [page, setPage] = useState(1);

  const [chatIdNew, setchatIdNew] = useState(id);

  const getChats = (page) => {
    get(getMessagesEndpoint, null, {page: page, chat_id: chatIdNew}).then((res) => {
      if (chats?.length > 0) {
        if (!(page > 1)) {
          setChats([])
        }
        setChats((prev) => [...prev, ...res.data]);
      }else {
        setChats(res.data)
      }
    }).catch((err) => {

    })
  }

  const putSeen = () => {
    if (chatIdNew) {
      get(putSeenMessagesEndpoint, null, {chat_id: chatIdNew}).then((res) => {
        func()
      }).catch((err) => {

      })
    }
  }

  useEffect(() => {
    setChats((prev) => [...prev])
    setPage(1)
    getChats(1)
    putSeen()
  }, [data, chatIdNew]);

  return (
    <SafeAreaView style={{width: '100%', height: '100%',}}>
      <GoBack text={name} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 70}
        style={styles.bg}>
       
      <ImageBackground source={bg} style={styles.bg}>
        <FlatList 
        data={chats}
        inverted
        renderItem={({ item }) => <Message message={item} currentUserId={user?.id} />}
        keyExtractor={(item, index) => index.toString()}
        style={{ backgroundColor: 'white' }}
        onEndReached={() => 
          {
            setPage(page + 1)
            getChats(page + 1)
          }}
        showsVerticalScrollIndicator={false}
      />
        <InputBox receiverID={user_id} submit={(ids) => {
          if (chatIdNew == null) {
            console.log(ids);
            setchatIdNew(ids);
          }
        }}/>

      </ImageBackground>
      
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  list: {
  },
});

export default ChatScreen;
