import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import SignIn from './src/screens/SignIn';
import SignUpPharmacy from './src/screens/Pharmacy/SignUpPharmacy';
import SignInPharmacy from './src/screens/Pharmacy/SignInPharmacy';
import ConfirmProfile from './src/screens/ConfirmProfile';
import ReportPage from './src/screens/ReportPage';
import Sales from './src/screens/Sales';
import DailySales from './src/screens/DailySales';
import Monthly from './src/screens/Monthly';
import Weekly from './src/screens/Weekly';
import Daily from './src/screens/Daily';
import Clientpharmalist from './src/screens/Clientpharmalist';
import Clientdoctorlist from './src/screens/Clientdoctorlist';
import ReportPageSales from './src/screens/Sales/ReportPageSales';
import MonthlySales from './src/screens/Sales/MonthlyPlanSales';
import WeeklySales from './src/screens/Sales/WeeklySales';

export default function App() {
  const Stack = createNativeStackNavigator();
  const Role ="Sales";
  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
        <Stack.Screen name="SignUpPharmacy" component={ SignUpPharmacy} options={{ headerShown: false }} />
        <Stack.Screen name="SignInPharmacy" component={SignInPharmacy} options={{ headerShown: false }} />
        <Stack.Screen name="ConfirmProfile" component={ConfirmProfile} options={{ headerShown: false }} />
        <Stack.Screen name="ReportPage" component={Role == "Sales" ?ReportPageSales :ReportPage} options={{ headerShown: false }} />
        <Stack.Screen name="Sales" component={Sales} options={{ headerShown: false }} />
        {/* <Stack.Screen name="DailySales" component={Role == "Sales" ?DailySales} options={{ headerShown: false }} /> */}
        <Stack.Screen name="Monthly" component={Role == "Sales" ? MonthlySales :Monthly} options={{ headerShown: false }} />
        <Stack.Screen name="Weekly" component={Role == "Sales" ? WeeklySales :Weekly} options={{ headerShown: false }} />
        <Stack.Screen name="Daily" component={Role == "Sales" ? DailySales :Daily} options={{ headerShown: false }} />
        <Stack.Screen name="Clientpharmalist" component={Clientpharmalist} options={{ headerShown: false }} />
        <Stack.Screen name="Clientdoctorlist" component={Clientdoctorlist} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer >
  );
}
