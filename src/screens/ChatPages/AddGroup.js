import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  FlatList,
  Alert,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { get, post } from '../../WebService/RequestBuilder';
import globalConstants from '../../config/globalConstants';

const Header = ({ onBackPress } ) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
      <Icon name="arrow-left" size={24} color="#183E9F" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>New Group</Text>
  </View>
);

const ContactItem = ({ item, onSelect, isSelected }) => (
  <TouchableOpacity style={styles.contactItem} onPress={() => onSelect(item)}>
    <Image 
      source={{ uri: item.avatar || item.profile_image }} 
      style={styles.contactAvatar} 
      defaultSource={require('../../../assets/images/avatar.png')}
    />
    <Text style={styles.contactName}>{item.name || item.username}</Text>
    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
      {isSelected && <Icon name="check" size={16} color="#fff" />}
    </View>
  </TouchableOpacity>
);

const AddGroup = ({ navigation }) => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupAvatar, setGroupAvatar] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchText, setSearchText] = useState('');

  // ✅ تحقق من القيمة
  console.log('📡 Group Chat Endpoints Check:', {
    create_group: globalConstants.group_chat?.create_group,
    add_member: globalConstants.group_chat?.add_member,
    remove_member: globalConstants.group_chat?.remove_member,
    leave_group: globalConstants.group_chat?.leave_group
  });
  
  // إذا طلع undefined، يعني الملف مش محدث
  if (!globalConstants.group_chat?.create_group) {
    console.error('❌ globalConstants.group_chat.create_group is undefined!');
  }
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // جلب المستخدمين من الـ API
  const getUsers = async (searchQuery = '') => {
    setIsLoading(true);
    try {
      const params = searchQuery ? { username: searchQuery } : {};
      const res = await get(globalConstants.get_user_to_chat, null, params);
      
      if (res && res.data) {
        const formattedUsers = res.data.map(user => ({
          id: user.id || user.user_id,
          name: user.name || user.username || 'Unknown User',
          username: user.username,
          avatar: user.avatar || user.profile_image,
          ...user
        }));
        setAllUsers(formattedUsers);
      } else {
        setAllUsers([]);
      }
    } catch (err) {
      console.log('Error fetching users:', err);
      Alert.alert('Error', 'Failed to load users');
      setAllUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // البحث التلقائي
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getUsers(searchText);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  // جلب جميع المستخدمين عند فتح الشاشة
  useEffect(() => {
    getUsers();
  }, []);

  const filteredContacts = useMemo(() =>
    allUsers.filter(contact =>
      (contact.name && contact.name.toLowerCase().includes(searchText.toLowerCase())) ||
      (contact.username && contact.username.toLowerCase().includes(searchText.toLowerCase()))
    ), [allUsers, searchText]);

  const handleChoosePhoto = () => {
    launchImageLibrary({ 
      mediaType: 'photo', 
      quality: 0.8,
      maxWidth: 500,
      maxHeight: 500 
    }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to select image');
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setGroupAvatar({ uri: response.assets[0].uri });
      }
    });
  };

  const handleSelectContact = (contact) => {
    setSelectedContacts(prev => {
      const isSelected = prev.some(c => c.id === contact.id);
      return isSelected ? prev.filter(c => c.id !== contact.id) : [...prev, contact];
    });
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("Validation Error", "Group name is required.");
      return;
    }
    if (selectedContacts.length === 0) {
      Alert.alert("Validation Error", "Please select at least one member.");
      return;
    }

    setIsCreating(true);
    try {
      const list_of_user_ids = selectedContacts.map(user => user.id);
      
      const formData = new FormData();
      formData.append('name', groupName);
      if (groupDescription) {
        formData.append('description', groupDescription);
      }
      
      // إضافة الصورة إذا تم اختيارها
      if (groupAvatar) {
        formData.append('avatar', {
          uri: groupAvatar.uri,
          type: 'image/jpeg',
          name: 'group_avatar.jpg'
        });
      }
      
      // إضافة معرفات المستخدمين - استخدام users_ids[] format
      list_of_user_ids.forEach(userId => {
        formData.append('users_ids[]', userId);
      });

      console.log('🔍 Creating group with endpoint:', globalConstants.group_chat.create_group);
      console.log('📡 FormData contents:', {
        name: groupName,
        description: groupDescription,
        users_ids: list_of_user_ids,
        users_count: list_of_user_ids.length
      });
      
      const res = await post(globalConstants.group_chat.create_group, formData, {
        'Content-Type': 'multipart/form-data'
      });

      if (res) {
        Alert.alert('Success', 'Group created successfully!', [
          {
            text: 'OK',
            onPress: () => {
              // العودة إلى الصفحة السابقة
              navigation.goBack();
            }
          }
        ]);
      }
    } catch (err) {
      console.log('Error creating group:', err);
      Alert.alert('Error', 'Failed to create group. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7FC" />
      <Header onBackPress={() => navigation.goBack()} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.groupInfoContainer}>
          <TouchableOpacity style={styles.avatarPicker} onPress={handleChoosePhoto}>
            {groupAvatar ? (
              <Image source={groupAvatar} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="camera" size={24} color="#183E9F" />
                <Text style={styles.avatarText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.groupNameInput}
              placeholder="Group Name"
              placeholderTextColor="#999"
              value={groupName}
              onChangeText={setGroupName}
              maxLength={50}
            />
            <TextInput
              style={styles.groupDescInput}
              placeholder="Optional: Add group description"
              placeholderTextColor="#999"
              value={groupDescription}
              onChangeText={setGroupDescription}
              multiline
              maxLength={200}
            />
          </View>
        </View>

        <View style={styles.membersSection}>
          <Text style={styles.sectionTitle}>
            Add Members {selectedContacts.length > 0 && `(${selectedContacts.length} selected)`}
          </Text>
          <View style={styles.searchBar}>
            <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
            {isLoading && (
              <ActivityIndicator size="small" color="#183E9F" />
            )}
          </View>

          {isLoading && allUsers.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#183E9F" />
              <Text style={styles.loadingText}>Loading contacts...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredContacts}
              renderItem={({ item }) => (
                <ContactItem
                  item={item}
                  onSelect={handleSelectContact}
                  isSelected={selectedContacts.some(c => c.id === item.id)}
                />
              )}
              keyExtractor={item => item.id?.toString() || Math.random().toString()}
              style={styles.contactList}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {searchText ? 'No contacts found' : 'No contacts available'}
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </ScrollView>

      {selectedContacts.length > 0 && (
        <TouchableOpacity 
          style={[
            styles.createButton,
            isCreating && styles.createButtonDisabled
          ]} 
          onPress={handleCreateGroup}
          disabled={isCreating}
        >
          {isCreating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MaterialIcons name="arrow-forward" size={28} color="#fff" />
          )}
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FC' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    backgroundColor: '#F4F7FC' 
  },
  backButton: { padding: 5 },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#183E9F', 
    marginLeft: 20 
  },
  groupInfoContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#E8EAF0' 
  },
  avatarPicker: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: '#E8EAF0', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15, 
    overflow: 'hidden' 
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 12,
    color: '#183E9F',
    marginTop: 4,
  },
  inputContainer: { flex: 1 },
  groupNameInput: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#333', 
    borderBottomWidth: 1, 
    borderBottomColor: '#183E9F', 
    paddingBottom: 8 
  },
  groupDescInput: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 8, 
    maxHeight: 60 
  },
  membersSection: { 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 100 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#183E9F', 
    marginBottom: 15 
  },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    paddingHorizontal: 15, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: '#E8EAF0' 
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 45, fontSize: 16, color: '#333' },
  contactList: { backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden' },
  contactItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F4F7FC' 
  },
  contactAvatar: { width: 45, height: 45, borderRadius: 22.5, marginRight: 15 },
  contactName: { flex: 1, fontSize: 16, color: '#333', fontWeight: '500' },
  checkbox: { 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    borderWidth: 2, 
    borderColor: '#C7CCCD', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  checkboxSelected: { backgroundColor: '#183E9F', borderColor: '#183E9F' },
  createButton: { 
    position: 'absolute', 
    bottom: 30, 
    right: 20, 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: '#183E9F', 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 5 
  },
  createButtonDisabled: {
    backgroundColor: '#999',
  },
  loadingContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
});

export default AddGroup;