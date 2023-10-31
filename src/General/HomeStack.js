import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ReportPage from '../screens/Medical/ReportPage';
import Clientpharmalist from '../screens/Clientpharmalist';
import MainClientdoctorlist from '../screens/MainClientdoctorlist';
import Clientdoctorlist from '../screens/Clientdoctorlist';
import Monthly from '../screens/Medical/Monthly';
import Weekly from '../screens/Medical/Weekly';
import Sal_rep_pharm from '../screens/Sales/sal_rep_pharm';
import DailySales from '../screens/Sales/DailySales';
import Daily from '../screens/Medical/Daily';
import Order from '../screens/Sales/Order';
import Inventory from '../screens/Sales/Inventory';
import Return from '../screens/Sales/Return';
import AccountInfo from '../screens/Sales/AccountInfo';
// import PresentImage from '../screens/ChatPages/PresentImage';
import WeeklySales from '../screens/Sales/WeeklySales';
import Reports from '../screens/Reports';
import FrequencyReport from '../screens/FrequencyReport';
import Collection from '../screens/Collection';
const Stack = createNativeStackNavigator();

const HomeStack = ({ navigation }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name="ReportPage" component={ReportPage} />
            <Stack.Screen name="Clientlist-sales" component={Clientpharmalist} />
            <Stack.Screen name="Clientlist-medical" component={MainClientdoctorlist} />
            <Stack.Screen name="Clientdoctorlist" component={Clientdoctorlist} />
            <Stack.Screen name="Monthly" component={Monthly} />
            <Stack.Screen name="Weekly" component={Weekly} />
            <Stack.Screen name="Sal_rep_pharm" component={Sal_rep_pharm} />
            <Stack.Screen name="Daily-sales" component={DailySales} />
            <Stack.Screen name="Daily-notSales" component={Daily} />
            <Stack.Screen name="Order" component={Order} />
            <Stack.Screen name="Inventory" component={Inventory} />
            <Stack.Screen name="Return" component={Return} />
            <Stack.Screen name="AccountInfo" component={AccountInfo} />
            {/* <Stack.Screen name="PresentImage" component={PresentImage} /> */}
            <Stack.Screen name="WeeklySales" component={WeeklySales} />
            <Stack.Screen name="Reports" component={Reports} />
            <Stack.Screen name="FrequencyReport" component={FrequencyReport} />
            <Stack.Screen name="Collection" component={Collection} />

        </Stack.Navigator>
  )
}

export default HomeStack