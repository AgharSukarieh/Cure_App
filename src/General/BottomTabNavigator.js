import React, { Component, createRef, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ReportPage from "../screens/Medical/ReportPage";
import ChatPage from "../screens/ChatPages/ChatPage";
import Sales from "../screens/Sales";

const pcolor = '#3A97D6'

const Tab = createBottomTabNavigator();

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
            <Tab.Screen name="ReportPage" component={ReportPage}
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
                            <Ionicons name="chatbox" color={focused ? pcolor : '#748c94'} size={30} style={{ marginHorizontal: 2 }} />
                            <Text style={{ color: focused ? pcolor : '#748c94', marginTop: 5 }}>Chat</Text>
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