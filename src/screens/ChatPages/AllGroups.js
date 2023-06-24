import React, { useEffect, useState } from 'react';
import { styles } from '../../components/styles';
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image
} from 'react-native';
import GoBack from '../../components/GoBack';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { GET_USER_CHATS, GET_USER_GROUPS } from '../../Provider/ApiRequest';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';


const AllGroups = () => {
  const navigation = useNavigation();
  const { user, token } = useAuth();
  const [data, setdata] = useState([]);

  const getdata = () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: GET_USER_GROUPS + `?current_user_id=${user.id}`,
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    };
    axios.request(config)
      .then((response) => {
        setdata(response.data.users);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getdata();
  }, [])


  return (
    <SafeAreaView style={styles.container}>
      <GoBack text={'Groups'} />
      {data.map((item, index) => {
        return (
          <Pressable
            key={index}
            onPress={() =>
              navigation.navigate('GroupPage', {
                group_id: item?.group?.id,
                name: item?.group.name,
                currentUser: user.id
              })
            }
            style={cardstyles.container}>
            <Image source={item?.image ? { uri: item?.image } : require('../../../assets/user.png')} style={cardstyles.image} />
            <View style={cardstyles.content}>
              <View style={cardstyles.row}>
                <Text style={cardstyles.name} numberOfLines={1}> {item?.group.name} </Text>
                <Text style={cardstyles.subTitle}>
                  {dayjs(moment.utc(item?.last_message?.created_at).local().format()).fromNow(true)}
                </Text>
              </View>
              <Text numberOfLines={2} style={cardstyles.subTitle}>
                {item?.last_message?.text || ''}
              </Text>
            </View>
          </Pressable>
        )
      })}
    </SafeAreaView>
  );
};
const cardstyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  content: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'lightgray',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  name: {
    flex: 1,
    fontWeight: 'bold',
  },
  subTitle: {
    color: 'gray',
  },
});

export default AllGroups;