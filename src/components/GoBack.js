import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { styles } from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

// Icon.loadFont();
const GoBack = ({ text, addButton=false, addButtonFunc }) => {
  const navigation = useNavigation();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, justifyContent: 'center',paddingHorizontal:10, paddingRight:20 }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon
          name="arrow-back-ios"
          size={20}
          color="#7189FF"
          style={styles.arrowBack}
        />
      </TouchableOpacity>
      <Text style={styles.textRightStyle}>{text}</Text>
      {addButton && <TouchableOpacity onPress={addButtonFunc}>
        <AntDesign
          name="form"
          size={20}
          color="#7189FF"
          style={{...styles.arrowBack}}
        />
      </TouchableOpacity>}
    </View>
  );
};

export default GoBack;
