import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import SignIn from './src/screens/SignIn';
import SignUpPharmacy from './src/screens/Pharmacy/SignUpPharmacy';
import SignInPharmacy from './src/screens/Pharmacy/SignInPharmacy';
import ConfirmProfile from './src/screens/ConfirmProfile';
import ChatPage from './src/screens/ChatPages/ChatPage';
import ChatScreen from './src/screens/ChatPages/ChatScreen';
import GroupPage from './src/screens/ChatPages/GroupPage';
import ContactsScreen from './src/screens/ChatPages/ContactsScreen'
import { useAuth } from './src/contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import FirstScreen from './src/screens/firstScreen';
import BottomTabs from './src/General/BottomTabNavigator';
import EditProfle from './src/screens/editProfle';
import PresentImage from './src/screens/ChatPages/PresentImage';

export default function App() {

  const Stack = createNativeStackNavigator();
  const { isLoggedIn, isLoading, token } = useAuth();

  const setRoot = () => {
    if (isLoggedIn && token) {
      return 'BottomTabs';
    } else {
      return 'FirstScreen';
    }
  }

  return isLoading ? (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color='blue' />
    </View>
  ) : (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={setRoot()}>
        <Stack.Screen name="FirstScreen" component={FirstScreen} />
        <Stack.Screen name="BottomTabs" component={BottomTabs} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUpPharmacy" component={SignUpPharmacy} />
        <Stack.Screen name="SignInPharmacy" component={SignInPharmacy} />
        <Stack.Screen name="ConfirmProfile" component={ConfirmProfile} />
        <Stack.Screen name="ChatPage" component={ChatPage} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="GroupPage" component={GroupPage} />
        <Stack.Screen name="ContactsScreen" component={ContactsScreen} />
        <Stack.Screen name="EditProfle" component={EditProfle} />
        <Stack.Screen name="PresentImage" component={PresentImage} /> 
      </Stack.Navigator>
    </NavigationContainer >
  );
} 