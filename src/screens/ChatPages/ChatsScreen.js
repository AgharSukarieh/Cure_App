import ChatListItem from '../../components/ChatComponents/ChatListItem';
import React, { useEffect, useState } from 'react';
// import { chatListDemo } from '../../DemoData';
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
import TableView from '../../General/TableView';
import globalConstants from '../../config/globalConstants';
import { useAuth } from '../../contexts/AuthContext';
// import axios from 'axios';
// import { GET_USER_CHATS } from '../../Provider/ApiRequest';
// import { Text } from 'react-native';
// import { get } from '../../WebService/RequestBuilder';

const ChatsScreen = () => {
  const getConvEndpoint = globalConstants.single_chat.get_conv;
  const navigation = useNavigation();
  const pusher = Pusher.getInstance();
  const { user } = useAuth();
  // const [chats, setChats] = useState([]);
  // const sendpusher = async () => {
  //   await pusher.init({
  //     apiKey: "7d3cf02011bb653450a0",
  //     cluster: "mt1"
  //   });
  //   await pusher.connect();
  //   await pusher.subscribe({
  //     channelName: "pharmaceuticals",
  //     onEvent: (event: PusherEvent) => {
  //       console.log('222222222222222');
  //       console.log(`Event received: ${event}`);
  //       getChats()
  //     }
  //   });
  //   // console.log(pusher.connectionState);
  // }

  
  // console.log('token', chats);
  // const getChats = () => {
  //   let config = {
  //     method: 'get',
  //     maxBodyLength: Infinity,
  //     url: GET_USER_CHATS + `?current_user_id=${user.id}`,
  //     headers: {
  //       'Authorization': `Bearer ${token}`,
  //     }
  //   };
  //   axios.request(config)
  //     .then((response) => {
  //       setChats(response.data.users);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  // const getChats = async () => {
  //   get(getConvEndpoint, null, null).then((res)=> {
  //     setChats(res.data);
  //   }).catch((err) => {
  //     console.log(err);
  //   })
  // }

  // useEffect(() => {
  //   getChats();
  // }, [])

  // useEffect(() => {
  //   sendpusher()
  // }, []);
  
  return (
    <SafeAreaView style={styles.container}>
      <GoBack text={'Chats'} addButton addButtonFunc={() => navigation.navigate('ContactsScreen')} />
      <TableView
          apiEndpoint={getConvEndpoint}
          enablePullToRefresh
          renderItem={({ item }) => <ChatListItem chat={item}/>}
        />

      {/* <FlatList 
        data={chats}
        renderItem={({ item }) => <ChatListItem chat={item} />}
        style={{ backgroundColor: 'white' }}
        showsVerticalScrollIndicator={false}
      /> */}

    </SafeAreaView>
  );
};

export default ChatsScreen;
