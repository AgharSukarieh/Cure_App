import React, { useEffect, useState } from 'react';
import { styles } from '../../components/styles';
import {
  SafeAreaView,
} from 'react-native';
import GoBack from '../../components/GoBack';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import TableView from '../../General/TableView';
import globalConstants from '../../config/globalConstants';
import ChatGroupListItem from '../../components/ChatComponents/ChatGroupListItem';
// import {
//   Pusher,
//   PusherMember,
//   PusherChannel,
//   PusherEvent,
// } from '@pusher/pusher-websocket-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { usePusher } from '../../contexts/PusherContext';
const getConvEndpoint = globalConstants.group_chat.get_conv;

const AllGroups = () => {
  // const pusher = Pusher.getInstance();
  const { user } = useAuth();
  const {data} = usePusher();
  const [messId, setmessId] = useState(0);

  // const sendpusher = async () => {
  //   await pusher.init({
  //     apiKey: "7d3cf02011bb653450a0",
  //     cluster: "mt1"
  //   });
  //   console.log(pusher.connectionState);
  //   // await pusher.connect();
  //   await pusher.subscribe({
  //     channelName: "pharmaceuticals",
  //     onEvent: (event: PusherEvent) => {
  //       console.log('55555555555555555');
  //       console.log(`Event received: ${event}`);
  //       // let newMessage = JSON.parse(event.data)
  //       // if (user.id == newMessage.receiver_id || user.id == newMessage.sender_id) {
  //       //   console.log('***********');
  //           setmessId(); 
  //           setmessId(user.id); 
  //       // }
  //     }
  //   });
  //   // console.log(pusher.connectionState);
  // }

  // useEffect(() => {
  //   sendpusher()
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      <GoBack text={'Groups'} />
      
      {/* <FlatList
        data={data}
        renderItem={({ item }) => <ChatGroupListItem item={item} />}
        style={{ backgroundColor: 'white' }}
        showsVerticalScrollIndicator={false}
      /> */}

      <TableView
          apiEndpoint={getConvEndpoint}
          enablePullToRefresh
          params={{id: messId}}
          renderItem={({ item }) => <ChatGroupListItem item={item}/>}
        />
    </SafeAreaView>
  );
};

export default AllGroups;
