import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { getPage } from '../WebService/RequestBuilder';

const DropdownWithPaginationAndSearch = ({
  apiEndpoint,
  renderItem,
  searchPlaceholder,
}) => {
  const [items, setItems] = useState([{name:'asd'}, {name:'qwe'}]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListVisible, setListVisible] = useState(false); // State to control list visibility

  useEffect(() => {
    const loadItems = async (page, query) => {
      try {
        const response = await getPage(apiEndpoint, page, 10, { query });
        setItems(response.data);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.log('Error loading items:', error);
      }
    };

    loadItems(currentPage, searchQuery);
  }, [apiEndpoint, currentPage, searchQuery]);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const toggleListVisibility = () => {
    setListVisible(!isListVisible);
  };

  return (
    <View style={{flex:1}}>
      <TouchableOpacity onPress={toggleListVisibility}>
        <Text>Select an item</Text>
      </TouchableOpacity>
      {isListVisible && (
        <View>
          <TextInput
            style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
          />
        </View>
      )}
    </View>
  );
};

export default DropdownWithPaginationAndSearch;

////////////////////////////////
// const MyScreen = () => {
  // const renderItem = ({item}) => {
  //   return (
  //     <TouchableOpacity>
  //       <Text>{item.name}</Text>
  //     </TouchableOpacity>
  //   );
  // };

//   const itemKeyExtractor = item => item.id.toString();

//   return (
    // <View>
    //   <DropdownWithPaginationAndSearch
    //     apiEndpoint="your-api-endpoint"
    //     renderItem={renderItem}
    //     itemKeyExtractor={itemKeyExtractor}
    //     searchPlaceholder="Search..."
    //   />
    // </View>
//   );
// };
////////////////////////////////
