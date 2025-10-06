import { 
    FlatList, 
    SafeAreaView, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    View,
    Text,
    ActivityIndicator
  } from 'react-native';
  import ContactListItem from '../../components/ChatComponents/ContactListItem';
  
  import GoBack from '../../components/GoBack';
  import React, { useEffect, useState } from 'react';
  import FontAwesome from 'react-native-vector-icons/FontAwesome';
  import { get } from '../../WebService/RequestBuilder';
  import globalConstants from '../../config/globalConstants';
  
  const ContactsScreen = ({ route, navigation }) => {
    const [txt, setTxt] = useState('');
    const [allnewusers, setallnewusers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState(null);
  
    const handleTextChange = (newText) => {
      setTxt(newText);
      
      // Clear previous timeout
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
  
      // Set new timeout for search
      if (newText.length > 2) {
        setIsLoading(true);
        const timeout = setTimeout(() => {
          get_users(newText);
        }, 500); // 500ms delay
        setSearchTimeout(timeout);
      } else if (newText.length === 0) {
        setIsLoading(true);
        const timeout = setTimeout(() => {
          get_users('');
        }, 300);
        setSearchTimeout(timeout);
      }
    };
  
    const get_users = async (searchText = '') => {
      try {
        const params = searchText ? { username: searchText } : {};
        const res = await get(globalConstants.get_user_to_chat, null, params);
        setallnewusers(res.data || []);
      } catch (err) {
        console.log('Error fetching users:', err);
        setallnewusers([]);
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleSearch = () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      setIsLoading(true);
      get_users(txt);
    };
  
    useEffect(() => {
      get_users();
    }, []);
  
    return (
      <SafeAreaView style={style.container}>
        {/* Header */}
        <View style={style.header}>
          <GoBack text={'New Chat'} />
        </View>
  
        {/* Search Section */}
        <View style={style.searchSection}>
          <View style={style.searchContainer}>
            <FontAwesome name="search" size={20} color="#666" style={style.searchIcon} />
            <TextInput 
              placeholder='Search by username...'
              value={txt} 
              onChangeText={handleTextChange}
              placeholderTextColor={'#999'}
              style={style.searchInput}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            {txt.length > 0 && (
              <TouchableOpacity 
                onPress={() => {
                  setTxt('');
                  get_users('');
                }}
                style={style.clearButton}
              >
                <FontAwesome name="times-circle" size={18} color="#999" />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity 
            onPress={handleSearch}
            style={style.searchButton}
          >
            <FontAwesome name="search" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
  
        {/* Results Section */}
        <View style={style.resultsContainer}>
          <View style={style.resultsHeader}>
            <Text style={style.resultsTitle}>
              Contacts {allnewusers.length > 0 ? `(${allnewusers.length})` : ''}
            </Text>
          </View>
  
          {isLoading ? (
            <View style={style.loadingContainer}>
              <ActivityIndicator size="large" color="#183E9F" />
              <Text style={style.loadingText}>Searching contacts...</Text>
            </View>
          ) : allnewusers.length > 0 ? (
            <FlatList
              data={allnewusers}
              renderItem={({ item }) => <ContactListItem user={item} />}
              keyExtractor={(item) => item.id?.toString()}
              showsVerticalScrollIndicator={false}
              style={style.contactsList}
              contentContainerStyle={style.listContent}
            />
          ) : (
            <View style={style.emptyContainer}>
              <FontAwesome name="users" size={64} color="#DDD" />
              <Text style={style.emptyTitle}>No contacts found</Text>
              <Text style={style.emptyText}>
                {txt.length > 0 
                  ? 'Try searching with a different username'
                  : 'Start typing to search for contacts'
                }
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  };
  
  export default ContactsScreen;
  
  const style = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA',
    },
    header: {
      backgroundColor: '#FFF',
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    searchSection: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#FFF',
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F8F9FA',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      paddingHorizontal: 12,
      marginRight: 12,
      height: 50,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      color: '#000',
      fontSize: 16,
      paddingVertical: 8,
    },
    clearButton: {
      padding: 4,
    },
    searchButton: {
      backgroundColor: '#183E9F',
      width: 50,
      height: 50,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#183E9F',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    resultsContainer: {
      flex: 1,
      backgroundColor: '#FFF',
    },
    resultsHeader: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
    },
    resultsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    contactsList: {
      flex: 1,
    },
    listContent: {
      paddingBottom: 16,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: '#666',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#666',
      marginTop: 16,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      color: '#999',
      textAlign: 'center',
      lineHeight: 20,
    },
  });