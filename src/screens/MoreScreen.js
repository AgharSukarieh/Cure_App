import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Switch,
  StyleSheet,
  ScrollView,
  Animated,
  Pressable,
  Easing,
  Dimensions,
  I18nManager,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { BlurView } from "@react-native-community/blur";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next'; // <-- 1. استيراد useTranslation

// --- أدوات المقياس المتجاوب ---
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const guidelineBaseWidth = 360;
const guidelineBaseHeight = 800;
const scale = (size) => (SCREEN_WIDTH / guidelineBaseWidth) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

// ... (مكونات Star و Stars و RippleEffectCard تبقى كما هي)
// --- مكون النجمة ---
const Star = ({ size, position, duration }) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: duration * 0.5,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: duration * 0.5,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [duration, opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.star,
        {
          width: moderateScale(size),
          height: moderateScale(size),
          left: position.x,
          top: position.y,
          opacity: opacityAnim,
        },
      ]}
    />
  );
};

// --- مجموعة النجوم ---
const Stars = () => {
  const starData = [
    { size: 2, position: { x: "15%", y: "20%" }, duration: 2000 },
    { size: 1, position: { x: "25%", y: "60%" }, duration: 3000 },
    { size: 2, position: { x: "80%", y: "30%" }, duration: 2500 },
    { size: 1.5, position: { x: "90%", y: "75%" }, duration: 1800 },
    { size: 1, position: { x: "5%", y: "85%" }, duration: 3200 },
    { size: 2, position: { x: "50%", y: "10%" }, duration: 2200 },
    { size: 1.5, position: { x: "65%", y: "90%" }, duration: 2800 },
      { size: 2, position: { x: "15%", y: "20%" }, duration: 2000 },
    { size: 1, position: { x: "25%", y: "60%" }, duration: 3000 },
    { size: 2, position: { x: "80%", y: "30%" }, duration: 2500 },
    { size: 1.5, position: { x: "90%", y: "75%" }, duration: 1800 },
    { size: 1, position: { x: "5%", y: "85%" }, duration: 3200 },
    { size: 2, position: { x: "50%", y: "10%" }, duration: 2200 },
    { size: 1.5, position: { x: "35%", y: "90%" }, duration: 2800 },
      { size: 2, position: { x: "55%", y: "20%" }, duration: 2000 },
    { size: 1, position: { x: "25%", y: "60%" }, duration: 3000 },
    { size: 2, position: { x: "0%", y: "30%" }, duration: 2500 },
    { size: 1.5, position: { x: "90%", y: "75%" }, duration: 1800 },
    { size: 1, position: { x: "66%", y: "85%" }, duration: 3200 },
    { size: 2, position: { x: "70%", y: "10%" }, duration: 2200 },
    { size: 1.5, position: { x: "65%", y: "90%" }, duration: 2800 },

  ];

  return (
    <View style={StyleSheet.absoluteFill}>
      {starData.map((star, index) => (
        <Star key={index} {...star} />
      ))}
    </View>
  );
};

// --- مكون البطاقة مع تأثير التموج ---
const RippleEffectCard = ({
  children,
  style,
  onPress,
  rippleColor = "#183E9F",
}) => {
  const [cardDimensions, setCardDimensions] = useState({ width: 0, height: 0 });
  const [ripples, setRipples] = useState([]);

  const handlePressIn = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    const { width, height } = cardDimensions;
    const maxDiameter = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) * 2;

    const newRipple = {
      key: Date.now(),
      style: { left: locationX, top: locationY },
      anim: new Animated.Value(0),
      maxDiameter,
    };

    setRipples((prev) => [...prev, newRipple]);

    Animated.timing(newRipple.anim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setRipples((prev) => prev.filter((r) => r.key !== newRipple.key));
    });
  };

  return (
    <Pressable
      style={style}
      onPressIn={handlePressIn}
      onPress={onPress} // استدعاء onPress عند اكتمال الضغطة
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setCardDimensions({ width, height });
      }}
    >
      {children}
      <View style={styles.rippleContainer}>
        {ripples.map((ripple) => (
          <Animated.View
            key={ripple.key}
            style={[
              styles.ripple,
              { backgroundColor: rippleColor },
              ripple.style,
              {
                width: ripple.maxDiameter,
                height: ripple.maxDiameter,
                borderRadius: ripple.maxDiameter / 2,
                transform: [
                  { translateX: -ripple.maxDiameter / 2 },
                  { translateY: -ripple.maxDiameter / 2 },
                  { scale: ripple.anim },
                ],
                opacity: ripple.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.7, 0],
                }),
              },
            ]}
          />
        ))}
      </View>
    </Pressable>
  );
};


