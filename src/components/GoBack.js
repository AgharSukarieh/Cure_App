import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { styles } from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

Icon.loadFont();
const GoBack = ({ text }) => {
  const navigation = useNavigation();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, justifyContent: 'center' }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon
          name="arrow-back-ios"
          size={20}
          color="#7189FF"
          style={styles.arrowBack}
        />
      </TouchableOpacity>
      <Text style={styles.textRightStyle}>{text}</Text>
    </View>
  );
};

export default GoBack;
