import { View, Dimensions, Text, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet, TextInput, Image, I18nManager } from 'react-native';
import React, { useState, useEffect } from 'react';
import { styles } from '../components/styles';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/Feather';
import Constants from '../config/globalConstants';
import HomeHeader from '../components/homeHeader';
import GoBack from '../components/GoBack';
import Input from '../components/Input';
import Button from '../components/Button';
import { useTranslation } from 'react-i18next';


const wheight = Dimensions.get('window').height
const getCityAreaEndpoint = Constants.users.cityArea;

const EditProfle = () => {
    const { t } = useTranslation();
    const isRTL = I18nManager.isRTL;r
    const navigation = useNavigation();
    const { user } = useAuth();
    const [name, setname] = useState('');
    const [email, setemail] = useState('');
    const [phone, setphone] = useState('');

    useEffect(() => {
        setname(user.name)
        setemail(user.email)
        setphone(user.phone)
    }, [user])

    return (
        <SafeAreaView style={{ ...styles.container, backgroundColor: '#ebebeb96' }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <GoBack text={t('editProfile.headerTitle')} />
                <View style={style.inputContainer}>
                    <Text style={[style.inputheader, isRTL && style.rtlText]}>{t('editProfile.yourProfile')}</Text>
                    <Input lable={t('editProfile.name')} setData={setname} value={name} placeholder={t('editProfile.name')} isEditable = {false}/>
                    <Input lable={t('editProfile.email')} setData={setemail} value={email} placeholder={t('editProfile.email')} isEditable = {false}/>
                    <Input lable={t('editProfile.phone')} setData={setphone} value={phone} placeholder={t('editProfile.phone')} isEditable = {false}/>
                    {/* <Button text={'Submit'} handleClick={ () => {} } /> */}
                </View>

            </ScrollView>
        </SafeAreaView >
    )
};

const style = StyleSheet.create({
    content: { flex: 1, justifyContent: 'flex-start', backgroundColor: '#ebebeb96' },
    imagediv: { width: '100%', height: '35%', },
    image: { width: '100%', height: '100%', },
    inputContainer: {
        alignSelf: 'center',
        backgroundColor: '#fff',
        width: '95%',
        borderRadius: 15,
        paddingVertical: 12
    },
    inputheader: { fontSize: 17, fontWeight: '600', marginHorizontal: 10, color: '#000' },
    rtlText: {
        textAlign: 'right',
        writingDirection: 'rtl',
    },
});
export default EditProfle;