const MoreScreen = () => {
  const { t } = useTranslation(); // <-- 2. استدعاء الهوك
  const isRTL = I18nManager.isRTL;
  const [darkMode, setDarkMode] = useState(false);
  const navigation = useNavigation();
  
  // ... (الرسوم المتحركة تبقى كما هي)
  const chevronAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const chevronPulse = Animated.stagger(
      200,
      chevronAnims.map((anim) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 700,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 700,
              useNativeDriver: true,
            }),
            Animated.delay(500),
          ])
        )
      )
    );

    chevronPulse.start();
    return () => chevronPulse.stop();
  }, [chevronAnims]);

  const chevronStyles = chevronAnims.map((anim) => ({
    opacity: anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.5, 1, 0.5],
    }),
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1.3, 1],
        }),
      },
    ],
  }));

  const handleCardPress = () => {
    navigation.navigate('ProfileScreen');
  };
const chevronIconName = I18nManager.isRTL ? "chevron-left" : "chevron-right";

  return (
    <ScrollView
      style={[styles.container, darkMode && styles.darkContainer]}
      contentContainerStyle={{ paddingBottom: verticalScale(30) }}
    >
      <Text style={[styles.header, darkMode && styles.darkHeader, isRTL && styles.rtlText]}>{t('moreScreen.header')}</Text>

      <RippleEffectCard
        style={styles.userCard}
        onPress={handleCardPress}
        rippleColor="#183E9F"
      >
        <BlurView style={styles.blurView} blurType={darkMode ? "dark" : "light"} blurAmount={10} />
        <View style={styles.overlay} />
        <Stars />

        <Image source={require("../../assets/images/avatar.png")} style={styles.profileImage} />
        
        <View style={styles.userInfoContainer}>
            <View style={styles.userInfoRow}>
                <Text style={[styles.userLabel, isRTL && styles.rtlText]}>{t('userCard.userId')}</Text>
                <Text style={[styles.userValue, isRTL && styles.rtlText]}>31525</Text>
            </View>
            <View style={styles.userInfoRow}>
                <Text style={[styles.userLabel, isRTL && styles.rtlText]}>{t('userCard.username')}</Text>
                <Text style={[styles.userValue, isRTL && styles.rtlText]}>{t('userCard.sampleUsername')}</Text>
            </View>
        </View>

        <View style={styles.userDetailsContainer}>
            <View style={styles.detailRow}>
<Text style={[ {   color: "#f0f0f0",
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.9)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
   fontSize: I18nManager.isRTL ? moderateScale(12) : moderateScale(12) }]}>
  {t('userCard.email')}
