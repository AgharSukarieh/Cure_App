import { View, SafeAreaView, ScrollView, I18nManager } from 'react-native';
import React, { useState } from 'react';
import { styles } from '../components/styles';
import TopView from '../components/TopView';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useTranslation } from 'react-i18next';

const ConfirmProfile = () => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phne, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('');

  const navigation = useNavigation();

  const handleConfirm = () => {
    navigation.navigate("ReportPage")
    //
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAwareScrollView> 
          <TopView text={t('confirmProfile.headerTitle')} />
          <Input lable={t('confirmProfile.username')} setData={setUsername} />
          <Input lable={t('confirmProfile.firstname')} setData={setFirstname} />
          <Input lable={t('confirmProfile.lastname')} setData={setLastname} />
          <Input lable={t('confirmProfile.email')} setData={setEmail} />
          <Input
            lable={t('confirmProfile.newPassword')}
            setData={setNewPassword}
            isPassword={true}
          />
          <Input
            lable={t('confirmProfile.confirmPassword')}
            setData={setConfirmPassword}
            isPassword={true}
          />
          <Input lable={t('confirmProfile.phone')} setData={setPhone} />
          <Input lable={t('confirmProfile.address')} setData={setAddress} />
          <Input lable={t('confirmProfile.status')} setData={setStatus} />

          <Button text={t('confirmProfile.confirm')} handleClick={handleConfirm} />

        </KeyboardAwareScrollView>
      </ScrollView>
    </View>
  );
};

export default ConfirmProfile;
