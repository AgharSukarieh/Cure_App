import { FlatList, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import ContactListItem from '../../components/ChatComponents/ContactListItem';
import { styles } from '../../components/styles';
import GoBack from '../../components/GoBack';
import React, { useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { get } from '../../WebService/RequestBuilder';
import globalConstants from '../../config/globalConstants';

const ContactsScreen = ({ route, navigation }) => {
  const [txt, setTxt] = useState('');
  const [allnewusers, setallnewusers] = useState([]);

  const handleTextChange = (newText) => {
    setTxt(newText);
    if (newText.length > 2) {
      get_users();
    }
  };

  const get_users = async () => {
    get(globalConstants.get_user_to_chat, null, {username: txt}).then((res) => {
      setallnewusers(res.data)
    }).catch((err) => {
      console.log(err);
    })
  }

  useEffect(() => {
    get_users();
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <GoBack text={'New Chat'} />
      <View style={style.searchView}>
            <TextInput 
              placeholder='Search ....'
              value={txt} 
              onChangeText={handleTextChange}
              placeholderTextColor={'#808080'}
              style={{color:'#000000'}}
            />
            <TouchableOpacity onPress={() => {
              get_users();
            }}>
              <FontAwesome name="search" size={26} color="grey" />
            </TouchableOpacity>
            
      </View>
      
      <FlatList
        data={allnewusers}
        renderItem={({ item }) => <ContactListItem user={item} />}
        style={{ backgroundColor: '#FFFFFF' }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default ContactsScreen;

const style = StyleSheet.create({
  mainview: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    top: -20,
  },
  searchView: {
    width: '90%',
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'grey',
    height:45
  },
})