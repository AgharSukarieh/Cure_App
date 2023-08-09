import React from 'react';
import GoBack from '../../components/GoBack';
import { styles } from '../../components/styles';
import ChatsScreen from './ChatsScreen';
import AllGroups from './AllGroups';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useAuth } from '../../contexts/AuthContext';
const Tab = createBottomTabNavigator();

const ChatPage = ({ navigation, route }) => {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'ChatsScreen') {
            iconName = 'message1';
          } else if (route.name === 'Groups') {
            iconName = 'addusergroup';
          }
          return <AntDesign name={iconName} color={color} size={size} />;
        },
        tabBarActiveTintColor: '#7189FF',
        tabBarInactiveTintColor: 'gray',
      })}>
      {/* <Tab.Screen name="ChatsScreen" component={ChatsScreen} options={{ headerShown: false }}/> */}
      <Tab.Screen
        name="ChatsScreen"
        children={() => <ChatsScreen userData={user} />}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Groups"
        component={AllGroups}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default ChatPage;
