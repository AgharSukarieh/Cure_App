import { FlatList, SafeAreaView } from 'react-native';
import { chatListDemo } from '../../DemoData';
import ContactListItem from '../../components/ChatComponents/ContactListItem';
import { styles } from '../../components/styles';
import GoBack from '../../components/GoBack';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { Text } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { GET_SEARCH_RESULTS } from '../../Provider/ApiRequest';

const ContactsScreen = ({ route, navigation }) => {
  const { currentUser } = route.params;
  const { user, token } = useAuth();

  const [allnewusers, setallnewusers] = useState([]);
  console.log(token);
  const get_users = () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: GET_SEARCH_RESULTS + `?current_user_id=${user.id}&current_user_role=${user.role}&username`,
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setallnewusers(response.data.users)
      })
      .catch((error) => {
        console.log('🚀 ~ file: ContactsScreen.js ~~ line 35 ~ get_users ~ error', error);
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