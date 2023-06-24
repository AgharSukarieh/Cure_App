import {
    ImageBackground,
    StyleSheet,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import bg from '../../../assets/BG.png'
import { messagesListDemo } from '../../messages';
import Message from '../../components/ChatComponents/Message';
import InputBox from '../../components/ChatComponents/InputBox';
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
                console.log('222222222222222');
                console.log(`Event received: ${event}`);
                getMessages()
            }
        });
        // console.log(pusher.connectionState);
    }

    useEffect(() => {
        sendpusher()
    }, []);

    const { group_id, name, currentUser } = route.params;
    const [messages, setMessages] = useState([]);

    const getMessages = () => {

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: GET_GROUPS_MESSAGES + `?group_id=${group_id}&current_user_id=${currentUser}`,
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        };

        axios.request(config)
            .then((response) => {
                setMessages(response.data.data.messages)
            })
            .catch((error) => {
                console.log(error);
            });

    }

    useEffect(() => {
        getMessages();
    }, [])

    useEffect(() => {
        navigation.setOptions({ title: name });
    }, [name, navigation]);
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 70 : 140}
            style={styles.bg}>
            {/* <View style={{ width: '100%', height: 70, backgroundColor: 'red' }}>
          <Text>name</Text> */}
            <GoBack text={name} />
            {/* </View> */}
            <ImageBackground source={bg} style={styles.bg}>
                <FlatList
                    data={messages}
                    renderItem={({ item }) => <GroupMessage message={item} currentUserId={currentUser} />}
                    style={styles.list}
                    inverted
                    showsVerticalScrollIndicator={false}
                />
                <InputBox currentUserId={currentUser} receiverID={group_id} submit={(msg) => {
                    setMessages([msg, ...messages])
                }} />
            </ImageBackground>
        </KeyboardAvoidingView>
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
