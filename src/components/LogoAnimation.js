import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const Logo = ({ iconSize = 161 }) => {
  const strokeDashoffset = useRef(new Animated.Value(3000)).current; 
  const fillOpacity = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    const strokeAnimation = Animated.timing(strokeDashoffset, {
      toValue: 0,
      duration: 2000, 
      useNativeDriver: false,
    });

    const fillAnimation = Animated.timing(fillOpacity, {
      toValue: 1,
      duration: 1000, 
      useNativeDriver: false,
    });

    Animated.sequence([
      strokeAnimation,
      fillAnimation
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Svg
        width={iconSize}
        height={iconSize * 0.87}
        viewBox="0 0 161.000000 140.000000"
      >
        <G transform="translate(0.000000,140.000000) scale(0.100000,-0.100000)">
          <AnimatedPath
            d="M1120 1225 c0 -9 18 -39 41 -67 52 -66 84 -129 98 -196 17 -82 13 -122 -18 -189 -34 -72 -64 -89 -93 -53 -16 20 -18 34 -12 105 5 57 3 89 -6 105 l-12 23 -19 -24 c-52 -66 -65 -235 -27 -336 31 -85 37 -120 27 -159 -14 -49 -59 -96 -126 -132 -78 -41 -162 -56 -283 -50 -91 5 -106 8 -186 47 -158 75 -278 227 -308 386 -12 62 -14 67 -21 41 -12 -45 2 -195 24 -261 73 -210 212 -343 416 -395 278 -71 543 52 669 311 153 317 113 672 -93 824 -53 38 -71 43 -71 20z"
            fill="#183E9F"
            fillOpacity={fillOpacity}
            stroke="#183E9F"
            strokeWidth="3"
            strokeDasharray="3000"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          <AnimatedPath
            d="M695 806 c-21 -21 -25 -34 -25 -88 l0 -63 -61 3 c-52 3 -64 1 -85 -19 -52 -49 -9 -99 86 -99 l56 0 24 48 c13 26 42 69 65 95 39 45 42 52 35 84 -10 40 -16 48 -47 57 -17 5 -29 1 -48 -18z"
            fill="#183E9F"
            fillOpacity={fillOpacity}
            stroke="#183E9F"
            strokeWidth="6"
            strokeDasharray="3000" 
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
         
          <AnimatedPath
            d="M1076 1131 c-3 -5 12 -31 34 -57 54 -66 99 -160 107 -222 3 -29 9 -55 14 -57 14 -9 20 69 9 123 -22 119 -134 263 -164 213z"
            fill="#183E9F"
            fillOpacity={fillOpacity}
            stroke="#183E9F"
            strokeWidth="6"
            strokeDasharray="3000"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
        
          <AnimatedPath
            d="M578 1130 c-86 -15 -194 -86 -247 -164 -140 -203 -61 -480 170 -595 63 -31 95 -33 49 -2 -58 38 -102 88 -133 150 -29 60 -32 75 -32 156 0 80 3 97 32 157 63 134 173 208 318 216 95 5 134 -5 205 -54 60 -41 65 -29 11 24 -49 47 -150 99 -220 112 -60 11 -85 11 -153 0z"
            fill="#189FE2"
            fillOpacity={fillOpacity}
            stroke="#189FE2"
            strokeWidth="6"
            strokeDasharray="3000"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          <AnimatedPath
            d="M885 720 c-44 -10 -103 -44 -124 -71 -25 -32 -92 -161 -86 -167 5 -5 159 45 198 65 45 23 107 83 128 126 11 21 18 41 15 44 -9 9 -99 11 -131 3z"
            fill="#189FE2"
            fillOpacity={fillOpacity}
            stroke="#189FE2"
            strokeWidth="6"
            strokeDasharray="3000"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', 
  },
});

export default Logo;
