import {
    ImageBackground,
    StyleSheet,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    View,
    SafeAreaView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import bg from '../../../assets/BG.png'
import { messagesListDemo } from '../../messages';
import { GET_CHAT_MESSAGES, GET_GROUPS_MESSAGES, GET_USER_GROUPS } from '../../Provider/ApiRequest';
import axios from 'axios';
import {
    Pusher,
    PusherMember,
    PusherChannel,
    PusherEvent,
} from '@pusher/pusher-websocket-react-native';
import { Text } from 'react-native';
import GoBack from '../../components/GoBack';
import { useAuth } from '../../contexts/AuthContext';
import GroupMessage from '../../components/ChatComponents/groupMessage';
import InputBoxGroup from '../../components/ChatComponents/InputBoxGroup';
import { get } from '../../WebService/RequestBuilder';
import globalConstants from '../../config/globalConstants';
const getMessagesEndpoint = globalConstants.group_chat.get_mess;

const GroupPage = ({ route, navigation }) => {

    const pusher = Pusher.getInstance();
    const { user, token } = useAuth();

    const sendpusher = async () => {

        await pusher.init({
            apiKey: "7d3cf02011bb653450a0",
            cluster: "mt1"
        });
        await pusher.connect();
        await pusher.subscribe({
            channelName: "pharmaceuticals",
            onEvent: (event: PusherEvent) => {
                console.log('555555555555555555555555');
                console.log(`Event received: ${event}`);
                getMessages()
            }
        });
        // console.log(pusher.connectionState);
    }

    useEffect(() => {
        sendpusher()
    }, []);

    const { group_id, name } = route.params;
    const [messages, setMessages] = useState([]);

    // const getMessages = () => {
    //     let config = {
    //         method: 'get',
    //         maxBodyLength: Infinity,
    //         url: GET_GROUPS_MESSAGES + `?group_id=${group_id}&current_user_id=${currentUser}`,
    //         headers: {
    //             'Authorization': `Bearer ${token}`,
    //         }
    //     };
    //     axios.request(config)
    //         .then((response) => {
    //             setMessages(response.data.data.messages)
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }

    const getMessages = async () => {
        get(getMessagesEndpoint, null, {group_id: group_id}).then((res)=> {
            setMessages(res.data);
          }).catch((err) => {
            console.log(err);
          })
    }

    useEffect(() => {
        getMessages();
    }, [])

    useEffect(() => {
        navigation.setOptions({ title: name });
    }, [name, navigation]);

    return (
        <SafeAreaView style={{width: '100%', height: '100%',}}>
        <GoBack text={name} />
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 140}
            style={styles.bg}>
            {/* <View style={{ width: '100%', height: 70, backgroundColor: 'red' }}>
          <Text>name</Text> */}
            {/* </View> */}
            <ImageBackground source={bg} style={styles.bg}>
                <FlatList
                    data={messages}
                    renderItem={({ item }) => <GroupMessage message={item} />}
                    style={styles.list}
                    inverted
                    showsVerticalScrollIndicator={false}
                />
                <InputBoxGroup currentUserId={user.id} receiverID={group_id} submit={(msg) => {
                    setMessages([msg, ...messages])
                    getMessages()
                }} />
            </ImageBackground>
        </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    bg: {
        flex: 1,
    },
    list: {
    },
});

export default GroupPage;
