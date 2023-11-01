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
// import {
//     Pusher,
//     PusherMember,
//     PusherChannel,
//     PusherEvent,
// } from '@pusher/pusher-websocket-react-native';
import GoBack from '../../components/GoBack';
import GroupMessage from '../../components/ChatComponents/groupMessage';
import InputBoxGroup from '../../components/ChatComponents/InputBoxGroup';
import globalConstants from '../../config/globalConstants';
import TableView from '../../General/TableView';
import { usePusher } from '../../contexts/PusherContext';
const getMessagesEndpoint = globalConstants.group_chat.get_mess;

const GroupPage = ({ route, navigation }) => {
    // const pusher = Pusher.getInstance();
    const { group_id, name } = route.params;
    const [messId, setmessId] = useState(group_id);
    const {dataForGroup} = usePusher();

    // isMyGroup(group_id)
    // const [shouldUpdate, setShouldUpdate] = useState(false);

    // useEffect(() => {
    //     if (data && data.receiver_id === group_id) {
    //       setShouldUpdate(true);
    //     } else {
    //       setShouldUpdate(false);
    //     }
    // }, [data]);



    // const sendpusher = async () => {
    //     await pusher.init({
    //         apiKey: "7d3cf02011bb653450a0",
    //         cluster: "mt1"
    //     });
    //     await pusher.connect();
    //     await pusher.subscribe({
    //         channelName: "pharmaceuticals",
    //         onEvent: (event: PusherEvent) => {
    //             console.log(`Event received: ${event}`);
    //             let newMessage = JSON.parse(event.data)
    //             if (group_id == newMessage.receiver_id ) {
    //                 console.log('my message', group_id);
    //                 setmessId(); 
    //                 setmessId(group_id); 
    //             }
    //         }
    //     });
    // }

    // useEffect(() => {
    //     sendpusher()
    // }, []);

    

    return (
        <SafeAreaView style={{width: '100%', height: '100%',}}>
        <GoBack text={name} />
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 140}
            style={styles.bg}>
            <ImageBackground source={bg} style={styles.bg}>
                {/* <FlatList
                    data={messages}
                    renderItem={({ item }) => <GroupMessage message={item} />}
                    style={styles.list}
                    inverted
                    showsVerticalScrollIndicator={false}
                /> */}

                <TableView
                isInverted
                isNotChat={false}
                apiEndpoint={getMessagesEndpoint}
                enablePullToRefresh={false}
                params={{group_id: messId}}
                renderItem={({ item }) => <GroupMessage message={item} />}
                />

                <InputBoxGroup receiverID={group_id} submit={(msg) => {}} />
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

