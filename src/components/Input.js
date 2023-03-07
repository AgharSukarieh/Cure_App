import {View, Text, TextInput} from 'react-native';
import React, {useState} from 'react';
import {styles} from './styles';
import Icon from 'react-native-vector-icons/dist/Feather';

const Input = ({lable, isPassword, setData}) => {
  const [showEye, setShowEye] = useState(false);
  return (
    <View style={styles.inbutContainer}>
      <Text style={styles.label}>{lable}</Text>
      <TextInput
        style={styles.input}
        onChangeText={text => setData(text)}
        secureTextEntry={isPassword && showEye}
      />

      {isPassword && (
        <>{showEye && <Icon name="eye-off" size={20} color="black" />}</>
      )}
    </View>
  );
};

export default Input;
