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
// import {
//   Pusher,
//   PusherMember,
//   PusherChannel,
//   PusherEvent,
// } from '@pusher/pusher-websocket-react-native';
import GoBack from '../../components/GoBack';
import TableView from '../../General/TableView';
import { useAuth } from '../../contexts/AuthContext';
import globalConstants from '../../config/globalConstants';
import { usePusher } from '../../contexts/PusherContext';
const getMessagesEndpoint = globalConstants.single_chat.get_mess;

const ChatScreen = ({ route, navigation }) => {
  const { id, name, user_id } = route.params;
  // const pusher = Pusher.getInstance();
  const { user } = useAuth();
  const {data} = usePusher();

  const [messId, setmessId] = useState(id);

  // const sendpusher = async () => {
  //   await pusher.init({
  //     apiKey: "7d3cf02011bb653450a0",
  //     cluster: "mt1"
  //   });
  //   await pusher.connect();
  //   await pusher.subscribe({
  //     channelName: "pharmaceuticals",
  //     onEvent: (event: PusherEvent) => {
  //       console.log(`Event received: ${event}`);
  //       let newMessage = JSON.parse(event.data)
  //       if (user.id == newMessage.receiver_id || user.id == newMessage.sender_id) {
  //         if(user_id == newMessage.receiver_id || user_id == newMessage.sender_id){
  //           console.log('my message', user.id);
  //           setmessId(); 
  //           setmessId(id); 
  //         }
  //       }
  //     }
  //   });
  // }

  // useEffect(() => {
  //   console.log("ssssssssssssssssssssss");
  //   sendpusher()
  // }, []);

  return (
    <SafeAreaView style={{width: '100%', height: '100%',}}>
      <GoBack text={name} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 70}
        style={styles.bg}>
       
      <ImageBackground source={bg} style={styles.bg}>
      {messId ? <TableView
          isInverted
          isNotChat={false}
          apiEndpoint={getMessagesEndpoint}
          enablePullToRefresh={false}
          params={{chat_id: messId}}
          renderItem={({ item }) => <Message message={item} currentUserId={user?.id} />}
        /> : <View style={{flex: 1}}/>}
        {/* <FlatList
          data={messages}
          renderItem={({ item }) => <Message message={item} currentUserId={user?.id} />}
          style={styles.list}
          inverted
          showsVerticalScrollIndicator={false}
        /> */}
        <InputBox receiverID={user_id} submit={(id) => {
          if (messId == null) {
            setmessId(id);
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
