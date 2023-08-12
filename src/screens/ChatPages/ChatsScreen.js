import ChatListItem from '../../components/ChatComponents/ChatListItem';
import React, { useEffect, useState } from 'react';
import { chatListDemo } from '../../DemoData';
import { FlatList, SafeAreaView } from 'react-native';
import {
  Pusher,
  PusherMember,
  PusherChannel,
  PusherEvent,
} from '@pusher/pusher-websocket-react-native';

import GoBack from '../../components/GoBack';
import { styles } from '../../components/styles';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { GET_USER_CHATS } from '../../Provider/ApiRequest';
import { Text } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

const ChatsScreen = ({ userData }) => {

  const navigation = useNavigation();
  const pusher = Pusher.getInstance();
  const { user, token } = useAuth();
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
        getChats()
      }
    });
    // console.log(pusher.connectionState);
  }

  const [chats, setChats] = useState([]);
  // console.log('token', chats);
  const getChats = () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: GET_USER_CHATS + `?current_user_id=${user.id}`,
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    };
    axios.request(config)
      .then((response) => {
        setChats(response.data.users);
      })
      .catch((error) => {
        console.log(error);
      });

  }

  useEffect(() => {
    getChats();
  }, [])
  
  return (
    <SafeAreaView style={styles.container}>
      <GoBack text={'Chats'} addButton addButtonFunc={() => navigation.navigate('ContactsScreen', { currentUser: userData.id })} />
      <FlatList
        data={chats}
        renderItem={({ item }) => <ChatListItem chat={item} currentUser={user.id} />}
        style={{ backgroundColor: 'white' }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default ChatsScreen;
