import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import SignIn from './src/screens/SignIn';
import SignUpPharmacy from './src/screens/Pharmacy/SignUpPharmacy';
import SignInPharmacy from './src/screens/Pharmacy/SignInPharmacy';
import ConfirmProfile from './src/screens/ConfirmProfile';
import ReportPage from './src/screens/ReportPage';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SignIn" options={{headerShown: false}}>
          {() => <SignIn />}
        </Stack.Screen>

        <Stack.Screen name="SignUpPharmacy" options={{headerShown: false}}>
          {() => <SignUpPharmacy />}
        </Stack.Screen>

        <Stack.Screen name="SignInPharmacy" options={{headerShown: false}}>
          {() => <SignInPharmacy />}
        </Stack.Screen>

        <Stack.Screen name="ConfirmProfile" options={{headerShown: false}}>
          {() => <ConfirmProfile />}
        </Stack.Screen>

        <Stack.Screen name="ReportPage" options={{headerShown: false}}>
          {() => <ReportPage />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
