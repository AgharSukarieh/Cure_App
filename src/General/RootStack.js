// RootNavigator.js
import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabs from './BottomTabNavigator';   // فيه كل الشاشات الرئيسية
import ChangeLanguageScreen from '../screens/Language';

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {/* البار + كل الشاشات */}
      <RootStack.Screen name="BottomTabs" component={BottomTabs} />

      {/* شاشة مستقلة بدون بار */}
      <RootStack.Screen name="ChangeLanguageScreen" component={ChangeLanguageScreen} />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
