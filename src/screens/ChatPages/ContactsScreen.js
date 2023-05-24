import { FlatList, SafeAreaView } from 'react-native';
import { chatListDemo } from '../../DemoData';
import ContactListItem from '../../components/ChatComponents/ContactListItem';
import { styles } from '../../components/styles';
import GoBack from '../../components/GoBack';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { Text } from 'react-native';

const ContactsScreen = ({ route, navigation }) => {
  const { currentUser } = route.params;
  const [allnewusers, setallnewusers] = useState([]);

  const get_users = () => {
    axios({
      method: 'GET',
      url: 'https://pharmaceuticals.ncitsolutions.com/api/get_new_user_chat',
      params: {
        userid: currentUser
      },
    })
      .then(response => {
        if (response.data.message) {
          setallnewusers(response.data.data)
        } else {
          console.log('no new users available');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  useEffect(() => {
    get_users()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <GoBack text={'New Chat'} />
      <FlatList
        data={allnewusers}
        renderItem={({ item }) => <ContactListItem user={item} currentUser={currentUser} />}
        style={{ backgroundColor: 'white' }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default ContactsScreen;