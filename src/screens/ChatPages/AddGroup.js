import React, { useState, useMemo } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';

const FAKE_CONTACTS = [
  { id: '1', name: 'David Wayne', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: '2', name: 'Angela Kelly', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: '3', name: 'Edward Davidson', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: '4', name: 'Jean Dare', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
  { id: '5', name: 'Dennis Borer', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
];

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
    <Image source={{ uri: item.avatar }} style={styles.contactAvatar} />
    <Text style={styles.contactName}>{item.name}</Text>
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

  const filteredContacts = useMemo(() =>
    FAKE_CONTACTS.filter(contact =>
      contact.name.toLowerCase().includes(searchText.toLowerCase())
    ), [searchText]);

  const handleChoosePhoto = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
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

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      Alert.alert("Validation Error", "Group name is required.");
      return;
    }
    if (selectedContacts.length === 0) {
      Alert.alert("Validation Error", "Please select at least one member.");
      return;
    }

    const newGroupData = {
      id: `group_${Date.now()}`,
      name: groupName,
      description: groupDescription,
      avatar: groupAvatar ? groupAvatar.uri : `https://ui-avatars.com/api/?name=${groupName.charAt(0 )}&background=183E9F&color=fff&size=100`,
      members: selectedContacts,
      createdAt: new Date().toISOString(),
    };

    navigation.navigate('ChatsScreen', { newGroup: newGroupData });
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
              <Icon name="camera" size={24} color="#183E9F" />
            )}
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.groupNameInput}
              placeholder="Group Name"
              placeholderTextColor="#999"
              value={groupName}
              onChangeText={setGroupName}
            />
            <TextInput
              style={styles.groupDescInput}
              placeholder="Optional: Add group description"
              placeholderTextColor="#999"
              value={groupDescription}
              onChangeText={setGroupDescription}
              multiline
            />
          </View>
        </View>

        <View style={styles.membersSection}>
          <Text style={styles.sectionTitle}>Add Members</Text>
          <View style={styles.searchBar}>
            <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          <FlatList
            data={filteredContacts}
            renderItem={({ item }) => (
              <ContactItem
                item={item}
                onSelect={handleSelectContact}
                isSelected={selectedContacts.some(c => c.id === item.id)}
              />
            )}
            keyExtractor={item => item.id}
            style={styles.contactList}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {selectedContacts.length > 0 && (
        <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
          <MaterialIcons name="arrow-forward" size={28} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

// الأنماط الخاصة بـ AddGroup
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FC' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#F4F7FC' },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#183E9F', marginLeft: 20 },
  groupInfoContainer: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E8EAF0' },
  avatarPicker: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E8EAF0', justifyContent: 'center', alignItems: 'center', marginRight: 15, overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%' },
  inputContainer: { flex: 1 },
  groupNameInput: { fontSize: 18, fontWeight: '600', color: '#333', borderBottomWidth: 1, borderBottomColor: '#183E9F', paddingBottom: 8 },
  groupDescInput: { fontSize: 14, color: '#666', marginTop: 8, maxHeight: 60 },
  membersSection: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#183E9F', marginBottom: 15 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 15, marginBottom: 10, borderWidth: 1, borderColor: '#E8EAF0' },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 45, fontSize: 16, color: '#333' },
  contactList: { backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden' },
  contactItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F4F7FC' },
  contactAvatar: { width: 45, height: 45, borderRadius: 22.5, marginRight: 15 },
  contactName: { flex: 1, fontSize: 16, color: '#333', fontWeight: '500' },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#C7CCCD', justifyContent: 'center', alignItems: 'center' },
  checkboxSelected: { backgroundColor: '#183E9F', borderColor: '#183E9F' },
  createButton: { position: 'absolute', bottom: 30, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#183E9F', justifyContent: 'center', alignItems: 'center', elevation: 5 },
});

export default AddGroup;
