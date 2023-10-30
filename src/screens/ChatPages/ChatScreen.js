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
import { Text } from 'react-native';
import GoBack from '../../components/GoBack';
import TableView from '../../General/TableView';
import { useAuth } from '../../contexts/AuthContext';
import globalConstants from '../../config/globalConstants';
import { get } from '../../WebService/RequestBuilder';
const getMessagesEndpoint = globalConstants.single_chat.get_mess;

const ChatScreen = ({ route, navigation }) => {

  const { id, name } = route.params;
  const pusher = Pusher.getInstance();
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);

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

  
 
  // const getMessages = () => {
  //   let config = {
  //     method: 'get',
  //     maxBodyLength: Infinity,
  //     url: GET_CHAT_MESSAGES + `?current_user_id=${user.id}&another_user_id=${id}`,
  //     headers: {
  //       'Authorization': `Bearer ${token}`,
  //     }
  //   };

  //   axios.request(config)
  //     .then((response) => {
  //       setMessages(response.data.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });

  // }

  const getMessages = async () => {
    get(getMessagesEndpoint, null, {chat_id: id}).then((res)=> {
      setMessages(res.data);
    }).catch((err) => {
      console.log(err);
    })
  }

  useEffect(() => {
    getMessages();
  }, [])

  // useEffect(() => {
  //   navigation.setOptions({ title: name });
  // }, [name, navigation]);
  // console.log('-----',messages);

  return (
    <SafeAreaView style={{width: '100%', height: '100%',}}>
      <GoBack text={name} />
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 70}
      style={styles.bg}>
       
      {/* <View style={{ width: '100%', height: 70, backgroundColor: 'red' }}>
        <Text>name</Text> */}
      
      {/* </View> */}
      <ImageBackground source={bg} style={styles.bg}>
      {/* <TableView
          apiEndpoint={getMessagesEndpoint}
          enablePullToRefresh={false}
          params={{chat_id: id}}
          renderItem={({ item }) => <Message message={item} currentUserId={user?.id} />}
        /> */}
        <FlatList
          data={messages}
          renderItem={({ item }) => <Message message={item} currentUserId={user?.id} />}
          style={styles.list}
          inverted
          showsVerticalScrollIndicator={false}
        />
        <InputBox receiverID={id} submit={(newMessage) => {}}/>

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
