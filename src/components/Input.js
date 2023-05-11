import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {styles} from './styles';
import Icon from 'react-native-vector-icons/Feather';

Icon.loadFont()
const Input = ({lable, placeholder,isPassword, setData, labelStyle=styles.label ,viewStyle= styles.inbutContainer,style = styles.input, value = null, multiline = false, numberOfLines=0 }) => {
  const [showEye, setShowEye] = useState(false);
  return (
    <View style={{...styles.inbutContainer, ...viewStyle}}>
      <Text style={{...styles.label, ...labelStyle}}>{lable}</Text>
      <TextInput
        style={style}
        onChangeText={text => setData(text)}
        secureTextEntry={isPassword && !showEye}
        value={value}
        multiline={multiline}
        numberOfLines={numberOfLines}
        placeholder={placeholder}
      />

      {isPassword && (
        <>
          {!showEye ? (
            <TouchableOpacity
              onPress={() => setShowEye(!showEye)}
              style={styles.iconPassword}>
              <Icon name="eye" size={20} color="black" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.iconPasswordHide}
              onPress={() => setShowEye(!showEye)}>
              <Icon
                name="eye-off"
                size={20}
                color="black"
                style={styles.iconPassword}
              />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default Input;