</Text>
                <Text style={[styles.detailValue, isRTL && styles.rtlText]}>{t('userCard.sampleEmail')}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, isRTL && styles.rtlText]}>{t('userCard.phone')}</Text>
                <Text style={[styles.detailValue, isRTL && styles.rtlText]}>{t('userCard.samplePhone')}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, isRTL && styles.rtlText]}>{t('userCard.city')}</Text>
                <Text style={[styles.detailValue, isRTL && styles.rtlText]}>{t('userCard.sampleCity')}</Text>
            </View>
        </View>

        <View style={styles.chevronsContainer}>
            {/* الخطوة 3: استخدم المتغير هنا */}
            <Animated.View style={chevronStyles[2]}><Icon name={chevronIconName} size={moderateScale(20)} color="#fff" /></Animated.View>
            <Animated.View style={[chevronStyles[1], { marginLeft: -scale(0) }]}><Icon name={chevronIconName} size={moderateScale(20)} color="#fff" /></Animated.View>
            <Animated.View style={[chevronStyles[0], { marginLeft: -scale(8) }]}><Icon name={chevronIconName} size={moderateScale(20)} color="#fff" /></Animated.View>
        </View>
      </RippleEffectCard>

      <Text style={[styles.sectionTitle, darkMode && styles.darkText, isRTL && styles.rtlText]}>{t('moreScreen.preferences')}</Text>
      <Pressable style={[styles.listItem, darkMode && styles.darkListItem]} onPress={() => { navigation.navigate("NotificationScreen"); }}>
        {darkMode ? <Image source={require("../../assets/icons/notification.png")} style={styles.icon} /> : <Image source={require("../../assets/icons/notification_black.png")} style={styles.icon} />}
        <Text style={[styles.listText, darkMode && styles.darkText, isRTL && styles.rtlText]}>{t('settings.notifications')}</Text>
       
        <Icon name={chevronIconName} size={moderateScale(16)} color="#999" />
      </Pressable>
      
      <Pressable onPress={() => { navigation.getParent().navigate("ChangeLanguageScreen"); }} style={[styles.listItem, darkMode && styles.darkListItem]}>
        <Icon name="globe" size={moderateScale(20)} color={darkMode ? "#fff" : "#333"} style={styles.icon} />
        <Text style={[styles.listText, darkMode && styles.darkText, isRTL && styles.rtlText]}>{t('settings.language')}</Text>
       
        <Icon name={chevronIconName} size={moderateScale(16)} color="#999" />
      </Pressable>

      {/* <View style={[styles.listItem, darkMode && styles.darkListItem]}>
        <Icon name="moon-o" size={moderateScale(20)} color={darkMode ? "#fff" : "#333"} style={styles.icon} />
        <Text style={[styles.listText, darkMode && styles.darkText, isRTL && styles.rtlText]}>{t('settings.darkMode')}</Text>
        <Switch trackColor={{ false: "#767577", true: "#81b0ff" }} thumbColor={darkMode ? "#f5dd4b" : "#f4f3f4"} onValueChange={() => setDarkMode(!darkMode)} value={darkMode} />
      </View> */}

      <Text style={[styles.sectionTitle, darkMode && styles.darkText, isRTL && styles.rtlText]}>{t('moreScreen.helpSupport')}</Text>
      <Pressable style={[styles.listItem, darkMode && styles.darkListItem]} onPress={() => { navigation.navigate("FAQScreen"); }}>
        {darkMode ? <Image source={require("../../assets/icons/faq_light.png")} style={styles.icon} /> : <Image source={require("../../assets/icons/faq_dark.png")} style={styles.icon} />}
        <Text style={[styles.listText, darkMode && styles.darkText, isRTL && styles.rtlText]}>{t('settings.faq')}</Text>
       
        <Icon name={chevronIconName} size={moderateScale(16)} color="#999" />
      </Pressable>

      <Pressable style={[styles.listItem, darkMode && styles.darkListItem]} onPress={() => { navigation.navigate("ContactUsScreen"); }}>
        {darkMode ? <Image source={require("../../assets/icons/contact_light.png")} style={styles.icon} /> : <Image source={require("../../assets/icons/contact_dark.png")} style={styles.icon} />}
        <Text style={[styles.listText, darkMode && styles.darkText, isRTL && styles.rtlText]}>{t('settings.contactUs')}</Text>
       
        <Icon name={chevronIconName} size={moderateScale(16)} color="#999" />
      </Pressable>

      <Text style={[styles.sectionTitle, darkMode && styles.darkText, isRTL && styles.rtlText]}>{t('moreScreen.about')}</Text>
      <Pressable style={[styles.listItem, darkMode && styles.darkListItem]} onPress={() => { navigation.navigate("AboutUsScreen"); }}>
        {darkMode ? <Image source={require("../../assets/icons/info_light.png")} style={styles.icon} /> : <Image source={require("../../assets/icons/info_dark.png")} style={styles.icon} />}
        <Text style={[styles.listText, darkMode && styles.darkText, isRTL && styles.rtlText]}>{t('settings.aboutUs')}</Text>
       
        <Icon name={chevronIconName} size={moderateScale(16)} color="#999" />
      </Pressable>

      <Pressable style={[styles.listItem, darkMode && styles.darkListItem]} onPress={() => { navigation.navigate("TermsScreen"); }}>
        {darkMode ? <Image source={require("../../assets/icons/terms_light.png")} style={styles.icon} /> : <Image source={require("../../assets/icons/terms_dark.png")} style={styles.icon} />}
        <Text style={[styles.listText, darkMode && styles.darkText, isRTL && styles.rtlText]}>{t('settings.terms')}</Text>
       
        <Icon name={chevronIconName} size={moderateScale(16)} color="#999" />
      </Pressable>

      <Pressable style={[styles.listItem, darkMode && styles.darkListItem]}>
        <Icon name="lock" size={moderateScale(20)} color={darkMode ? "#fff" : "#333"} style={styles.icon} />
        <Text style={[styles.listText, darkMode && styles.darkText, isRTL && styles.rtlText]}>{t('settings.privacy')}</Text>
       
        <Icon name={chevronIconName} size={moderateScale(16)} color="#999" />
      </Pressable>

      {/* زر تسجيل الخروج */}
      <Pressable 
        style={[styles.logoutButton, darkMode && styles.darkLogoutButton]} 
        onPress={() => {
          Alert.alert(
            t('settings.logout'),
            t('settings.logoutConfirm'),
            [
              {
                text: t('common.cancel'),
                style: 'cancel'
              },
              {
                text: t('settings.logout'),
                style: 'destructive',
                onPress: () => {
                  // هنا يمكنك إضافة منطق تسجيل الخروج
                  console.log('تسجيل الخروج...');
                  // navigation.navigate('SignIn');
                }
              }
            ]
          );
        }}
      >
        <Icon name="sign-out" size={moderateScale(20)} color="#FF4444" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>{t('settings.logout')}</Text>
      </Pressable>
      
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8", 
  },
  darkContainer: {
    backgroundColor: "#121212", 
  },
  header: {
    fontSize: moderateScale(28),
    fontWeight: "bold",
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(10),
    color: "#183E9F",
  },
  darkHeader: { color: "#BB86FC" },
  userCard: {
    height: verticalScale(160), 
    marginHorizontal: scale(16),
    borderRadius: moderateScale(20),
 
    overflow: "hidden",
    elevation: 8,
    position: 'relative', 
  },
  rippleContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    borderRadius: moderateScale(20),
  },
  ripple: { position: "absolute" },
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(119, 184, 222, 0.74)",
  },
  star: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: moderateScale(5),
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  profileImage: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    position: "absolute",
    top: verticalScale(15),
    left: scale(15),
    borderWidth: moderateScale(2),
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  userInfoContainer: {
    position: 'absolute',
    top: verticalScale(20),
    left: scale(90),
    flexDirection: 'column',
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  userLabel: {
    fontSize: moderateScale(14),
    color: "#fff",
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  userValue: {
    fontSize: moderateScale(14),
    color: "#436DD6",
    fontWeight: "bold",
    textShadowColor: "#436DD6",
    textShadowOffset: { height: 0.5 },
    textShadowRadius: 3,
    marginLeft: scale(5),
  },
  userDetailsContainer: {
    position: 'absolute',
    bottom: verticalScale(10),
    left: scale(15),
    right: scale(15),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  detailLabel: {
    fontSize: moderateScale(12),
    color: "#f0f0f0",
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.9)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    width: scale(50), // عرض ثابت للمحاذاة
  },
  detailValue: {
    fontSize: moderateScale(12),
    color: "#436DD6",
    fontWeight: "bold",
    textShadowColor: "#436DD6",
    textShadowOffset: { height: 0.5 },
    textShadowRadius: 3,
    marginLeft: scale(8),
  },
  chevronsContainer: {
    position: "absolute",
    right: scale(15),
    top: 0,
    bottom: 0,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: "300",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    color: "#1A46BE",
    marginTop: verticalScale(10),
  },
  darkText: { color: "#e0e0e0" },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(12),
    backgroundColor: "#fff",
    marginHorizontal: scale(16),
    marginBottom: verticalScale(8),
    borderRadius: moderateScale(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  darkListItem: { 
    backgroundColor: "#1E1E1E",
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.5,
  },
  icon: {
    width: moderateScale(22),
    height: moderateScale(22),
    marginRight: scale(15),
    resizeMode: "contain",
  },
  listText: {
    flex: 1,
    fontSize: moderateScale(16),
    color: "#333",
  },
  rtlText: {
    textAlign: 'left',
    writingDirection: 'rtl',
  },
  // أنماط زر تسجيل الخروج
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#FF4444',
    borderWidth: 1,
    borderColor: '#FF4444',
    marginHorizontal: scale(16),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(60),
    paddingVertical: verticalScale(15),
    borderRadius: moderateScale(12),
   

  },
  darkLogoutButton: {
    backgroundColor: '#D32F2F',
    shadowColor: '#D32F2F',
  },
  logoutIcon: {
    marginRight: scale(8),
  },
  logoutText: {
    color: '#FF4444',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});

export default MoreScreen;
