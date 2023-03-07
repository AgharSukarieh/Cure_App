import {TouchableOpacity, Text, View} from 'react-native';
import React from 'react';
import {styles} from './styles';

const Button = ({handleClick, text}) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={handleClick}>
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Button;
