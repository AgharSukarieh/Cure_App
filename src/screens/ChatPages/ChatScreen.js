import {
  ImageBackground,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useEffect} from 'react';
import bg from '../../../assets/BG.png'
import {messagesListDemo} from '../../messages';
import Message from  '../../components/ChatComponents/Message';
import InputBox from '../../components/ChatComponents/InputBox';

const ChatScreen = ({route, navigation}) => {
  const {id, name} = route.params;

  useEffect(() => {
    navigation.setOptions({title: name});
  }, [name, navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 70 : 140}
      style={styles.bg}>
      <ImageBackground source={bg} style={styles.bg}>
        <FlatList
          data={messagesListDemo}
          renderItem={({item}) => <Message message={item} />}
          style={styles.list}
          inverted
          showsVerticalScrollIndicator={false}
        />
        <InputBox />
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  list: {
    padding: 10,
  },
});

export default ChatScreen;
