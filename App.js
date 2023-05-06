import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import SignIn from './src/screens/SignIn';
import SignUpPharmacy from './src/screens/Pharmacy/SignUpPharmacy';
import SignInPharmacy from './src/screens/Pharmacy/SignInPharmacy';
import ConfirmProfile from './src/screens/ConfirmProfile';
import ReportPage from './src/screens/Medical/ReportPage';
import Sales from './src/screens/Sales';
import Monthly from './src/screens/Medical/Monthly';
import Weekly from './src/screens/Medical/Weekly';
import Daily from './src/screens/Medical/Daily';
import Clientpharmalist from './src/screens/Clientpharmalist';
import Clientdoctorlist from './src/screens/Clientdoctorlist';
import ReportPageSales from './src/screens/Sales/ReportPageSales';
import MonthlySales from './src/screens/Sales/MonthlyPlanSales';
import WeeklySales from './src/screens/Sales/WeeklySales';
import DailySales from './src/screens/Sales/DailySales';
import Inventory from './src/screens/Sales/Inventory';
import Order from './src/screens/Sales/Order';
import Chat from './src/screens/chat';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Firstscreen from './src/helpers/firstscreen';
import Locationupdate from './src/Provider/Locationupdate';
import Sal_rep_pharm from './src/screens/Sales/sal_rep_pharm';


export default function App() {

  const [logedin, setlogedin] = useState(false)
  // console.log(logedin);
  const getlogs = async () => {
    const a = await AsyncStorage.getItem('userInfo')
    let user = (JSON.parse(a))
    if (user) {
      setlogedin(true)
    }
  }


  // Locationupdate()


  useEffect(() => {
    getlogs()
  }, []);


  const Stack = createNativeStackNavigator();
  const Role = "Sales";
  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name="Firstscreen" component={Firstscreen} options={{ headerShown: false }} />

        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
        {/* <Stack.Screen name="ReportPage" component={Role == "Sales" ? ReportPageSales : ReportPage} options={{ headerShown: false }} /> */}
        <Stack.Screen name="ReportPage" component={ReportPage} options={{ headerShown: false }} />
        <Stack.Screen name="SignUpPharmacy" component={SignUpPharmacy} options={{ headerShown: false }} />
        <Stack.Screen name="SignInPharmacy" component={SignInPharmacy} options={{ headerShown: false }} />
        <Stack.Screen name="ConfirmProfile" component={ConfirmProfile} options={{ headerShown: false }} />

        <Stack.Screen name="Sales" component={Sales} options={{ headerShown: false }} />
        <Stack.Screen name="Monthly" component={Monthly} options={{ headerShown: false }} />
        <Stack.Screen name="Weekly" component={Weekly} options={{ headerShown: false }} />
        {/* <Stack.Screen name="Weekly" component={Role == "Sales" ? WeeklySales : Weekly} options={{ headerShown: false }} /> */}
        <Stack.Screen name="Daily" component={Role == "Sales" ? DailySales : Daily} options={{ headerShown: false }} />
        <Stack.Screen name="Clientlist" component={Role == "Sales" ? Clientpharmalist : Clientdoctorlist} options={{ headerShown: false }} />
        <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
        <Stack.Screen name="Sal_rep_pharm" component={Sal_rep_pharm} options={{ headerShown: false }} />
        <Stack.Screen name="Inventory" component={Inventory} options={{ headerShown: false }} />
        <Stack.Screen name="Order" component={Order} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer >
  );
}
