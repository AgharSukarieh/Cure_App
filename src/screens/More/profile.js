import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  ScrollView,
  Animated,
  Dimensions,
  Alert,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  I18nManager,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { BlurView } from "@react-native-community/blur";
import { launchImageLibrary } from "react-native-image-picker";
import DatePicker from "react-native-date-picker";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const guidelineBaseWidth = 360;
const scale = (size) => (SCREEN_WIDTH / guidelineBaseWidth) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

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

const Stars = () => {
  const starData = [
    { size: 2, position: { x: "15%", y: "20%" }, duration: 2000 },
    { size: 1, position: { x: "25%", y: "60%" }, duration: 3000 },
    { size: 2, position: { x: "80%", y: "30%" }, duration: 2500 },
    { size: 1.5, position: { x: "90%", y: "75%" }, duration: 1800 },
    { size: 1, position: { x: "5%", y: "85%" }, duration: 3200 },
    { size: 2, position: { x: "50%", y: "10%" }, duration: 2200 },
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

const ProfileScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const { user } = useAuth();
  
  // طباعة بيانات المستخدم في ProfileScreen
  console.log('👤 بيانات المستخدم في ProfileScreen:', {
    user: user,
    userKeys: user ? Object.keys(user) : 'user is null',
    userValues: user ? Object.values(user) : 'user is null',
    profile_image_url: user?.profile_image_url,
    medicals_profile_image: user?.medicals?.profile_image
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  const [name, setName] = useState(user?.name || user?.username || t('profile.notSpecified'));
  const [email, setEmail] = useState(user?.email || t('profile.notSpecified'));

  const [date, setDate] = useState(user?.updated_at ? new Date(user.updated_at) : new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const [country, setCountry] = useState(user?.distributor?.address || user?.distributor?.office || t('profile.notSpecified'));
  const [isCountryModalVisible, setCountryModalVisible] = useState(false);

  const countriesData = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
   
    
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);



  const handleChangeProfileImage = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const source = { uri: response.assets[0].uri };
        setProfileImage(source);
      }
    });
  };



  const handleCountryPicker = () => {
    setCountryModalVisible(true);
  };

  const handleSelectCountry = (selectedCountry) => {
    setCountry(selectedCountry);
    setCountryModalVisible(false);
  };

  const handleMenu = () => {
    Alert.alert(t('common.menu'), t('common.openingMenu'));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#39a5e4c7" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <>
            <View style={styles.loadingHeader}>
              <View style={styles.loadingBlurView} />
              <View style={styles.loadingOverlay} />
              <View style={styles.loadingHeaderContent}>
                <View style={[styles.loadingTitle, isRTL && styles.rtlLoadingText]} />
              </View>
            </View>

            <View style={styles.loadingProfileImageContainer}>
              <View style={styles.loadingProfileImage} />
              <View style={styles.loadingCameraIcon} />
            </View>

            <View style={styles.loadingForm}>
              <View style={[styles.loadingLabel, isRTL && styles.rtlLoadingText]} />
              <View style={[styles.loadingInput, isRTL && styles.rtlLoadingText]} />

              <View style={[styles.loadingLabel, isRTL && styles.rtlLoadingText]} />
              <View style={[styles.loadingInput, isRTL && styles.rtlLoadingText]} />

              <View style={[styles.loadingLabel, isRTL && styles.rtlLoadingText]} />
              <View style={[styles.loadingPickerInput, isRTL && styles.rtlLoadingText]} />

              <View style={[styles.loadingLabel, isRTL && styles.rtlLoadingText]} />
              <View style={[styles.loadingPickerInput, isRTL && styles.rtlLoadingText]} />

              <View style={[styles.loadingLabel, isRTL && styles.rtlLoadingText]} />
              <View style={[styles.loadingPasswordInput, isRTL && styles.rtlLoadingText]} />
            </View>

          </>
        ) : (
          <>
            <View style={styles.header}>
              <BlurView style={styles.blurView} blurType="light" blurAmount={5} />
              <View style={styles.overlay} />
              <Stars />
              <View style={styles.headerContent}>
                <Text style={[styles.headerTitle, isRTL && styles.rtlText]}>{t('profile.headerTitle')}</Text>
              </View>
            </View>

            <View style={styles.profileImageContainer}>
              <Image 
                source={(() => {
                  const imageSource = user?.profile_image_url || user?.medicals?.profile_image
                    ? { uri: user.profile_image_url || user.medicals.profile_image }
                    : require("../../../assets/images/avatar.png");
                  console.log('🖼️ Image Source:', imageSource);
                  return imageSource;
                })()}
                style={styles.profileImage}
                onError={(error) => {
                  console.log('❌ فشل في تحميل صورة البروفايل:', error);
                  console.log('🔍 URL المحاولة:', user.profile_image_url || user.medicals?.profile_image);
                }}
                onLoad={() => {
                  console.log('✅ تم تحميل صورة البروفايل بنجاح');
                  console.log('🔍 URL الناجح:', user.profile_image_url || user.medicals?.profile_image);
                }}
              />
              {/* <TouchableOpacity
                style={styles.cameraIcon}
                onPress={handleChangeProfileImage}
              >
                <Image source={require("../../assets/icons/cameraa.png")} style={styles.iconCamera}/>
              </TouchableOpacity> */}
            </View>

            <View style={styles.form}>
              <Text style={[styles.label, isRTL && styles.rtlText]}>{t('profile.name')}</Text>
              <TextInput
                style={[styles.input, isRTL && styles.rtlText]}
                value={name}
                onChangeText={setName}
                placeholder={t('profile.enterName')}
              />

              <Text style={[styles.label, isRTL && styles.rtlText]}>{t('profile.email')}</Text>
              <TextInput
                style={[styles.input, isRTL && styles.rtlText]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholder={t('profile.enterEmail')}
              />

              {/* <Text style={[styles.label, isRTL && styles.rtlText]}>{t('profile.dateOfBirth')}</Text>
              <TouchableOpacity
                style={styles.pickerInput}
                onPress={() => setOpenDatePicker(true)}
              >
                <Text style={styles.pickerText}>
                  {date.toLocaleDateString("en-GB")}
                </Text>
                <Icon name="chevron-down" size={20} color="#666" />
              </TouchableOpacity> */}

              <Text style={[styles.label, isRTL && styles.rtlText]}>{t('profile.supervisor')}</Text>
              <View
                style={styles.pickerInput}
             
              >
                <Text style={[styles.pickerText, isRTL && styles.rtlText]}>{country}</Text>
                
              </View>

              <Text style={[styles.label, isRTL && styles.rtlText]}>{t('profile.phone')}</Text>
              <View style={styles.pickerInput}>

                  <Icon name="call-outline" size={20} color="#666" />
                  <Text style={[styles.passwordText ]}>{user?.phone || t('profile.notSpecified')}</Text>
            
              </View>

              <Text style={[styles.label, isRTL && styles.rtlText]}>{t('profile.role')}</Text>
              <View style={styles.passwordInput}>
                <View style={styles.passwordContent}>
                  <Icon name="person-outline" size={20} color="#666" />
                  <Text style={[styles.passwordText, isRTL && styles.rtlText]}>{user?.role || t('profile.notSpecified')}</Text>
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.backButton, isRTL && styles.rtlBackButton]}
                onPress={() => navigation.goBack()}
              >
                <Text style={[styles.backButtonText, isRTL && styles.rtlText]}>{t('common.back')}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      <DatePicker
        modal
        open={openDatePicker}
        date={date}
        mode="date"
        onConfirm={(selectedDate) => {
          setOpenDatePicker(false);
          setDate(selectedDate);
        }}
        onCancel={() => {
          setOpenDatePicker(false);
        }}
      />

      <Modal
        transparent={true}
        visible={isCountryModalVisible}
        animationType="fade"
        onRequestClose={() => setCountryModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setCountryModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={[styles.modalTitle, isRTL && styles.rtlText]}>{t('profile.selectCountry')}</Text>
                <FlatList
                  data={countriesData}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.countryItem}
                      onPress={() => handleSelectCountry(item)}
                    >
                      <Text style={styles.countryText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    height: 150,
    alignItems: "center",
    borderBottomLeftRadius: 150,
    borderBottomRightRadius: 150,
    overflow: "hidden",
    position: "relative",
  },
  blurView: { ...StyleSheet.absoluteFillObject },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "#39a5e4bd" },
  star: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 5,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  headerContent: { zIndex: 2, alignItems: "center", paddingTop: 20 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  profileImageContainer: {
    position: "absolute",
    top: 78,
    zIndex: 3,
    left: I18nManager.isRTL ? "20%" : "50%",
    transform: [{ translateX: -60 }],
    backgroundColor: "#d1d0d0ff",
    borderRadius: 70,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  iconCamera:{
    width: 34,
    height: 34,
    resizeMode: 'contain',
  },
  cameraIcon: {
    position: "absolute",
    bottom:-10,
    right: -10,
    padding: 8,
    borderRadius: 20,
  },
  form: { paddingHorizontal: 20, marginTop: 40 },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  pickerInput: {
    flexDirection:  "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  pickerText: { fontSize: 16 },
  passwordInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#FFC0CB",
  },
  passwordContent: { flexDirection: "row", alignItems: "center" },
  passwordText: { fontSize: 16, marginLeft: 10, color: "#333" },
  footer: { alignItems: "center", padding: 20, marginTop: 10 },
  backButton: {
     
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minHeight: 52,
    shadowColor: "#000",
    borderWidth: 1,
    borderColor: "#3660CC",
  },
  rtlBackButton: {
    marginRight: 6,
  },
  backButtonText: {
    color: "#3660CC",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  countryItem: {
    paddingVertical: 12,
  },
  countryText: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  rtlText: {
    textAlign: I18nManager.isRTL?"left": 'right',
    writingDirection: 'rtl',
  },
  loadingHeader: {
    height: 200,
    backgroundColor: "#39a5e4c7",
    position: "relative",
  },
  loadingBlurView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#39a5e4c7",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  loadingHeaderContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  loadingTitle: {
    width: 200,
    height: 24,
    backgroundColor: "#E5E5EA",
    borderRadius: 12,
  },
  loadingProfileImageContainer: {
    alignItems: "center",
    marginTop: -60,
    position: "relative",
  },
  loadingProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E5E5EA",
  },
  loadingCameraIcon: {
    position: "absolute",
    bottom: -10,
    right: 20,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#E5E5EA",
  },
  loadingForm: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  loadingLabel: {
    width: 80,
    height: 12,
    backgroundColor: "#E5E5EA",
    borderRadius: 6,
    marginBottom: 8,
    marginTop: 15,
  },
  loadingInput: {
    width: "100%",
    height: 44,
    backgroundColor: "#E5E5EA",
    borderRadius: 8,
    marginBottom: 8,
  },
  loadingPickerInput: {
    width: "100%",
    height: 44,
    backgroundColor: "#E5E5EA",
    borderRadius: 8,
    marginBottom: 8,
  },
  loadingPasswordInput: {
    width: "100%",
    height: 44,
    backgroundColor: "#E5E5EA",
    borderRadius: 8,
    marginBottom: 8,
  },
  loadingFooter: {
    alignItems: "center",
    padding: 20,
    marginTop: 10,
  },
  rtlLoadingText: {
    alignSelf: "flex-end",
  },
});

export default ProfileScreen;
