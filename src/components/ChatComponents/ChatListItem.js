import React from 'react';
import { Text, View, Image, StyleSheet, Pressable } from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

dayjs.extend(relativeTime);
import moment from 'moment';

const ChatListItem = ({ chat, currentUser }) => {

  const currentTime = new Date();
  const timeDifference = (currentTime - chat?.updated_at) / (1000 * 60 * 60); // Time difference in hours
  const isMessageRead = timeDifference >= 2;
  console.log('isMessageRead', isMessageRead);
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() =>
        navigation.navigate('ChatScreen', {
          id: chat?.id,
          name: chat?.name,
          currentUser
        })
      }
      style={styles.container}>
      <Image source={chat?.image ? { uri: chat?.image } : require('../../../assets/user.png')} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}> {chat?.name} </Text>
          <Text style={styles.subTitle}>
            {dayjs(moment.utc(chat?.updated_at).local().format()).fromNow(true)}
          </Text>
        </View>
        <View style={{ ...styles.row, justifyContent: 'space-between' }}>
          <Text numberOfLines={2} style={styles.subTitle}>
            {chat?.last_message?.text || 'attachments'}
          </Text>
          {isMessageRead
            ?
            <View style={{ backgroundColor: '#323FA6', width: 22, height: 22, borderRadius: 99, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#fff' }}>1</Text>
            </View>
            :
            <View style={{ width: 22, height: 22, borderRadius: 99, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name='checkmark-done-outline' color='blue' size={22} />
            </View>
          }

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
  },
  subTitle: {
    color: 'gray',
  },
});
