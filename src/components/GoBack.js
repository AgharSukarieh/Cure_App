import { View, Text, TouchableOpacity, I18nManager } from 'react-native';
import React from 'react';
import { styles } from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

Icon.loadFont();
const GoBack = ({ text, addButton = false, addButtonFunc, isIcon }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  return (
    <View style={[
      { 
        flexDirection: isRTL ? 'row-reverse' : 'row', 
        alignItems: 'center', 
        paddingVertical: 8, 
        justifyContent: 'center', 
        paddingHorizontal: 10, 
        paddingRight: isRTL ? 10 : 20,
        paddingLeft: isRTL ? 20 : 10,
      }
    ]}>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon
          name={isRTL ? "arrow-back-ios" : "arrow-back-ios"}
          size={20}
          color="#0D38AC"
          style={styles.arrowBack}
        />
      </TouchableOpacity>
      <View style={{ 
        flexDirection: isRTL ? 'row-reverse' : 'row', 
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
      }}>
        <Text style={[
          styles.textRightStyle,
          isRTL && { textAlign: 'right', writingDirection: 'rtl' }
        ]}>
          {t(text)}
        </Text>
        {isIcon &&
          <FontAwesome
            name={isIcon}
            size={20}
            color="#0D38AD"
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
