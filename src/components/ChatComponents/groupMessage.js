import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, Linking, Platform } from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { useNavigation } from '@react-navigation/native';
import MapMH from './Map';
import moment from 'moment';
import { useAuth } from '../../contexts/AuthContext';

const GroupMessage = ({ message }) => {
    const navigation = useNavigation();
    const { user, token } = useAuth();
    const currentUserId = user.id;

    const isMyMessage = () => {
        return message.sender_id === currentUserId;
    };

    return (
        <View
            style={{
                ...styles.container,
                backgroundColor: isMyMessage() ? '#8ab7eb' : 'white', //'#DCF8C5'
                alignSelf: isMyMessage() ? 'flex-end' : 'flex-start',
            }}>
            {message.sender_id != currentUserId &&
                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 5, }}>
                    <Image source={message?.sender?.image ? { uri: message?.sender?.image } : require('../../../assets/user.png')} style={{ width: 25, height: 25, }} />
                    <Text style={{ color: '#000', marginHorizontal: 5 }}>{message?.sender?.name ?? ''}</Text>
                </View>
            }
            {message?.latitude && message?.longitude && (
                <Pressable
                    onPress={() => {
                        const latitude = message?.latitude;
                        const longitude = message?.longitude;
                        const label = 'Location'; // Replace with your desired label or address

                        const url = `https://www.google.com/maps?q=${latitude},${longitude}(${label})`;

                        Linking.canOpenURL(url)
                            .then((supported) => {
                                if (supported) {
                                    Linking.openURL(url);
                                } else {
                                    console.log("Cannot open Google Maps");
                                }
                            })
                            .catch((error) => console.log(error));
                    }}>
                    <MapMH
                        lat={parseFloat(message?.latitude)}
                        long={parseFloat(message?.longitude)}
                        style={{ ...styles.selectedMap, margin: 0 }}
                    />
                </Pressable>
            )}
            {message?.images && (
                <Pressable
                    onPress={() =>
                        navigation.navigate('PresentImage', { arrayOfURI: message?.images })
                    }>
                    <Image
                        source={{ uri: message?.images }}
                        style={{ ...styles.selectedImage, marginBottom: 5 }}
                        resizeMode="cover"
                    />
                </Pressable>
            )}
            <Text>{message?.text}</Text>
            <Text style={styles.time}>{dayjs(moment.utc(message?.created_at).local().format()).fromNow(true)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 5,
        padding: 10,
        borderRadius: 10,
        maxWidth: '80%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
    },
    message: {},
    time: {
        alignSelf: 'flex-end',
        color: '#696a6b',
    },
    selectedImage: {
        height: 100,
        width: 200,
        borderRadius: 10,
    },
    selectedMap: {
        height: 150,
        width: '100%',
        minWidth: '80%',
        margin: 5,
        borderRadius: 10,
    },
});

export default GroupMessage;
