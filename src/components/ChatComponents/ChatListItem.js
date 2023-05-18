import React from 'react';
import {Text, View, Image, StyleSheet, Pressable} from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {useNavigation} from '@react-navigation/native';
dayjs.extend(relativeTime);
import moment from 'moment';

const ChatListItem = ({chat, currentUser}) => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('ChatScreen', {
          id: chat?.user?.id,
          name: chat?.user?.name,
          currentUser
        })
      }
      style={styles.container}>
      <Image source={ chat?.user?.image ? {uri: chat?.user?.image} : require('../../../assets/user.png')} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {chat?.user?.name}
          </Text>
          <Text style={styles.subTitle}>
            {dayjs(moment.utc(chat?.last_message?.created_at).local().format()).fromNow(true)}
          </Text>
        </View>
        <Text numberOfLines={2} style={styles.subTitle}>
          {chat?.last_message?.text || 'attachments'}
        </Text>
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
