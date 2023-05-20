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

const ChatsScreen = ({ userData }) => {
  const navigation = useNavigation();
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
        getChats()
      }
    });
    // console.log(pusher.connectionState);
  }

  const [chats, setChats] = useState([]);

  const getChats = () => {
    axios({
      method: 'GET',
      url: GET_USER_CHATS,
      params: {
        user_id: userData.id
      },
    })
      .then(response => {
        // console.log(response.data.data);
        setChats(response.data.data);
      })
      .catch(error => {
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
        renderItem={({ item }) => <ChatListItem chat={item} currentUser={userData.id} />}
        style={{ backgroundColor: 'white' }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default ChatsScreen;
