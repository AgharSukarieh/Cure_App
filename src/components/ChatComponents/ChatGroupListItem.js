import React from 'react';
import { Text, View, Image, StyleSheet, Pressable } from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { styles } from '../styles';
Ionicons.loadFont();
dayjs.extend(relativeTime);

const ChatGroupListItem = ({ item }) => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('GroupPage', {
          group_id: item?.id,
          name: item?.name,
        })
      }
      style={{marginHorizontal:14, width:'90%', flexDirection:'row', marginVertical:10}}>
      <Image source={item?.image ? { uri: item?.image } : require('../../../assets/user.png')} style={cardstyles.image} />
      <View style={{}}>
        <View style={cardstyles.row}>
          <Text style={cardstyles.name} numberOfLines={1}> {item?.name ?? ''} </Text>
          <Text numberOfLines={2} style={cardstyles.subTitle}>
          {item?.last_message?.text || ''}
        </Text>
        
          <Text style={cardstyles.subTitle}>
            {dayjs(moment.utc(item?.last_message?.created_at).local().format()).fromNow(true)}
          </Text>
        </View>
        
      </View>
    </Pressable>
  );
};



export default ChatGroupListItem;

const cardstyles = StyleSheet.create({
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
    marginRight: 15,
    
  },
  content: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'lightgray',
  },
  row: {
    // flexDirection: 'row',
    marginBottom: 5,
  },
  name: {
    // flex: 1,
    fontWeight: 'bold',
  },
  subTitle: {
    color: 'gray',
  },
});
