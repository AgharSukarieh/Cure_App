import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Animated, Image, StatusBar, I18nManager } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

// --- استيراد الشاشات الخاصة بك ---


import HomePage from '../screens/HometPage';
import Reports from '../screens/Reports';
import MoreScreen from '../screens/More/MoreScreen';

import ChatsScreen from '../screens/ChatPages/ChatsScreen';

const pcolor = '#183E9F'; 
const Tab = createBottomTabNavigator();

// ✅ Wrapper يحافظ على StatusBar لكل تبويب
const ScreenWithStatusBar = ({ component: Component, backgroundColor, barStyle }) => {
  const isFocused = useIsFocused();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {isFocused && (
        <StatusBar backgroundColor={backgroundColor} barStyle={barStyle} />
      )}
      <Component />
    </SafeAreaView>
  );
};

const BottomTabs = () => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        children={() => (
          <ScreenWithStatusBar
            component={HomePage}
            backgroundColor="#69b4ddff"
            barStyle="light-content"
          />
        )}
        options={{
          tabBarLabel: t('bottomTabs.home'),
          iconDefault: require('../../assets/icons/home_unfoces.png'),
          iconFocused: require("../../assets/icons/home_foces.png"),
        }}
      />
      <Tab.Screen
        name="Report"
        children={() => (
          <ScreenWithStatusBar
            component={Reports}
            backgroundColor="#F8F9FA"
            barStyle="dark-content"
          />
        )}
        options={{
          tabBarLabel: t('bottomTabs.report'),
          iconDefault: require('../../assets/icons/report_unfoces.png'),
          iconFocused: require("../../assets/icons/report_foces.png"),
        }}
      />
      <Tab.Screen
        name="Chat"
        children={() => (
          <ScreenWithStatusBar
            component={ChatsScreen}
            backgroundColor="#ffffff"
            barStyle="dark-content"
          />
        )}
        options={{
          tabBarLabel: t('bottomTabs.chat'),
          iconDefault: require('../../assets/icons/chat.png'),
          iconFocused: require("../../assets/icons/chat_foces.png"),
        }}
      />
      <Tab.Screen
        name="MoreScreen"
        children={() => (
          <ScreenWithStatusBar
            component={MoreScreen}
            backgroundColor="#ffffff"
            barStyle="dark-content"
          />
        )}
        options={{
          tabBarLabel: t('bottomTabs.more'),
          iconDefault: require('../../assets/icons/more_unfocues.png'),
          iconFocused: require("../../assets/icons/more_focues.png"),
        }}
      />
    </Tab.Navigator>
  );
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  return (
    <View style={styles.tabBarContainer}>
      <View style={[styles.tabBar, isRTL && styles.rtlTabBar]}>
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
              style={styles.tabItem}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
            >
              <Animated.View style={[styles.tabButton, isFocused ? styles.activeTabButton : {}]}>
                <Image
                  source={isFocused ? options.iconFocused : options.iconDefault}
                  style={styles.icon}
                />
                {isFocused && (
                  <Text style={[styles.activeLabel, isRTL && styles.rtlText]}>{options.tabBarLabel}</Text>
                )}
              </Animated.View>
              {!isFocused && (
                 <Text style={[styles.inactiveLabel, isRTL && styles.rtlText]}>{options.tabBarLabel}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 5,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 }, 
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabBar: {
    flexDirection: 'row',
    height: '100%',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButton: {
    flexDirection: 'column', 
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
  },
  activeTabButton: {
    backgroundColor: pcolor,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  activeLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  inactiveLabel: {
    color: '#B0B0B0',
    fontSize: 12,
    marginTop: 4,
  },
  rtlTabBar: {
    flexDirection: 'row-reverse',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

export default BottomTabs;
