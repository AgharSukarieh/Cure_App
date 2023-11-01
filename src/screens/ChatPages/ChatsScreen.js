import ChatListItem from '../../components/ChatComponents/ChatListItem';
import React, { useEffect, useState } from 'react';
// import { chatListDemo } from '../../DemoData';
import { FlatList, SafeAreaView } from 'react-native';
// import {
//   Pusher,
//   PusherMember,
//   PusherChannel,
//   PusherEvent,
// } from '@pusher/pusher-websocket-react-native';
import GoBack from '../../components/GoBack';
import { styles } from '../../components/styles';
import { useNavigation } from '@react-navigation/native';
import TableView from '../../General/TableView';
import globalConstants from '../../config/globalConstants';
import { useAuth } from '../../contexts/AuthContext';
import { usePusher } from '../../contexts/PusherContext';
// import axios from 'axios';
// import { GET_USER_CHATS } from '../../Provider/ApiRequest';
// import { Text } from 'react-native';
// import { get } from '../../WebService/RequestBuilder';

// import { Pusher, PusherEvent } from '@pusher/pusher-websocket-react-native';
// const apiKey = '7d3cf02011bb653450a0';
// const cluster = 'mt1';
// const pusher = new Pusher({
//   apiKey,
//   cluster
// });

const ChatsScreen = () => {
  const getConvEndpoint = globalConstants.single_chat.get_conv;
  const navigation = useNavigation();
  // const pusher = Pusher.getInstance();
  const { user } = useAuth();
  const {dataConv} = usePusher();
  const [messId, setmessId] = useState(0);
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
  //       let newMessage = JSON.parse(event.data)
  //       if (user.id == newMessage.receiver_id || user.id == newMessage.sender_id) {
  //         console.log('***********');
  //           setmessId(); 
  //           setmessId(user.id); 
  //       }
  //     }
  //   });
  //   // console.log(pusher.connectionState);
  // }

  // useEffect(() => {
  //   sendpusher()
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      <GoBack text={'Chats'} addButton addButtonFunc={() => {
        navigation.navigate('ContactsScreen')
        }} />
      <TableView
          apiEndpoint={getConvEndpoint}
          enablePullToRefresh
          params={{id: messId}}
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

