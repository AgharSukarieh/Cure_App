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
import Return from './src/screens/Sales/Return';
import AccountInfo from './src/screens/Sales/AccountInfo';
import Chat from './src/screens/chat';
import ChatPage from './src/screens/ChatPages/ChatPage';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Firstscreen from './src/helpers/firstscreen';
import Locationupdate from './src/Provider/Locationupdate';
import Sal_rep_pharm from './src/screens/Sales/sal_rep_pharm';
import MainClientdoctorlist from './src/screens/MainClientdoctorlist';
import ChatScreen from './src/screens/ChatPages/ChatScreen';
import ContactsScreen from './src/screens/ChatPages/ContactsScreen';
import PresentImage from './src/screens/ChatPages/PresentImage';
import {useAuth} from './src/contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function App() {
  const Stack = createNativeStackNavigator();
  const {isLoggedIn, isLoading, token, role} = useAuth();

  const setRoot = () => {
    if (isLoggedIn && token) {
      return 'ReportPage';
    } else {
      return 'SignIn';
    }
  }

  return isLoading ? (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color='blue'/>
    </View>
  ) : (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={setRoot()}>
        <Stack.Screen name="SignIn" component={SignIn}/>
        <Stack.Screen name="ReportPage" component={ReportPage}/>

        <Stack.Screen name="SignUpPharmacy" component={SignUpPharmacy}/>
        <Stack.Screen name="SignInPharmacy" component={SignInPharmacy}/>
        <Stack.Screen name="ConfirmProfile" component={ConfirmProfile}/>

        <Stack.Screen name="Sales" component={Sales} />






        <Stack.Screen name="Monthly" component={Monthly} options={{ headerShown: false }} />
        <Stack.Screen name="Weekly" component={Weekly} options={{ headerShown: false }} />
        {/* <Stack.Screen name="Weekly" component={Role == "sales" ? WeeklySales : Weekly} options={{ headerShown: false }} /> */}
        {/* <Stack.Screen name="Daily" component={userData.role == "sales" ? DailySales : Daily} options={{ headerShown: false }} /> */}
        {/* <Stack.Screen name="Clientlist" component={userData.role !== "sales" ? MainClientdoctorlist : Clientpharmalist} options={{ headerShown: false }} /> */}
        <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
        <Stack.Screen name="Sal_rep_pharm" component={Sal_rep_pharm} options={{ headerShown: false }} />
        <Stack.Screen name="Inventory" component={Inventory} options={{ headerShown: false }} />
        <Stack.Screen name="Order" component={Order} options={{ headerShown: false }} />
        <Stack.Screen name="Return" component={Return} options={{ headerShown: false }} />
        <Stack.Screen name="AccountInfo" component={AccountInfo} options={{ headerShown: false }} />
        <Stack.Screen name="Clientdoctorlist" component={Clientdoctorlist} options={{ headerShown: false }} />
        <Stack.Screen name="Clientpharmalist" component={Clientpharmalist} options={{ headerShown: false }} />
        <Stack.Screen name="ChatPage" component={ChatPage} options={{ headerShown: false }} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="ContactsScreen" component={ContactsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="PresentImage" component={PresentImage} options={{ title: 'Images' }}/>
         <Stack.Screen name="Clientlist-sales" component={Clientpharmalist} options={{ headerShown: false }} /> 
         <Stack.Screen name="Clientlist-notSales" component={MainClientdoctorlist} options={{ headerShown: false }} />
         <Stack.Screen name="Daily-sales" component={ DailySales } options={{ headerShown: false }} />
         <Stack.Screen name="Daily-notSales" component={Daily} options={{ headerShown: false }} />
         <Stack.Screen name="WeeklySales" component={ WeeklySales} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer >
  );
}


      
 {/* <Stack.Screen name="Firstscreen" component={Firstscreen} options={{ headerShown: false }} /> */}
 {/* <Stack.Screen name="ReportPage" component={Role == "Sales" ? ReportPageSales : ReportPage} options={{ headerShown: false }} /> */}