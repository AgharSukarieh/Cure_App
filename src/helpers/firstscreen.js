import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { styles } from '../components/styles';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Firstscreen = () => {

    const navigation = useNavigation();

    const islogged = async () => {
        const userInfo2 = await AsyncStorage.getItem('userInfo')
        if (userInfo2 != null) {
            navigation.navigate('ReportPage')
        } else {
            navigation.navigate('SignIn')
        }
    }
    useEffect(() => {
        islogged();
    }, []);


    return (
        <View style={styles.Firstscreen}>

        </View>
    );
};

export default Firstscreen;
