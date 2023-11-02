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
import GoBack from '../../components/GoBack';
import GroupMessage from '../../components/ChatComponents/groupMessage';
import InputBoxGroup from '../../components/ChatComponents/InputBoxGroup';
import globalConstants from '../../config/globalConstants';
import { usePusher } from '../../contexts/PusherContext';
import { get } from '../../WebService/RequestBuilder';
const getMessagesEndpoint = globalConstants.group_chat.get_mess;
const putSeenMessagesEndpoint = globalConstants.group_chat.seen_chat

const GroupPage = ({ route, navigation }) => {
    const { group_id, name, func } = route.params;
    const {dataForGroup} = usePusher();
    const [chats, setChats] = useState([]);
    const [page, setPage] = useState(1);

    const getChats = (page) => {
        get(getMessagesEndpoint, null, {page: page, group_id: group_id}).then((res) => {
            if (chats?.length > 0) {
                if (!(page > 1)) {
                    setChats([])
                }
                setChats((prev) => [...prev, ...res.data]);
            }else {
                setChats(res.data)
            }
        }).catch((err) => {

        })
    }

    const putSeen = () => {
        get(putSeenMessagesEndpoint, null, {group_id: group_id}).then((res) => {
            func()
        }).catch((err) => {

        })
      }

    useEffect(() => {
        if (dataForGroup?.receiver_id == group_id) {
            setChats((prev) => [...prev])
            setPage(1)
            getChats(1)
            putSeen()
        }
    }, [dataForGroup]);

    

    useEffect(() => {
        getChats(1)
    }, []);

    return (
        <SafeAreaView style={{width: '100%', height: '100%',}}>
        <GoBack text={name} />
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 140}
            style={styles.bg}>
            <ImageBackground source={bg} style={styles.bg}>
                <FlatList
                    data={chats}
                    inverted
                    renderItem={({ item }) => <GroupMessage message={item} />}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={() => 
                    {
                        setPage(page + 1)
                        getChats(page + 1)
                    }}
                    showsVerticalScrollIndicator={false}
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

