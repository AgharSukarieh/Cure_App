import {View, Text, Image} from 'react-native';
import React from 'react';
import {styles} from './styles';

const TopView = ({text}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Image
        source={require('../../assets/images/sideImage.png')}
        style={styles.imageSideStyle}
      />
      <Text style={styles.textRightStyle}>{text}</Text>
    </View>
  );
};

export default TopView;
