import React, { useEffect, useState } from 'react';
import { styles } from '../../components/styles';
import {
  SafeAreaView,
} from 'react-native';
import GoBack from '../../components/GoBack';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import TableView from '../../General/TableView';
import globalConstants from '../../config/globalConstants';
import ChatGroupListItem from '../../components/ChatComponents/ChatGroupListItem';
const getConvEndpoint = globalConstants.group_chat.get_conv;

const AllGroups = () => {

  return (
    <SafeAreaView style={styles.container}>
      <GoBack text={'Groups'} />
      
      {/* <FlatList
        data={data}
        renderItem={({ item }) => <ChatGroupListItem item={item} />}
        style={{ backgroundColor: 'white' }}
        showsVerticalScrollIndicator={false}
      /> */}

      <TableView
          apiEndpoint={getConvEndpoint}
          enablePullToRefresh
          renderItem={({ item }) => <ChatGroupListItem item={item}/>}
        />
    </SafeAreaView>
  );
};

export default AllGroups;