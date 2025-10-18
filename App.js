import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator, StatusBar } from "react-native";
import { AlertProvider } from "./src/components/Alert";
import { AuthProvider } from "./src/contexts/AuthContext";

// --- استيراد الشاشات ---



import BottomTabs from "./src/General/BottomTabNavigator";

import SignUpPharmacy from "./src/screens/Pharmacy/SignUpPharmacy";
import SignInPharmacy from "./src/screens/Pharmacy/SignInPharmacy";

import SignIn from "./src/screens/Auth/SignIn";
import ChatScreen from "./src/screens/ChatPages/ChatScreen";


import PresentImage from "./src/screens/ChatPages/PresentImage";
import AddGroup from "./src/screens/ChatPages/AddGroup";
import AllGroups from "./src/screens/ChatPages/AllGroups";
import ChangeLanguageScreen from "./src/screens/More/Language";
import ProfileScreen from "./src/screens/More/profile";
// import ChangePasswordScreen from "./src/screens/plus/ChangePasswordScreen";

// --- استيراد ملفات الإعدادات ---
import "./src/i18n";
import Clientdoctorlist from "./src/screens/Clientdoctorlist";
import MainClientdoctorlist from "./src/screens/MainClientdoctorlist";
import Collection from "./src/screens/Sales/Collection";
import MedicalReportScreen from "./src/screens/Medical/MedicalReportScreen";

import logo from "./src/components/LogoAnimation";
import SplashScreen from "./src/screens/SplashScreen";
import AccountInfo from "./src/screens/Sales/AccountInfo";
import DailySales from "./src/screens/Sales/DailySales";
import Sal_rep_pharm from "./src/screens/Sales/SalRepSpharm";
import WeeklySales from "./src/screens/Sales/WeeklySales";
import MonthlyPlanSales from "./src/screens/Sales/MonthlyPlanSales";
import ReportPageSales from "./src/screens/Sales/ReportPageSales";
import Sales from "./src/screens/Sales";
import Reports from "./src/screens/Reports";
import FrequencyReport from "./src/screens/FrequencyReport";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import Inventory from "./src/screens/Sales/Inventory";
import DailyScreen from "./src/screens/Medical/Daily";
import Return from "./src/screens/Sales/Return";
import OrderScreen from "./src/screens/Sales/Order";
import ForgotPasswordScreen from "./src/screens/Auth/ForgetPassword/ForgotPasswordScreen";

import SetNewPasswordScreen from "./src/screens/Auth/ForgetPassword/SetNewPasswordScreen";
import VerificationScreen from "./src/screens/Auth/ForgetPassword/VerificationScreen";
import ChooseVerificationMethodScreen from "./src/screens/Auth/ForgetPassword/ChooseVerificationMethod";

// Additional Screens
import HomePage from "./src/screens/HometPage";
import Clientpharmalist from "./src/screens/Clientpharmalist";
import CustomDatePicker from "./src/components/CustomPicker";
import MoreScreen from "./src/screens/More/MoreScreen";
import NotificationScreen from "./src/screens/More/Notifiction";
import ChatsScreen from "./src/screens/ChatPages/ChatsScreen";
import FAQScreen from "./src/screens/More/FAQScreen";
// import TermsScreen from "./src/screens/TermsScreen";
import ContactUsScreen from "./src/screens/More/ContactUsScreen";
import AboutUsScreen from "./src/screens/More/AboutUsScreen";
// import sal_rep_pharm from "./src/screens/Sales/SalRepSpharm";
// import ContactChat from "./src/screens/ChatPages/ContactChat";
import SalRepSpharm from "./src/screens/Sales/SalRepSpharm";
import PieChartDetails from "./src/screens/Medical/PieChartDetails";
import ContactsScreen from "./src/screens/ChatPages/ContactChat";

// import AddFriendScreen from "./src/screens/ChatPages/AddFriend";

const Stack = createNativeStackNavigator();

