// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   Button,
//   ActivityIndicator,
// } from 'react-native';
// import {getPage} from './apiClient';

// const TableView = ({endpoint, renderItem}) => {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const fetchData = async (page = 1) => {
//     try {
//       setIsLoading(true);
//       const response = await getPage(endpoint, page, 10, {search: searchQuery});
//       setData(response.data);
//       setCurrentPage(response.page);
//       setTotalPages(response.totalPages);
//       setIsLoading(false);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setIsLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const loadMoreData = () => {
//     if (currentPage < totalPages) {
//       fetchData(currentPage + 1);
//     }
//   };

//   const renderFooter = () => {
//     if (!isLoading) return null;

//     return (
//       <View style={{paddingVertical: 20}}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   };

//   const handleSearch = () => {
//     fetchData();
//   };

//   return (
//     <View style={{flex: 1}}>
//       <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
//         <TextInput
//           style={{
//             flex: 1,
//             height: 40,
//             borderColor: 'gray',
//             borderWidth: 1,
//             marginRight: 10,
//             paddingHorizontal: 10,
//           }}
//           placeholder="Search"
//           value={searchQuery}
//           onChangeText={text => setSearchQuery(text)}
//         />
//         <Button title="Search" onPress={handleSearch} />
//       </View>
//       <FlatList
//         data={data}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={renderItem}
//         ListFooterComponent={renderFooter}
//         onEndReached={loadMoreData}
//         onEndReachedThreshold={0.5}
//       />
//     </View>
//   );
// };

// export default TableView;

import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  ActivityIndicator,
} from 'react-native';
import {getPage} from './apiClient';

const TableView = ({endpoint, renderItem}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(
    async (page = 1) => {
      try {
        setIsLoading(true);
        const response = await getPage(endpoint, page, 10, {
          search: searchQuery,
        });
        setData(response.data);
        setCurrentPage(response.page);
        setTotalPages(response.totalPages);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    },
    [endpoint, searchQuery],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const loadMoreData = () => {
    if (currentPage < totalPages) {
      fetchData(currentPage + 1);
    }
  };

  const renderFooter = () => {
    if (!isLoading) return null;

    return (
      <View style={{paddingVertical: 20}}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  const handleSearch = () => {
    fetchData();
  };

  return (
    <View style={{flex: 1}}>
      <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
        <TextInput
          style={{
            flex: 1,
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginRight: 10,
            paddingHorizontal: 10,
          }}
          placeholder="Search"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default TableView;
{
  /* <TableView
  endpoint="/your-api-endpoint"
  renderItem={({item}) => (
    <View style={{padding: 10}}>
      <Text>{item.title}</Text>
      <Text>{item.description}</Text>
    </View>
  )}
/>; */
}
