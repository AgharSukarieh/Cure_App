import React from "react";
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from "@react-navigation/native-stack";



import ReportPage from "../screens/Medical/ReportPage";
import ChatPage from "../screens/ChatPages/ChatPage";
import Sales from "../screens/Sales";
import Profile from "../screens/profile";
import Clientpharmalist from "../screens/Clientpharmalist";
import MainClientdoctorlist from "../screens/MainClientdoctorlist";
import Clientdoctorlist from "../screens/Clientdoctorlist";
import Monthly from "../screens/Medical/Monthly";
import Weekly from "../screens/Medical/Weekly";
import DailySales from "../screens/Sales/DailySales";
import Sal_rep_pharm from "../screens/Sales/sal_rep_pharm";
import Daily from "../screens/Medical/Daily";
import Order from "../screens/Sales/Order";
import Inventory from "../screens/Sales/Inventory";
import Return from "../screens/Sales/Return";
import AccountInfo from "../screens/Sales/AccountInfo";
import PresentImage from "../screens/ChatPages/PresentImage";
import WeeklySales from "../screens/Sales/WeeklySales";
import GroupPage from "../screens/ChatPages/GroupPage";

const pcolor = '#3A97D6'

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


function HomeStack({ navigation }) {
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
            <Stack.Screen name="PresentImage" component={PresentImage} />
            <Stack.Screen name="WeeklySales" component={WeeklySales} />
            <Stack.Screen name="GroupPage" component={GroupPage} />
        </Stack.Navigator>
    );
}




const BottomTabs = ({ navigation }) => {

    return (
        <Tab.Navigator
            initialRouteName="Feed"
            screenOptions={{
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 0,
                    backgroundColor: '#fff',
                    borderRadius: 0,
                    paddingTop: 20,
                    height: 70,
                    ...styles.shadow,
                },
            }}
        >
            <Tab.Screen name="HomeStack" component={HomeStack}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name="home" color={focused ? pcolor : '#748c94'} size={30} style={{ marginHorizontal: 2 }} />
                            <Text style={{ color: focused ? pcolor : '#748c94', marginTop: 5 }}>Home</Text>
                            {focused && <View style={{ width: 50, height: 2, marginTop: 5, top: 10, backgroundColor: pcolor }} />}
                        </View>
                    ),
                    headerShown: false
                }} />
            <Tab.Screen name="Sales" component={Sales}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name="box" color={focused ? pcolor : '#748c94'} size={30} style={{ marginHorizontal: 2 }} />
                            <Text style={{ color: focused ? pcolor : '#748c94', marginTop: 5 }}>Sales</Text>
                            {focused && <View style={{ width: 50, height: 2, marginTop: 5, top: 10, backgroundColor: pcolor }} />}
                        </View>
                    ),
                    headerShown: false
                }} />

            <Tab.Screen name="ChatPage" component={ChatPage}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="chatbox-outline" color={focused ? pcolor : '#748c94'} size={30} style={{ marginHorizontal: 2 }} />
                            <Text style={{ color: focused ? pcolor : '#748c94', marginTop: 5 }}>Chat</Text>
                            {focused && <View style={{ width: 50, height: 2, marginTop: 5, top: 10, backgroundColor: pcolor }} />}
                        </View>
                    ),
                    headerShown: false
                }} />
            <Tab.Screen name="Profile" component={Profile}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name="user" color={focused ? pcolor : '#748c94'} size={30} style={{ marginHorizontal: 2 }} />
                            <Text style={{ color: focused ? pcolor : '#748c94', marginTop: 5 }}>Profile</Text>
                            {focused && <View style={{ width: 50, height: 2, marginTop: 5, top: 10, backgroundColor: pcolor }} />}
                        </View>
                    ),
                    headerShown: false
                }} />

        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12, },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
    },
});


export default BottomTabs