import ChatListItem from '../../components/ChatComponents/ChatListItem';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import GoBack from '../../components/GoBack';
import { styles } from '../../components/styles';
import { useNavigation } from '@react-navigation/native';
import globalConstants from '../../config/globalConstants';
import { useAuth } from '../../contexts/AuthContext';
import { usePusher } from '../../contexts/PusherContext';
import { get } from '../../WebService/RequestBuilder';

const getConvEndpoint = globalConstants.single_chat.get_conv;

const ChatsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const {data} = usePusher();
  const [chats, setChats] = useState([]);
  const [page, setPage] = useState(1);

  const getChats = (page) => {
    get(getConvEndpoint, null, {page: page}).then((res) => {
      if (chats?.length > 0) {
        if (!(page > 1)) {
          setChats([])
        }
        setChats((prev) => [...prev, ...res.data]);
      }else {
        setChats(res.data)
      }
    }).catch((err) => {

    })
  }

  useEffect(() => {
    setChats((prev) => [...prev])
    setPage(1)
    getChats(1)
  }, [data]);

  const renderList = () => {
    setChats((prev) => [...prev])
    setPage(1)
    getChats(1)
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoBack text={'Chats'} addButton addButtonFunc={() => {
        navigation.navigate('ContactsScreen')
        }} />

      <FlatList 
        data={chats}
        renderItem={({ item }) => <ChatListItem chat={item} func={renderList}/>}
        keyExtractor={(item, index) => index.toString()}
        style={{ backgroundColor: 'white' }}
        onEndReached={() => 
          {
            setPage(page + 1)
            getChats(page + 1)
          }}
        showsVerticalScrollIndicator={false}
      />

    </SafeAreaView>
  );
};

export default ChatsScreen;

