import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {styles} from './styles';
import Icon from 'react-native-vector-icons/Feather';

const Input = ({lable, isPassword, setData}) => {
  const [showEye, setShowEye] = useState(false);
  return (
    <View style={styles.inbutContainer}>
      <Text style={styles.label}>{lable}</Text>
      <TextInput
        style={styles.input}
        onChangeText={text => setData(text)}
        secureTextEntry={isPassword && !showEye}
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
