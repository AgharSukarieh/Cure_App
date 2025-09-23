import {
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  I18nManager,
  Alert,
  PermissionsAndroid,
  Linking,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState, useRef, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import Geolocation from '@react-native-community/geolocation';
import Contacts from 'react-native-contacts';
import MapView, { Marker } from 'react-native-maps';

// تهيئة Geolocation
Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'whenInUse',
});

// متغير لتخزين watchId
let watchId = null;

// أبعاد الشاشة
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenHeight < 700;
const isMediumScreen = screenHeight >= 700 && screenHeight < 800;
const isLargeScreen = screenHeight >= 800;

// ======================= نظام الألوان المعتمد =======================
const Colors = {
  primary: '#3660CC',
  accent: '#4B8DFA',
  background: '#F5F5F5',
  myMessage: '#C7DFFF',
  theirMessage: '#FFFFFF',
  text: '#000000',
  gray: '#8E8E93',
  modalBackdrop: 'rgba(0, 0, 0, 0.5)',
};
// =================================================================

// --- مكونات وهمية (للتوضيح) ---
const Message = ({ message, currentUserId }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const isMyMessage = message.sender_id === currentUserId;
  const isSystemMessage = message.sender_id === 'system';
  
  if (isSystemMessage) {
    return (
      <View style={[styles.systemMessageContainer, isRTL && styles.rtlText]}>
        <Text style={[styles.systemMessageText, isRTL && styles.rtlText]}>
          {message.message}
        </Text>
        <Text style={[styles.systemMessageTime, isRTL && styles.rtlText]}>
          {new Date(message.created_at).toLocaleTimeString(isRTL ? 'ar-AE' : 'en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    );
  }

  // عرض الرسائل مع المرفقات
  const renderMessageContent = () => {
    if (message.type === 'image') {
      return (
        <View>
          <Image source={{ uri: message.image }} style={styles.messageImage} />
          {message.message && <Text style={[styles.messageText, isRTL && styles.rtlText]}>{message.message}</Text>}
        </View>
      );
    }
    
    if (message.type === 'location') {
      return (
        <View style={styles.locationMessageContainer}>
          <View style={styles.locationMessageHeader}>
            <Ionicons name="location" size={16} color={Colors.primary} />
            <Text style={[styles.locationMessageTitle, isRTL && styles.rtlText]}>
              {message.address || t('chatScreen.location') || 'الموقع'}
            </Text>
          </View>
          <View style={styles.locationMessageMap}>
            <MapView
              style={styles.locationMapView}
              region={{
                latitude: message.latitude,
                longitude: message.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
              showsUserLocation={false}
              showsMyLocationButton={false}
              showsCompass={false}
              showsScale={false}
              showsBuildings={true}
              showsTraffic={false}
              showsIndoors={false}
              mapType="standard"
              loadingEnabled={true}
              loadingIndicatorColor={Colors.primary}
              loadingBackgroundColor="#F8F9FA"
            >
              <Marker
                coordinate={{
                  latitude: message.latitude,
                  longitude: message.longitude,
                }}
                pinColor={Colors.primary}
                title={message.address || t('chatScreen.location') || 'الموقع'}
                description={`${message.latitude.toFixed(6)}, ${message.longitude.toFixed(6)}`}
              />
            </MapView>
          </View>
          <View style={styles.locationMessageFooter}>
            <Text style={[styles.locationMessageCoordinates, isRTL && styles.rtlText]}>
              {message.latitude.toFixed(6)}, {message.longitude.toFixed(6)}
            </Text>
            <TouchableOpacity 
              style={styles.locationMessageButton}
              onPress={() => {
                const url = `https://www.google.com/maps?q=${message.latitude},${message.longitude}`;
                Linking.openURL(url).catch(err => {
                  console.error('خطأ في فتح الخرائط:', err);
                  Alert.alert('خطأ', 'لا يمكن فتح الخرائط');
                });
              }}
            >
              <Ionicons name="open-outline" size={14} color="white" />
              <Text style={[styles.locationMessageButtonText, isRTL && styles.rtlText]}>
                {t('chatScreen.openInMaps') || 'فتح في الخرائط'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (message.type === 'contact') {
      return (
        <View style={styles.contactMessage}>
          <Ionicons name="person" size={20} color={Colors.primary} />
          <Text style={[styles.messageText, isRTL && styles.rtlText]}>
            {message.contactName}
          </Text>
          <Text style={[styles.messageText, { fontSize: 12, color: Colors.gray }]}>
            {message.contactPhone}
          </Text>
        </View>
      );
    }

    if (message.type === 'document') {
      return (
        <View style={styles.documentMessage}>
          <Ionicons name="document-text" size={20} color={Colors.primary} />
          <Text style={[styles.messageText, isRTL && styles.rtlText]}>
            {message.documentName}
          </Text>
        </View>
      );
    }

    return <Text style={[styles.messageText, isRTL && styles.rtlText]}>{message.message}</Text>;
  };
  
  return (
    <View style={[
      styles.messageContainer,
      isMyMessage ? styles.myMessageContainer : styles.theirMessageContainer,
      isRTL && (isMyMessage ? styles.rtlMyMessage : styles.rtlTheirMessage)
    ]}>
      {renderMessageContent()}
      <Text style={[styles.messageTime, isRTL && styles.rtlText]}>
        {new Date(message.created_at).toLocaleTimeString(isRTL ? 'ar-AE' : 'en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </Text>
    </View>
  );
};

const InputBox = ({ onSubmit, onAddPress }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const [text, setText] = useState('');
  
  const handlePress = () => {
    if (text.trim()) {
      onSubmit(text.trim());
      setText('');
    }
  };

  return (
    <View style={[styles.inputBoxContainer, isRTL && styles.rtlInputBoxContainer]}>
      <TouchableOpacity onPress={onAddPress}>
        <Ionicons name="add-circle-outline" size={32} color={Colors.primary} style={styles.inputIcons} />
      </TouchableOpacity>
      <TextInput
        style={[styles.textInput, isRTL && styles.rtlTextInput]}
        placeholder={t('chatScreen.typeMessage')}
        placeholderTextColor={Colors.gray}
        value={text}
        onChangeText={setText}
        multiline
        textAlign={isRTL ? 'right' : 'left'}
      />
      <TouchableOpacity onPress={handlePress} style={styles.sendButton}>
        <Ionicons name="send" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

// ======================= بداية البيانات الوهمية =======================
const FAKE_CURRENT_USER_ID = 1;

const FAKE_MESSAGES = [
  { id: 8, message: 'وأخرى هنا.', sender_id: FAKE_CURRENT_USER_ID, created_at: '2023-10-27T10:07:00Z', type: 'text' },
  { id: 7, message: 'رسالة جديدة هنا.', sender_id: 2, created_at: '2023-10-27T10:06:00Z', type: 'text' },
  { id: 6, message: 'بالتأكيد!', sender_id: FAKE_CURRENT_USER_ID, created_at: '2023-10-27T10:05:00Z', type: 'text' },
  { id: 5, message: 'يمكننا الآن إضافة المزيد من الرسائل لاختبار التمرير.', sender_id: 2, created_at: '2023-10-27T10:04:00Z', type: 'text' },
  { id: 4, message: 'ممتاز، كل شيء يعمل كما هو متوقع.', sender_id: FAKE_CURRENT_USER_ID, created_at: '2023-10-27T10:03:00Z', type: 'text' },
  { id: 3, message: 'هذه رسالة طويلة قليلاً فقط لنرى كيف ستبدو في التصميم وهل سيتم التفاف النص بشكل صحيح.', sender_id: 2, created_at: '2023-10-27T10:02:00Z', type: 'text' },
  { id: 2, message: 'أهلاً! تبدو رائعة.', sender_id: FAKE_CURRENT_USER_ID, created_at: '2023-10-27T10:01:00Z', type: 'text' },
  { id: 1, message: 'مرحباً! هذا تصميم شاشة المحادثة.', sender_id: 2, created_at: '2023-10-27T10:00:00Z', type: 'text' },
].reverse();

const FAKE_PARTNER = {
  name: 'علي الأحمد',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  isOnline: true,
};
// ======================= نهاية البيانات الوهمية =======================

const ChatHeader = ({ partner, onBackPress, navigation }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  return (
    <View style={[styles.headerContainer, isRTL && styles.rtlHeaderContainer]}>
      <TouchableOpacity onPress={onBackPress}>
        <Ionicons 
          name={isRTL ? "arrow-forward" : "arrow-back"} 
          size={24} 
          color="white" 
        />
      </TouchableOpacity>
      <View style={[styles.headerContent, isRTL && styles.rtlHeaderContent]}>
        <TouchableOpacity onPress={() => navigation.navigate('ChatsScreen')}> 
          <Image source={require('../../../assets/images/avatar.png')} style={styles.headerAvatar} /> 
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerName, {textAlign:isRTL?'right':'left'}]}>{partner.name}</Text>
          <Text style={[styles.headerStatus, isRTL && styles.rtlText]}>
            {partner.isOnline ? t('chatScreen.online') : t('chatScreen.lastSeen')}
          </Text>
        </View>
      </View>
      <View style={styles.headerIcons}>
      </View>
    </View>
  );
};

// مكون مودال الخريطة
const LocationModal = ({ isVisible, onClose, onLocationSelect }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  // الموقع الافتراضي (عمان)
  const defaultRegion = {
    latitude: 31.9454,
    longitude: 35.9284,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // دالة للحصول على الموقع باستخدام watchPosition
  const getLocationWithWatch = (onSuccess, onError) => {
    // إيقاف أي watch سابق
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
    }

    watchId = Geolocation.watchPosition(
      (position) => {
        if (watchId !== null) {
          Geolocation.clearWatch(watchId);
          watchId = null;
        }
        onSuccess(position);
      },
      (error) => {
        if (watchId !== null) {
          Geolocation.clearWatch(watchId);
          watchId = null;
        }
        onError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        distanceFilter: 0
      }
    );

    // timeout للـ watch
    setTimeout(() => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
        watchId = null;
        onError({ code: 3, message: 'Watch timeout' });
      }
    }, 15000);
  };

  // الحصول على الموقع الحالي
  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    
    // محاولة أولى بدقة عالية
    Geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCurrentLocation(location);
        setSelectedLocation(location);
        setIsLoadingLocation(false);
      },
      (error) => {
        console.log('خطأ في المحاولة الأولى:', error);
        
        // محاولة ثانية بدقة أقل
        Geolocation.getCurrentPosition(
          (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setCurrentLocation(location);
            setSelectedLocation(location);
            setIsLoadingLocation(false);
          },
            (secondError) => {
              console.log('خطأ في المحاولة الثانية:', secondError);
              
              console.log('محاولة ثالثة باستخدام watchPosition');
              getLocationWithWatch(
                (position) => {
                  const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  };
                  setCurrentLocation(location);
                  setSelectedLocation(location);
                  setIsLoadingLocation(false);
                },
                (watchError) => {
                  console.log('خطأ في watchPosition:', watchError);
                  
                  Alert.alert(
                    'تنبيه', 
                    'لا يمكن الحصول على موقعك الحالي. هل تريد استخدام موقع افتراضي؟',
                    [
                      {
                        text: 'إلغاء',
                        style: 'cancel',
                        onPress: () => setIsLoadingLocation(false)
                      },
                      {
                        text: 'استخدام الموقع الافتراضي',
                        onPress: () => {
                          setCurrentLocation(defaultRegion);
                          setSelectedLocation(defaultRegion);
                          setIsLoadingLocation(false);
                        }
                      }
                    ]
                  );
                }
              );
            },
          { 
            enableHighAccuracy: false, 
            timeout: 15000, 
            maximumAge: 300000, 
            distanceFilter: 100
          }
        );
      },
      { 
        enableHighAccuracy: true, 
        timeout: 20000, 
        maximumAge: 60000,
        distanceFilter: 10
      }
    );
  };


  const sendSelectedLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onClose();
    } else {
      Alert.alert('تنبيه', 'يرجى تحديد موقع أولاً');
    }
  };

  const sendCurrentLocation = async () => {
    setIsLoadingLocation(true);
    
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('خطأ', 'لا يمكن الوصول إلى الموقع بدون إذن');
        setIsLoadingLocation(false);
        return;
      }

     
      Geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          onLocationSelect(location);
          onClose();
          setIsLoadingLocation(false);
        },
        (error) => {
          console.log('خطأ في المحاولة الأولى:', error);
          
          // محاولة ثانية بدقة أقل
          Geolocation.getCurrentPosition(
            (position) => {
              const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              onLocationSelect(location);
              onClose();
              setIsLoadingLocation(false);
            },
            (secondError) => {
              console.log('خطأ في المحاولة الثانية:', secondError);
              
              // محاولة ثالثة باستخدام watchPosition
              console.log('محاولة ثالثة باستخدام watchPosition');
              getLocationWithWatch(
                (position) => {
                  const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  };
                  onLocationSelect(location);
                  onClose();
                  setIsLoadingLocation(false);
                },
                (watchError) => {
                  console.log('خطأ في watchPosition:', watchError);
                  
                  // استخدام الموقع الافتراضي كحل أخير
                  Alert.alert(
                    'تنبيه', 
                    'لا يمكن الحصول على موقعك الحالي. هل تريد استخدام موقع افتراضي؟',
                    [
                      {
                        text: 'إلغاء',
                        style: 'cancel',
                        onPress: () => setIsLoadingLocation(false)
                      },
                      {
                        text: 'استخدام الموقع الافتراضي',
                        onPress: () => {
                          const location = {
                            latitude: defaultRegion.latitude,
                            longitude: defaultRegion.longitude,
                          };
                          onLocationSelect(location);
                          onClose();
                          setIsLoadingLocation(false);
                        }
                      }
                    ]
                  );
                }
              );
            },
            { 
              enableHighAccuracy: false, 
              timeout: 15000, 
              maximumAge: 300000, // 5 دقائق
              distanceFilter: 100
            }
          );
        },
        { 
          enableHighAccuracy: true, 
          timeout: 20000, 
          maximumAge: 60000,
          distanceFilter: 10
        }
      );
    } catch (error) {
      console.log('خطأ:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء الحصول على الموقع');
      setIsLoadingLocation(false);
    }
  };

  // تنظيف الحالة عند إغلاق المودال
  const handleClose = () => {
    // إيقاف watchPosition إذا كان نشطاً
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      watchId = null;
    }
    
    setSelectedLocation(null);
    setCurrentLocation(null);
    setIsLoadingLocation(false);
    onClose();
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        
        if (hasPermission) {
          return true;
        }
        
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'إذن الموقع',
            message: 'يحتاج التطبيق للوصول إلى موقعك لمشاركة الموقع',
            buttonNeutral: 'اسأل لاحقاً',
            buttonNegative: 'إلغاء',
            buttonPositive: 'موافق',
          }
        );
        
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('خطأ في طلب إذن الموقع:', err);
        return false;
      }
    }
    return true;
  };

  // طلب إذن جهات الاتصال
  const requestContactsPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS
        );
        
        if (hasPermission) {
          return true;
        }
        
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'إذن جهات الاتصال',
            message: 'يحتاج التطبيق للوصول إلى جهات الاتصال لمشاركتها',
            buttonNeutral: 'اسأل لاحقاً',
            buttonNegative: 'إلغاء',
            buttonPositive: 'موافق',
          }
        );
        
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('خطأ في طلب إذن جهات الاتصال:', err);
        return false;
      }
    }
    return true;
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.locationModalContainer}>
        {/* Header */}
        <View style={[styles.locationModalHeader, isRTL && styles.rtlLocationModalHeader]}>
          <TouchableOpacity onPress={handleClose} style={styles.locationModalCloseButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={[styles.locationModalTitle, isRTL && styles.rtlText]}>
            {t('chatScreen.selectLocation') || 'تحديد الموقع'}
          </Text>
          <TouchableOpacity 
            onPress={getCurrentLocation} 
            style={styles.locationModalMyLocationButton}
            disabled={isLoadingLocation}
          >
            {isLoadingLocation ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Ionicons name="locate" size={24} color={Colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={currentLocation ? {
              ...currentLocation,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            } : defaultRegion}
            region={currentLocation ? {
              ...currentLocation,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            } : undefined}
            onPress={(event) => {
              setSelectedLocation(event.nativeEvent.coordinate);
            }}
            showsUserLocation={true}
            showsMyLocationButton={false}
          >
            {selectedLocation && (
              <Marker
                coordinate={selectedLocation}
                title={t('chatScreen.selectedLocation') || 'الموقع المحدد'}
                pinColor={Colors.primary}
              />
            )}
          </MapView>
          
          {isLoadingLocation && (
            <View style={styles.mapLoadingOverlay}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.mapLoadingText}>جاري الحصول على الموقع...</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.locationModalActions}>
          <TouchableOpacity
            style={[styles.locationModalButton, styles.locationModalSecondaryButton]}
            onPress={sendCurrentLocation}
            disabled={isLoadingLocation}
          >
            {isLoadingLocation ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Ionicons name="navigate" size={20} color={Colors.primary} />
            )}
            <Text style={[styles.locationModalButtonText, styles.locationModalSecondaryButtonText, isRTL && styles.rtlText]}>
              {t('chatScreen.sendCurrentLocation') || 'إرسال موقعي الحالي'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.locationModalButton, styles.locationModalPrimaryButton]}
            onPress={sendSelectedLocation}
            disabled={!selectedLocation}
          >
            <Ionicons name="send" size={20} color="white" />
            <Text style={[styles.locationModalButtonText, styles.locationModalPrimaryButtonText, isRTL && styles.rtlText]}>
              {t('chatScreen.sendSelectedLocation') || 'إرسال الموقع المحدد'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Help Text */}
        <Text style={[styles.locationModalHelpText, isRTL && styles.rtlText]}>
          {t('chatScreen.locationHelp') || 'اضغط على الخريطة لتحديد موقع أو اضغط على زر الموقع الحالي'}
        </Text>
      </SafeAreaView>
    </Modal>
  );
};

