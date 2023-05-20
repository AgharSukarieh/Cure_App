import {
  ImageBackground,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import bg from '../../../assets/BG.png'
import { messagesListDemo } from '../../messages';
import Message from '../../components/ChatComponents/Message';
import InputBox from '../../components/ChatComponents/InputBox';
import { GET_CHAT_MESSAGES } from '../../Provider/ApiRequest';
import axios from 'axios';
import {
  Pusher,
  PusherMember,
  PusherChannel,
  PusherEvent,
} from '@pusher/pusher-websocket-react-native';

const ChatScreen = ({ route, navigation }) => {

  const pusher = Pusher.getInstance();

  const sendpusher = async () => {

    await pusher.init({
      apiKey: "7d3cf02011bb653450a0",
      cluster: "mt1"
    });
    await pusher.connect();
    await pusher.subscribe({
      channelName: "pharmaceuticals",
      onEvent: (event: PusherEvent) => {
        console.log('222222222222222');
        console.log(`Event received: ${event}`);
        getMessages()
      }
    });
    // console.log(pusher.connectionState);
  }

  useEffect(() => {
    sendpusher()
  }, []);

  const { id, name, currentUser } = route.params;
  const [messages, setMessages] = useState([]);

  const getMessages = () => {
    axios({
      method: 'GET',
      url: GET_CHAT_MESSAGES,
      params: {
        receiver_id: id,
        sender_id: currentUser
      },
    })
      .then(response => {
        // console.log('asd',response.data.data);
        setMessages(response.data.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  useEffect(() => {
    getMessages();
  }, [])

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [name, navigation]);
  // console.log('-----',messages);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 70 : 140}
      style={styles.bg}>
      <ImageBackground source={bg} style={styles.bg}>
        <FlatList
          data={messages}
          renderItem={({ item }) => <Message message={item} currentUserId={currentUser} />}
          style={styles.list}
          inverted
          showsVerticalScrollIndicator={false}
        />
        <InputBox currentUserId={currentUser} receiverID={id} submit={(msg) => {
          setMessages([msg, ...messages])
        }} />
      </ImageBackground>
    </KeyboardAvoidingView>
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
