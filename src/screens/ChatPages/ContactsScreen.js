import { FlatList, SafeAreaView } from 'react-native';
import {chatListDemo} from '../../DemoData';
import ContactListItem from '../../components/ChatComponents/ContactListItem';
import {styles} from '../../components/styles';
import GoBack from '../../components/GoBack';

const ContactsScreen = ({route, navigation}) => {
  const {currentUser} = route.params;
  
  return (
    <SafeAreaView style={styles.container}>
      <GoBack text={'New Chat'} />
    <FlatList
      data={chatListDemo}
      renderItem={({ item }) => <ContactListItem user={item.user} currentUser/>}
      style={{ backgroundColor: 'white' }}
      showsVerticalScrollIndicator={false}
    />
    </SafeAreaView>
  );
};

export default ContactsScreen;