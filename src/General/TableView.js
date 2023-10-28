import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { getPage } from '../WebService/RequestBuilder';

const TableView = ({ apiEndpoint, renderItem, params, enablePullToRefresh = false, onEndReached = true}) => {
  // console.log('##########################',params);
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
        <Image style={{ width: '60%', alignSelf: 'center' }} resizeMode='contain' source={require('../../assets/nodata.png')} />
        <Text style={{ fontSize: 20, color: '#000' }}>No data available.</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>No Data Available</Text>

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