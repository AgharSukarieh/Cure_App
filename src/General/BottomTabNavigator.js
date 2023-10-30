import React from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatPage from "../screens/ChatPages/ChatPage";
import Sales from "../screens/Sales";
import Profile from "../screens/profile";
import HomeStack from "./HomeStack";
const pcolor = '#3A97D6'
const Tab = createBottomTabNavigator();

// const BottomTabs = ({ navigation }) => {

//     return (
//         <Tab.Navigator
//             initialRouteName="Feed"
//             screenOptions={{
//                 tabBarStyle: {
//                     position: 'absolute',
//                     bottom: 0,
//                     left: 0,
//                     right: 0,
//                     elevation: 0,
//                     backgroundColor: '#fff',
//                     borderRadius: 0,
//                     paddingTop: 20,
//                     height: 70,
//                     ...styles.shadow,
//                 },
//             }}
//         >
//             <Tab.Screen name="HomeStack" component={HomeStack}
//                 options={{
//                     tabBarLabel: '',
//                     tabBarIcon: ({ focused }) => (
//                         <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//                             <Icon name="home" color={focused ? pcolor : '#748c94'} size={30} style={{ marginHorizontal: 2 }} />
//                             <Text style={{ color: focused ? pcolor : '#748c94', marginTop: 5 }}>Home</Text>
//                             {focused && <View style={{ width: 50, height: 2, marginTop: 5, top: 10, backgroundColor: pcolor }} />}
//                         </View>
//                     ),
//                     headerShown: false
//                 }} />
//             <Tab.Screen name="Sales" component={Sales}
//                 options={{
//                     tabBarLabel: '',
//                     tabBarIcon: ({ focused }) => (
//                         <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//                             <Icon name="box" color={focused ? pcolor : '#748c94'} size={30} style={{ marginHorizontal: 2 }} />
//                             <Text style={{ color: focused ? pcolor : '#748c94', marginTop: 5 }}>Sales</Text>
//                             {focused && <View style={{ width: 50, height: 2, marginTop: 5, top: 10, backgroundColor: pcolor }} />}
//                         </View>
//                     ),
//                     headerShown: false
//                 }} />

//             <Tab.Screen name="ChatPage" component={ChatPage}
//                 options={{
//                     tabBarLabel: '',
//                     tabBarIcon: ({ focused }) => (
//                         <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//                             <Icon name="chatbox-outline" color={focused ? pcolor : '#748c94'} size={30} style={{ marginHorizontal: 2 }} />
//                             <Text style={{ color: focused ? pcolor : '#748c94', marginTop: 5 }}>Chat</Text>
//                             {focused && <View style={{ width: 50, height: 2, marginTop: 5, top: 10, backgroundColor: pcolor }} />}
//                         </View>
//                     ),
//                     headerShown: false
//                 }} />
//             <Tab.Screen name="Profile" component={Profile}
//                 options={{
//                     tabBarLabel: '',
//                     tabBarIcon: ({ focused }) => (
//                         <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//                             <Icon name="user" color={focused ? pcolor : '#748c94'} size={30} style={{ marginHorizontal: 2 }} />
//                             <Text style={{ color: focused ? pcolor : '#748c94', marginTop: 5 }}>Profile</Text>
//                             {focused && <View style={{ width: 50, height: 2, marginTop: 5, top: 10, backgroundColor: pcolor }} />}
//                         </View>
//                     ),
//                     headerShown: false
//                 }} />
//         </Tab.Navigator>
//     );
// }
// const styles = StyleSheet.create({
//     shadow: {
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 12, },
//         shadowOpacity: 0.58,
//         shadowRadius: 16.00,
//         elevation: 24,
//     },
// });


// export default BottomTabs



const BottomTabs = () => {
  return (
    <Tab.Navigator
      // initialRouteName="Home"
      screenOptions={{ headerShown: false }}
      tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarImage: 'home',
        }}
      />
      <Tab.Screen
        name="Sales"
        component={Sales}
        options={{
          tabBarLabel: 'Sales',
          tabBarImage: 'box',
        }}
      />
      <Tab.Screen
        name="ChatPage"
        component={ChatPage}
        options={{
          tabBarLabel: 'Chat',
          tabBarImage: "message-circle",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarImage: 'user',
        }}
      />
    </Tab.Navigator>
  );
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const isChatPageActive = state.routes[state.index].name === "ChatPage";

  if (isChatPageActive) {
    return null;
  }

  return (
    <View style={{ backgroundColor: '#fff' }}>
      <SafeAreaView>
        <View style={styles.tabBar}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };
            return (
              <TouchableOpacity
                key={index}
                style={[styles.tabItem, isFocused]}
                onPress={onPress}>
                <Icon name={options.tabBarImage} color={isFocused ? pcolor : '#748c94'} size={25} style={styles.tabImage} />
                <Text
                  style={[styles.tabLabel, isFocused && styles.activeLabel]}>
                  {options.tabBarLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fff',
    borderBottomColor: 'transparent',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#800020',
  },
  activeLabel: {
    color: 'black',
  },
  middleTab: {
    backgroundColor: '#004776',
    borderRadius: 45,
    borderWidth: 9,
    borderColor: '#E8E8EA',
    height: 90,
    width: 90,
    marginTop: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabImage: {
    width: 25,
    height: 25,
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default BottomTabs;