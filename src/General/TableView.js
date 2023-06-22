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
////////////////////////////////1111111111111111111111///////////////////



// import React, {useState, useEffect, useCallback} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   Button,
//   ActivityIndicator,
// } from 'react-native';
// import { getPage } from '../WebService/RequestBuilder';

// const TableView = ({endpoint, renderItem}) => {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const fetchData = useCallback(
//     async (page = 1) => {
//       try {
//         setIsLoading(true);
//         const response = await getPage(endpoint, page, 10, {
//           search: searchQuery,
//         });
//         setData(response.data);
//         setCurrentPage(response.page);
//         setTotalPages(response.totalPages);
//         setIsLoading(false);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setIsLoading(false);
//       }
//     },
//     [endpoint, searchQuery],
//   );

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

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
//       {/* <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
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
//       </View> */}
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
////////////////////////////////222222222222222222222222222///////////////////




import React, { useState, useEffect} from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { getPage } from '../WebService/RequestBuilder';

const TableView = ({ apiEndpoint, renderItem, params, enablePullToRefresh = false, onEndReached = true  }) => {
  console.log('##########################',params);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [hasMoreData, setHasMoreData] = useState(true);

  const fetchData = async () => {
    if (loading || !hasMoreData) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getPage(apiEndpoint, page, 10, params);
      const newData = response.data;
      if (newData.length === 0) {
        setHasMoreData(false);
      } else {
        setData(prevData => [...prevData, ...newData]);
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    setError(null);
    setHasMoreData(true);
    try {
      const response = await getPage(apiEndpoint, 1, 10, params);
      setData(response.data);
      setPage(2);
    } catch (error) {
      setError(error.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    setData([]);
    setPage(1);
    setHasMoreData(true);
  }, [params]);
  
  const renderFooter = () => {
    if (!loading || !hasMoreData) return null;

    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator />
      </View>
    );
  };

  const renderEmptyState = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyStateContainer}>
        <Text>No data available.</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {error ? (
        <Text>Error: {error}</Text>
        
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyState}
          onEndReached={onEndReached ? fetchData : null}
          onEndReachedThreshold={0.1}
          refreshControl={
            enablePullToRefresh && (
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            )
          }
        />
      )}
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 10,
  },
  footerContainer: {
    paddingVertical: 20,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
};

export default TableView;

  // const fetchData = async () => {
  //   if (loading || !hasMoreData) return;
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const response = await getPage(apiEndpoint, page, 10, params);
  //     const newData = response.data;
  //     if (newData.length === 0) {
  //       setHasMoreData(false);
  //     } else {
  //       setData(prevData => [...prevData, ...newData]);
  //       setPage(prevPage => prevPage + 1);
  //     }
  //   } catch (error) {
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };