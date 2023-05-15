import ChatListItem from '../../components/ChatComponents/ChatListItem';
import React from 'react';
import {chatListDemo} from '../../DemoData';
import {FlatList, SafeAreaView} from 'react-native';
import GoBack from '../../components/GoBack';
import {styles} from '../../components/styles';
import {useNavigation} from '@react-navigation/native';

const ChatsScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <GoBack text={'Chats'} addButton addButtonFunc={() => navigation.navigate('ContactsScreen')}/>
    <FlatList
      data={chatListDemo}
      renderItem={({item}) => <ChatListItem chat={item} />}
      style={{backgroundColor: 'white'}}
      showsVerticalScrollIndicator={false}
    />
    </SafeAreaView>
  );
};

export default ChatsScreen;