// --- المكون الرئيسي للملاحة (Navigator) ---
// فصلناه ليسهل تطبيق الثيم عليه
const AppNavigator = () => {
  return (
    // 3. تطبيق ثيم شريط الحالة (StatusBar)
    <NavigationContainer>
      {/* <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} /> */}
      <Stack.Navigator
        screenOptions={{ headerShown: false, orientation: "portrait" }}
        initialRouteName="SplashScreen"
      >
        {/* Splash & Onboarding */}
        <Stack.Screen name="SplashScreen" component={SplashScreen} />

        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />

        {/* Authentication */}
        <Stack.Screen name="SignIn" component={SignIn} />
     
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
        />
        <Stack.Screen
          name="ChooseVerificationMethodScreen"
          component={ChooseVerificationMethodScreen}
        />
        <Stack.Screen
          name="VerificationScreen"
          component={VerificationScreen}
        />
        <Stack.Screen
          name="SetNewPasswordScreen"
          component={SetNewPasswordScreen}
        />
     

        {/* Pharmacy Auth */}
        <Stack.Screen name="SignUpPharmacy" component={SignUpPharmacy} />
        <Stack.Screen name="SignInPharmacy" component={SignInPharmacy} />

        {/* Main App */}
        <Stack.Screen name="BottomTabs" component={BottomTabs} />
        <Stack.Screen name="HomePage" component={HomePage} />

        {/* Profile & Settings */}
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    
     
     
        <Stack.Screen
          name="ChangeLanguageScreen"
          component={ChangeLanguageScreen}
        />

        {/* Chat */}
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="ChatsScreen" component={ChatsScreen} />
        <Stack.Screen name="AllGroup" component={AllGroups} />
        <Stack.Screen name="ContactChat" component={ContactsScreen} />

        <Stack.Screen name="AddGroup" component={AddGroup} />
        <Stack.Screen name="PresentImage" component={PresentImage} />

        {/* Medical */}
        <Stack.Screen name="Clientdoctorlist" component={Clientdoctorlist} />
        <Stack.Screen
          name="MainClientdoctorlist"
          component={MainClientdoctorlist}
        />
        <Stack.Screen
          name="MedicalReportScreen"
          component={MedicalReportScreen}
        />
        <Stack.Screen name="DailyScreen" component={DailyScreen} />

        {/* Sales */}
        <Stack.Screen name="Sales" component={Sales} />
        <Stack.Screen name="DailySales" component={DailySales} />
        <Stack.Screen name="Daily-sales" component={DailySales} />
        <Stack.Screen name="Daily-notSales" component={DailySales} />
        <Stack.Screen name="WeeklySales" component={WeeklySales} />
        <Stack.Screen name="MonthlyPlanSales" component={MonthlyPlanSales} />
        <Stack.Screen name="ReportPageSales" component={ReportPageSales} />
        <Stack.Screen name="Sal_rep_pharm" component={Sal_rep_pharm} />
        <Stack.Screen name="OrderScreen" component={OrderScreen} />
        <Stack.Screen name="Order" component={OrderScreen} />
        <Stack.Screen name="Inventory" component={Inventory} />
        <Stack.Screen name="Return" component={Return} />
        <Stack.Screen name="AccountInfo" component={AccountInfo} />

        {/* Reports */}
        <Stack.Screen name="Reports" component={Reports} />
        <Stack.Screen name="FrequencyReport" component={FrequencyReport} />

        {/* Other Screens */}
        <Stack.Screen name="Collection" component={Collection} />
        <Stack.Screen name="Clientlist-sales" component={Clientpharmalist} />
        <Stack.Screen
          name="Clientlist-medical"
          component={MainClientdoctorlist}
        />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />
        <Stack.Screen name="MoreScreen" component={MoreScreen} />
        <Stack.Screen name="FAQScreen" component={FAQScreen} />
     
        <Stack.Screen name="ContactUsScreen" component={ContactUsScreen} />
        <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} />
        <Stack.Screen name="CustomDatePicker" component={CustomDatePicker} />
  
        <Stack.Screen name="logo" component={logo} />
        <Stack.Screen name="SalRepSpharm" component={SalRepSpharm} />
        <Stack.Screen name="Clientpharmalist" component={Clientpharmalist} />
        <Stack.Screen
          name="PieChartDetails"
component={PieChartDetails}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// --- المكون الجذري للتطبيق (App) ---
export default function App() {
  return (
    // 4. تغليف التطبيق بالـ Providers بالترتيب الصحيح
    <AuthProvider>
      <AlertProvider>
        <AppNavigator />
      </AlertProvider>
    </AuthProvider>
  );
}