// مكون مودال جهات الاتصال
const ContactsModal = ({ isVisible, onClose, contacts, onContactSelect }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.contactsModalContainer}>
        {/* Header */}
        <View style={[styles.contactsModalHeader, isRTL && styles.rtlContactsModalHeader]}>
          <TouchableOpacity onPress={onClose} style={styles.contactsModalCloseButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={[styles.contactsModalTitle, isRTL && styles.rtlText]}>
            {t('chatScreen.selectContact') || 'اختر جهة اتصال'}
          </Text>
          <View style={styles.contactsModalPlaceholder} />
        </View>

        {/* Contacts List */}
        <FlatList
          data={contacts}
          keyExtractor={(item, index) => `${item.recordID || index}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.contactItem, isRTL && styles.rtlContactItem]}
              onPress={() => onContactSelect(item)}
            >
              <View style={styles.contactAvatar}>
                <Text style={styles.contactAvatarText}>
                  {item.displayName ? item.displayName.charAt(0).toUpperCase() : '?'}
                </Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={[styles.contactName, isRTL && styles.rtlText]}>
                  {item.displayName || 'جهة اتصال'}
                </Text>
                <Text style={[styles.contactPhone, isRTL && styles.rtlText]}>
                  {item.phoneNumbers[0]?.number || 'غير متوفر'}
                </Text>
              </View>
              <Ionicons 
                name={isRTL ? "chevron-back" : "chevron-forward"} 
                size={20} 
                color={Colors.gray} 
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.contactsEmptyContainer}>
              <Ionicons name="people-outline" size={64} color={Colors.gray} />
              <Text style={[styles.contactsEmptyText, isRTL && styles.rtlText]}>
                {t('chatScreen.noContacts') || 'لا توجد جهات اتصال'}
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </Modal>
  );
};

// مكون المودال مع الوظائف الفعلية
const ActionsModal = ({ isVisible, onClose, onActionPress }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  const actions = [
    { 
      title: t('chatScreen.camera') || 'الكاميرا', 
      icon: 'camera', 
      color: '#E53935',
      action: 'camera'
    },
    { 
      title: t('chatScreen.gallery') || 'معرض الصور', 
      icon: 'images', 
      color: '#8E24AA',
      action: 'gallery'
    },
    { 
      title: t('chatScreen.document') || 'مستند', 
      icon: 'document-text', 
      color: '#0288D1',
      action: 'document'
    },
    { 
      title: t('chatScreen.location') || 'الموقع', 
      icon: 'location', 
      color: '#388E3C',
      action: 'location'
    },
    { 
      title: t('chatScreen.contact') || 'جهة اتصال', 
      icon: 'person', 
      color: '#FBC02D',
      action: 'contact'
    },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}>
        <View style={[styles.modalContent, isRTL && styles.rtlModalContent]}>
          {actions.map(action => (
            <TouchableOpacity 
              key={action.title} 
              style={styles.actionButton}
              onPress={() => {
                onActionPress && onActionPress(action.action);
                onClose();
              }}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon} size={28} color="white" />
              </View>
              <Text style={[styles.actionText, isRTL && styles.rtlText]}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const ChatScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState(FAKE_MESSAGES);
  const [isActionsModalVisible, setActionsModalVisible] = useState(false);
  const [isLocationModalVisible, setLocationModalVisible] = useState(false); 
  const [isContactsModalVisible, setContactsModalVisible] = useState(false); 
  const [contacts, setContacts] = useState([]);
  
  // استقبال معلومات المحادثة من route.params
  const { chat } = route.params || {};
  
  // تحديد معلومات الشريك من البيانات المستلمة
  const partner = chat ? {
    name: chat.name || chat.title || 'محادثة',
    avatar: chat.avatar || chat.image || require('../../../assets/images/avatar.png'),
    isOnline: chat.isOnline || chat.status === 'online' || false,
  } : FAKE_PARTNER;

  // معالجة بيانات المحادثة المستلمة
  useEffect(() => {
    if (chat) {
      if (chat.messages && Array.isArray(chat.messages)) {
        setMessages(chat.messages);
      }
      
      if (chat.newMessage) {
        setMessages(prevMessages => [...prevMessages, chat.newMessage]);
      }
      
      if (chat.newGroup) {
        const groupMessage = {
          id: Math.random(),
          message: `تم إنشاء مجموعة جديدة: ${chat.newGroup.name}`,
          sender_id: 'system',
          created_at: new Date().toISOString(),
          type: 'text'
        };
        setMessages(prevMessages => [...prevMessages, groupMessage]);
      }
    }
  }, [chat]);

  // معالج إرسال الموقع من المودال
  const handleLocationSelect = (location) => {
    const newMessage = {
      id: Math.random(),
      message: t('chatScreen.locationShared') || 'تم مشاركة الموقع',
      sender_id: FAKE_CURRENT_USER_ID,
      created_at: new Date().toISOString(),
      type: 'location',
      latitude: location.latitude,
      longitude: location.longitude,
      address: t('chatScreen.location') || 'الموقع'
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const handleSendMessage = (newMessageText) => {
    const newMessage = {
      id: Math.random(),
      message: newMessageText,
      sender_id: FAKE_CURRENT_USER_ID,
      created_at: new Date().toISOString(),
      type: 'text'
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  // طلب إذن جهات الاتصال
  const requestContactsPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS
        );
        
        if (hasPermission) {
          return true;
        }
        
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'إذن جهات الاتصال',
            message: 'يحتاج التطبيق للوصول إلى جهات الاتصال لمشاركتها',
            buttonNeutral: 'اسأل لاحقاً',
            buttonNegative: 'إلغاء',
            buttonPositive: 'موافق',
          }
        );
        
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('خطأ في طلب إذن جهات الاتصال:', err);
        return false;
      }
    }
    return true;
  };

  // تحميل جهات الاتصال
  const loadContacts = async () => {
    try {
      const hasPermission = await requestContactsPermission();
      if (hasPermission) {
        Contacts.getAll()
          .then(contactsList => {
            // تصفية جهات الاتصال التي لها أسماء وأرقام
            const filteredContacts = contactsList.filter(contact => 
              contact.displayName && 
              contact.phoneNumbers && 
              contact.phoneNumbers.length > 0
            );
            setContacts(filteredContacts);
            setContactsModalVisible(true);
          })
          .catch(error => {
            console.log('خطأ في قراءة جهات الاتصال:', error);
            Alert.alert('خطأ', 'لا يمكن قراءة جهات الاتصال');
          });
      } else {
        Alert.alert('خطأ', 'لا يمكن الوصول إلى جهات الاتصال بدون إذن');
      }
    } catch (err) {
      console.warn('خطأ في تحميل جهات الاتصال:', err);
      Alert.alert('خطأ', 'حدث خطأ أثناء تحميل جهات الاتصال');
    }
  };

  // إرسال جهة اتصال محددة
  const sendContact = (contact) => {
    const newMessage = {
      id: Math.random(),
      message: t('chatScreen.contactMessage') || 'تم مشاركة جهة اتصال',
      sender_id: FAKE_CURRENT_USER_ID,
      created_at: new Date().toISOString(),
      type: 'contact',
      contactName: contact.displayName,
      contactPhone: contact.phoneNumbers[0]?.number || 'غير متوفر'
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setContactsModalVisible(false);
  };

  // طلب الإذن للكاميرا
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'إذن الكاميرا',
            message: 'يحتاج التطبيق للوصول إلى الكاميرا لالتقاط الصور',
            buttonNeutral: 'اسأل لاحقاً',
            buttonNegative: 'إلغاء',
            buttonPositive: 'موافق',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // طلب إذن الموقع
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'إذن الموقع',
            message: 'يحتاج التطبيق للوصول إلى موقعك لمشاركة الموقع',
            buttonNeutral: 'اسأل لاحقاً',
            buttonNegative: 'إلغاء',
            buttonPositive: 'موافق',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleActionPress = async (action) => {
    switch (action) {
      case 'camera':
        const hasPermission = await requestCameraPermission();
        if (hasPermission) {
          const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
          };

          launchCamera(options, (response) => {
            if (response.didCancel || response.error) {
              console.log('تم إلغاء الكاميرا أو حدث خطأ');
              return;
            }

            if (response.assets && response.assets[0]) {
              const imageUri = response.assets[0].uri;
              const newMessage = {
                id: Math.random(),
                message: 'تم إرسال صورة',
                sender_id: FAKE_CURRENT_USER_ID,
                created_at: new Date().toISOString(),
                type: 'image',
                image: imageUri
              };
              setMessages(prevMessages => [...prevMessages, newMessage]);
            }
          });
        } else {
          Alert.alert('خطأ', 'لا يمكن الوصول إلى الكاميرا بدون إذن');
        }
        break;

      case 'gallery':
        const galleryOptions = {
          mediaType: 'photo',
          includeBase64: false,
          maxHeight: 2000,
          maxWidth: 2000,
        };

        launchImageLibrary(galleryOptions, (response) => {
          if (response.didCancel || response.error) {
            console.log('تم إلغاء معرض الصور أو حدث خطأ');
            return;
          }

          if (response.assets && response.assets[0]) {
            const imageUri = response.assets[0].uri;
            const newMessage = {
              id: Math.random(),
              message: 'تم إرسال صورة من المعرض',
              sender_id: FAKE_CURRENT_USER_ID,
              created_at: new Date().toISOString(),
              type: 'image',
              image: imageUri
            };
            setMessages(prevMessages => [...prevMessages, newMessage]);
          }
        });
        break;

      case 'document':
        try {
          const result = await DocumentPicker.pick({
            type: [DocumentPicker.types.allFiles],
          });

          if (result && result[0]) {
            const newMessage = {
              id: Math.random(),
              message: 'تم إرسال مستند',
              sender_id: FAKE_CURRENT_USER_ID,
              created_at: new Date().toISOString(),
              type: 'document',
              documentName: result[0].name,
              documentUri: result[0].uri
            };
            setMessages(prevMessages => [...prevMessages, newMessage]);
          }
        } catch (err) {
          if (DocumentPicker.isCancel(err)) {
            console.log('تم إلغاء اختيار المستند');
          } else {
            console.log('خطأ في اختيار المستند:', err);
          }
        }
        break;

      case 'location':
        setLocationModalVisible(true);
        break;

      case 'contact':
        loadContacts();
        break;

      default:
        console.log('Unknown action:', action);
    }
  };

  const renderMessageItem = ({ item }) => (
    <Message message={item} currentUserId={FAKE_CURRENT_USER_ID} />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ChatHeader
        partner={partner}
        navigation={navigation}
        onBackPress={() => navigation ? navigation.goBack() : console.log('Go Back')}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        style={styles.container}
      >
        <View style={styles.messagesContainer}>
          <FlatList
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <InputBox
            onSubmit={handleSendMessage}
            onAddPress={() => setActionsModalVisible(true)} 
          />
        </View>
      </KeyboardAvoidingView>

      <ActionsModal
        isVisible={isActionsModalVisible}
        onClose={() => setActionsModalVisible(false)} 
        onActionPress={handleActionPress}
      />

      <LocationModal
        isVisible={isLocationModalVisible}
        onClose={() => setLocationModalVisible(false)}
        onLocationSelect={handleLocationSelect}
      />

      <ContactsModal
        isVisible={isContactsModalVisible}
        onClose={() => setContactsModalVisible(false)}
        contacts={contacts}
        onContactSelect={sendContact}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: Colors.primary 
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 10,
    paddingBottom: 20,
  },
  inputContainer: {
    backgroundColor: Colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 0 : 8,
  },
  headerContainer: { 
    flexDirection: 'row', 
    backgroundColor: Colors.primary, 
    paddingHorizontal: 10, 
    paddingVertical: 8,
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  headerAvatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    marginHorizontal: 10,
  },
  headerTextContainer: { 
    flex: 1,
  },
  headerName: { 
    color: 'white', 
    fontSize: 17, 
    fontWeight: '600' 
  },
  headerStatus: { 
    color: 'white', 
    fontSize: 13, 
    opacity: 0.8 
  },
  headerIcons: { 
    flexDirection: 'row' 
  },
  messageContainer: { 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 18, 
    marginVertical: 4, 
    maxWidth: '80%' 
  },
  myMessageContainer: { 
    backgroundColor: Colors.myMessage, 
    alignSelf: 'flex-end' 
  },
  theirMessageContainer: { 
    backgroundColor: Colors.theirMessage, 
    alignSelf: 'flex-start' 
  },
  messageText: { 
    fontSize: 16, 
    color: Colors.text 
  },
  messageTime: { 
    fontSize: 11, 
    color: Colors.gray, 
    alignSelf: 'flex-end', 
    marginTop: 4 
  },
  
  // Message attachment styles
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 5,
  },
  locationMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactMessage: {
    alignItems: 'flex-start',
    gap: 4,
  },
  documentMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  // System Message Styles
  systemMessageContainer: { 
    alignItems: 'center', 
    marginVertical: 8, 
    paddingHorizontal: 20 
  },
  systemMessageText: { 
    fontSize: 14, 
    color: Colors.gray, 
    fontStyle: 'italic',
    textAlign: 'center'
  },
  systemMessageTime: { 
    fontSize: 10, 
    color: Colors.gray, 
    marginTop: 2,
    textAlign: 'center'
  },
  inputBoxContainer: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    paddingHorizontal: 12, 
    paddingVertical: 20,
    backgroundColor: 'transparent',
    minHeight: 50,
    maxHeight: 120,
  },
  inputIcons: { 
    marginHorizontal: 8 
  },
  textInput: { 
    flex: 1, 
    backgroundColor: 'white', 
    borderRadius: 20, 
    paddingHorizontal: 15, 
    paddingTop: Platform.OS === 'ios' ? 10 : 8, 
    paddingBottom: Platform.OS === 'ios' ? 10 : 8, 
    fontSize: 16, 
    maxHeight: 80,
    minHeight: 40,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  sendButton: { 
    backgroundColor: Colors.accent, 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginHorizontal: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: Colors.modalBackdrop,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    width: '30%', 
    marginBottom: 20,
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: Colors.text,
  },
  // Location Modal Styles
  locationModalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  locationModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  rtlLocationModalHeader: {
    flexDirection: 'row-reverse',
  },
  locationModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  locationModalCloseButton: {
    padding: 5,
  },
  locationModalMyLocationButton: {
    padding: 5,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  mapLoadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  locationModalActions: {
    padding: 15,
    gap: 10,
  },
  locationModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 8,
  },
  locationModalPrimaryButton: {
    backgroundColor: Colors.primary,
  },
  locationModalSecondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  locationModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  locationModalPrimaryButtonText: {
    color: 'white',
  },
  locationModalSecondaryButtonText: {
    color: Colors.primary,
  },
  locationModalHelpText: {
    textAlign: 'center',
    color: Colors.gray,
    fontSize: 14,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  // Contacts Modal Styles
  contactsModalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contactsModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  rtlContactsModalHeader: {
    flexDirection: 'row-reverse',
  },
  contactsModalCloseButton: {
    padding: 5,
  },
  contactsModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  contactsModalPlaceholder: {
    width: 34, // نفس عرض زر الإغلاق
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rtlContactItem: {
    flexDirection: 'row-reverse',
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactAvatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: Colors.gray,
  },
  contactsEmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  contactsEmptyText: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 16,
    textAlign: 'center',
  },
  // Location Message Styles (WhatsApp-like)
  locationMessageContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    maxWidth: 280,
    minWidth: 200,
  },
  locationMessageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  locationMessageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  locationMessageMap: {
    height: 120,
    width: '100%',
  },
  locationMapView: {
    flex: 1,
  },
  locationMessageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F8F9FA',
  },
  locationMessageCoordinates: {
    fontSize: 11,
    color: '#666',
    flex: 1,
  },
  locationMessageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  locationMessageButtonText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '500',
    marginLeft: 4,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  ltrText: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  // RTL Styles
  rtlHeaderContainer: {
    flexDirection: 'row',
  },
  rtlHeaderContent: {
    flexDirection: 'row',
    flex: 1,
  },
  rtlMyMessage: {
    alignSelf: 'flex-start',
  },
  rtlTheirMessage: {
    alignSelf: 'flex-end',
  },
  rtlInputBoxContainer: {
    flexDirection: 'row-reverse',
  },
  rtlTextInput: {
    textAlign: 'right',
  },
  rtlListContent: {
    paddingHorizontal: 10,
  },
  rtlModalContent: {
    flexDirection: 'row-reverse',
  },
});

export default ChatScreen;