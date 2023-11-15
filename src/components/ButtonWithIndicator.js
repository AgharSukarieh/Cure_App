import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

const ButtonWithIndicator = ({ text, clickable = true, onClick, style, hBorder = true }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isClickable, setIsClickable] = useState(clickable);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    setIsClickable(clickable);
  }, [clickable]);

  const handleButtonClick = async () => {
    if (isClickable) {
      setIsClickable(false);
      setShowIndicator(true);
      await onClick();
      setShowIndicator(false);
      setIsClickable(true);
    }
  };

  const ButtonContent = () => (
    <>
      <Text style={[styles.buttonText,{color: '#FFFFFF'},]}>{text}</Text>
      {showIndicator ? (<ActivityIndicator style={styles.indicator} size="small" color={'#FFFFFF'} />) : null}
    </>
  );

  const RenderButton = () => {
      return (
        <View style={[styles.buttonContainer, {backgroundColor: isClickable ? (isClicked ? '#AAAAAA' : '#7189FF') : '#777777', borderWidth: hBorder ? 2 : 0}, style]}>
          <ButtonContent/>
        </View>
      );
  };

  return (
    <TouchableOpacity onPress={handleButtonClick} activeOpacity={isClickable ? 0.7 : 1}>
      <RenderButton/>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    height: 45,
    overflow: 'hidden', 
    marginBottom:10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  indicator: {
    marginLeft: 10,
  },
});

export default ButtonWithIndicator;
