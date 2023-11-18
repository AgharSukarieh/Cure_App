import React from 'react';
import { Text, View, Image, StyleSheet, Pressable } from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { useAuth } from '../../contexts/AuthContext';
Ionicons.loadFont();
dayjs.extend(relativeTime);

const ChatListItem = ({ chat, func }) => {
  const {user} = useAuth()
  var lastSeen = chat?.last_message?.sender_id == user.id ? '2023-11-17' : chat?.last_message?.seen_at;

  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() =>
        {
          navigation.navigate('ChatScreen', {
          id: chat?.id,
          name: chat?.name,
          user_id: chat?.user_id,
          func: func
        })
        // lastSeen = ''
      }
      }
      style={styles.container}>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}> {chat?.name} </Text>
          {lastSeen
            ?
            <View/>
            :
            <View style={{ width: 8, height: 8, borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor:'blue' }}/>
          }
        </View>
        <View style={{ ...styles.row, justifyContent: 'space-between' }}>
          <Text numberOfLines={2} style={{color: lastSeen ? 'gray' : 'black', fontWeight: lastSeen ? '400' : 'bold', marginLeft: 7, }}>
            {chat?.last_message?.text || 'attachments'}
          </Text>

          <Text style={{...styles.subTitle,color: lastSeen ? 'gray' : 'black', fontWeight: lastSeen ? '400' : 'bold'}}>
            {dayjs(moment.utc(chat?.updated_at).local().format()).fromNow(true)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ChatListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  content: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'lightgray',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  name: {
    flex: 1,
    fontWeight: 'bold',
    // color: 'black'
  },
  subTitle: {
    color: 'gray',
  },
});
