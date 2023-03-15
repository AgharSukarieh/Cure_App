import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import SignIn from './src/screens/SignIn';
import SignUpPharmacy from './src/screens/Pharmacy/SignUpPharmacy';
import SignInPharmacy from './src/screens/Pharmacy/SignInPharmacy';
import ConfirmProfile from './src/screens/ConfirmProfile';
import ReportPage from './src/screens/ReportPage';
import Sales from './src/screens/Sales';
import Monthly from './src/screens/Monthly';
import Weekly from './src/screens/Weekly';
import Daily from './src/screens/Daily';
import Clientpharmalist from './src/screens/Clientpharmalist';
import Clientdoctorlist from './src/screens/Clientdoctorlist';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
        <Stack.Screen name="SignUpPharmacy" component={SignUpPharmacy} options={{ headerShown: false }} />
        <Stack.Screen name="SignInPharmacy" component={SignInPharmacy} options={{ headerShown: false }} />
        <Stack.Screen name="ConfirmProfile" component={ConfirmProfile} options={{ headerShown: false }} />
        <Stack.Screen name="ReportPage" component={ReportPage} options={{ headerShown: false }} />
        <Stack.Screen name="Sales" component={Sales} options={{ headerShown: false }} />
        <Stack.Screen name="Monthly" component={Monthly} options={{ headerShown: false }} />
        <Stack.Screen name="Weekly" component={Weekly} options={{ headerShown: false }} />
        <Stack.Screen name="Daily" component={Daily} options={{ headerShown: false }} />
        <Stack.Screen name="Clientpharmalist" component={Clientpharmalist} options={{ headerShown: false }} />
        <Stack.Screen name="Clientdoctorlist" component={Clientdoctorlist} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer >
  );
}
