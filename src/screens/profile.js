import { View, Dimensions, Text, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet, TextInput, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { styles } from '../components/styles';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/Feather';
import Constants from '../config/globalConstants';
import HomeHeader from '../components/homeHeader';


const wheight = Dimensions.get('window').height
const getCityAreaEndpoint = Constants.users.cityArea;

const Profile = () => {
    const navigation = useNavigation();
    const { logout, role, user } = useAuth();
    const date = new Date().toLocaleDateString();


    const LogoutPress = async () => {
        await logout()
            .then(() => {
                navigation.navigate('SignIn');
            })
            .catch(err => {
                console.log(err);
            });
    };

    return (
        <SafeAreaView style={{ ...styles.container, backgroundColor: '#ebebeb96' }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <HomeHeader username={user?.name} supervisorname={'Waleed'} />
                <View style={style.mainview}>

                    <View style={style.cardsView}>
                        <TouchableOpacity style={style.card} onPress={() => { navigation.navigate('EditProfle') }}>
                            <Icon name="user" color='#3A97D6' size={32} style={{ marginHorizontal: 5 }} />
                            <Text style={style.cardtext}>Edit Profile</Text>
                        </TouchableOpacity>

                    </View>
                    <TouchableOpacity style={style.logbtn} onPress={() => { LogoutPress() }}>
                        <Icon name="log-out" color='#e94343bf' size={25} style={{ marginHorizontal: 2 }} />
                        <Text style={style.cardtext2}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView >
    )
};

const style = StyleSheet.create({
    mainview: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,

    },
    searchView: {
        width: '90%',
        backgroundColor: '#fff',
        alignSelf: 'center',
        marginTop: 15,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'grey'
    },
    cardsView: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    card: {
        width: '100%',
        paddingVertical: 10,
        backgroundColor: '#F6F9FE',
        borderRadius: 20,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#a8d7f1',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    logbtn: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#FCE2E2',
        borderRadius: 20,
        marginBottom: 15,
        borderWidth: 2,
        marginTop: 15,
        borderColor: '#e94343bf',
        paddingVertical: 7,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardimage: { width: '50%', height: '50%', },
    cardtext: { color: '#000', fontWeight: '600', marginTop: 0, fontSize: 17 },
    cardtext2: { color: '#000', fontWeight: '600', marginTop: 0, fontSize: 17 },
})
export default Profile;
