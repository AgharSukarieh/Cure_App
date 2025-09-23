import { View, Text, Dimensions, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Image, TextInput, KeyboardAvoidingView, Platform, I18nManager } from 'react-native';
import React, { useState, useRef } from 'react';
import GoBack from '../components/GoBack';
import { caht } from '../helpers/data';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const Chat = () => {
    const { t } = useTranslation();
    const isRTL = I18nManager.isRTL;
    const id = 1
    const [mindex, setmindex] = useState(-1)
    const scrollViewRef = useRef();

    const [textInputHeight, setTextInputHeight] = useState(40);

    const handleContentSizeChange = (event) => {
        const { height } = event.nativeEvent.contentSize;
        // Update the TextInput height with the new height
        setTextInputHeight(height);
    };
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>
                <GoBack text={t("chat.headerTitle")} />
                <View style={{ width: '100%', height: '100%', }}>
                    <View style={styles.messagebox}>
                        <ScrollView ref={scrollViewRef}
                            onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}>
                            <KeyboardAwareScrollView>
                                {caht.map((item, index) => (
                                    <View key={index} style={{ marginBottom: 5, alignSelf: item.userid == id ? 'flex-end' : 'flex-start', }}>
                                        {item.userid != id &&
                                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                <Image source={item.imageurl ? item.imageurl : require('../../assets/user.png')} resizeMode='cover' style={{ width: 25, height: 25, borderRadius: 99 }} />
                                                <Text style={{ marginLeft: 5, fontSize: 15 }}>{item.uname} </Text>
                                            </View>
                                        }
                                        <TouchableOpacity onPress={() => { mindex == index ? setmindex(-1) : setmindex(index) }} style={item.userid == id ? styles.message1 : styles.message2}>
                                            <Text style={{ color: '#fff', fontSize: 20 }}>{item.message}</Text>
                                        </TouchableOpacity>
                                        {mindex == index &&
                                            <Text style={{ textAlign: item.userid != id ? 'left' : 'right' }}>{item.time}</Text>
                                        }

                                    </View>
                                ))}
                            </KeyboardAwareScrollView>
                        </ScrollView>
                    </View>
                    <View style={styles.sendbox}>
                        <View style={styles.sendbox2}>
                            <TextInput
                                placeholder={t("chat.typeMessage")} 
                                multiline={true}

                                numberOfLines={10}
                                textAlignVertical='top'
                                onContentSizeChange={handleContentSizeChange}
                                style={{ ...styles.messageinput, height: textInputHeight, textAlign: isRTL ? 'right' : 'left' }}

                            />
                            <TouchableOpacity style={styles.send} onPress={() => { }}>
                                <Feather name="send" color={'#469ED8'} size={30} style={{ marginHorizontal: 0 }} />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </KeyboardAvoidingView>
        </SafeAreaView >
    );
};

export default Chat;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        height: height,
        backgroundColor: '#fff'
    },
    messagebox: {
        height: '83%',
        width: '100%',
        paddingHorizontal: 7,
        paddingVertical: 6
    },
    message1: {
        backgroundColor: '#895eeb',
        paddingVertical: 10,
        paddingRight: 20,
        paddingLeft: 10,
        borderRadius: 10,
        alignSelf: 'flex-start',
        marginVertical: 5
    },
    message2: {
        backgroundColor: '#469ED8',
        paddingVertical: 10,
        paddingLeft: 10,
        paddingRight: 20,
        borderRadius: 10,
        alignSelf: 'flex-end',
        marginVertical: 5
    },
    sendbox: {
        height: 100,
        width: '100%',
        position: 'absolute',
        bottom: 35
    },
    sendbox2: {
        width: '95%',
        height: '50%',
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: "#469ED8",
        marginBottom: 10,
        borderRadius: 7
    },
    messageinput: {
        width: '88%',
        height: '100%',
    },
    send: {
        width: '12%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start'
    }
});