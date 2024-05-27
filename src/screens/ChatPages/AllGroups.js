import React, { useEffect, useState } from 'react';
import { styles } from '../../components/styles';
import {
  FlatList,
  SafeAreaView,
} from 'react-native';
import GoBack from '../../components/GoBack';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import globalConstants from '../../config/globalConstants';
import ChatGroupListItem from '../../components/ChatComponents/ChatGroupListItem';
import { useAuth } from '../../contexts/AuthContext';
import { usePusher } from '../../contexts/PusherContext';
import { get } from '../../WebService/RequestBuilder';
dayjs.extend(relativeTime);
const getConvEndpoint = globalConstants.group_chat.get_conv;

const AllGroups = () => {
  const { user } = useAuth();
  const {dataForGroup} = usePusher();
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
    const isReceiverIdInChats = chats.some(chat => chat.id == dataForGroup?.receiver_id);
    if (isReceiverIdInChats) {
      setChats((prev) => [...prev])
      setPage(1)
      getChats(1)
    }
  }, [dataForGroup]);

  const renderList = () => {
    setChats((prev) => [...prev])
    setPage(1)
    getChats(1)
};

  useEffect(() => {
    getChats(1)
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <GoBack text={'Groups'} />

      <FlatList
        data={chats}
        renderItem={({ item }) => <ChatGroupListItem item={item} func={renderList}/>}
        keyExtractor={(item, index) => index.toString()}
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

export default AllGroups;
