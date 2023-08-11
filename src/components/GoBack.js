import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { styles } from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

Icon.loadFont();
const GoBack = ({ text, addButton = false, addButtonFunc, isIcon }) => {
  const navigation = useNavigation();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, justifyContent: 'center', paddingHorizontal: 10, paddingRight: 20 }}>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon
          name="arrow-back-ios"
          size={20}
          color="#000"
          style={styles.arrowBack}
        />
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', alignItems: 'center', }}>
        <Text style={styles.textRightStyle}>{text}</Text>
        {isIcon &&
          <FontAwesome
            name={isIcon}
            size={20}
            color="#000"
            style={{ ...styles.arrowBack }}
          />
        }
      </View>
      {addButton && <TouchableOpacity onPress={addButtonFunc}>
        <AntDesign
          name="form"
          size={20}
          color="#000"
          style={{ ...styles.arrowBack }}
        />
      </TouchableOpacity>}
    </View>
  );
};

export default GoBack;
