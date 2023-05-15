import React from 'react';
import {View, Text, StyleSheet, FlatList, Image, Pressable} from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import {useNavigation} from '@react-navigation/native';

const Message = ({message}) => {
  const navigation = useNavigation();
  const isMyMessage = () => {
    return message.user.id === 'u1';
  };

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: isMyMessage() ? '#8ab7eb' : 'white', //'#DCF8C5'
        alignSelf: isMyMessage() ? 'flex-end' : 'flex-start',
      }}>
      {message?.images?.length > 0 &&
      <Pressable onPress={() => navigation.navigate('PresentImage',{arrayOfURI: message?.images})}>
        {message.images.map((element,index) => (
            <Image
            key={index}
              source={{uri: element}}
              style={{...styles.selectedImage, marginBottom: 5}}
              resizeMode="contain"
            />
            
        ))}
        </Pressable>
      }
      <Text>{message?.text}</Text>
      <Text style={styles.time}>{dayjs(message?.createdAt).fromNow(true)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  message: {},
  time: {
    alignSelf: 'flex-end',
    color: '#696a6b',
  },
  selectedImage: {
    height: 100,
    width: 200,
    borderRadius: 10,
  },
});

export default Message;
