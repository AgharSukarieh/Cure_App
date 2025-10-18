import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
  Image,
  Animated,
  I18nManager,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import { put } from '../../WebService/RequestBuilder';
import Constants from '../../config/globalConstants';
import GetLocation from 'react-native-get-location';

const getMenuItems = (t) => [
  { id: '1', title: t('salesReportPharm.paymentHistory'), icon: require('../../../assets/images/history_order.png'), screen: 'AccountInfo' },
  { id: '2', title: t('salesReportPharm.returns'), icon: require('../../../assets/icons/return-box.png'), screen: 'Return' },
  { id: '3', title: t('salesReportPharm.inventory'), icon: require('../../../assets/icons/inventory.png'), screen: 'Inventory' },
  { id: '5', title: t('salesReportPharm.orders'), icon: require('../../../assets/icons/booking.png'), screen: 'OrderScreen' },
];

const { width } = Dimensions.get('window') || { width: 375 };
const numColumns = 2; 
const itemMargin = 15;
const itemWidth = (width - (numColumns + 1) * itemMargin) / numColumns;

const Star = ({ size, position, duration }) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  if (!Animated) {
    console.log('Animated not available');
    return null;
  }

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, { toValue: 1, duration: duration * 0.5, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0, duration: duration * 0.5, useNativeDriver: true }),
      ])
    );
    const delay = setTimeout(() => animation.start(), Math.random() * duration);
    return () => {
      clearTimeout(delay);
      animation.stop();
    };
  }, [duration, opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.star,
        { width: size, height: size, left: position.x, top: position.y, opacity: opacityAnim },
      ]}
    />
  );
};

const StarsAnimation = () => (
  <>
    {[
      { size: 2, position: { x: "15%", y: "20%" }, duration: 2000 },
      { size: 1, position: { x: "25%", y: "60%" }, duration: 3000 },
      { size: 2, position: { x: "80%", y: "30%" }, duration: 2500 },
      { size: 1.5, position: { x: "90%", y: "75%" }, duration: 1800 },
      { size: 1, position: { x: "50%", y: "50%" }, duration: 2200 },
      { size: 1.5, position: { x: "5%", y: "80%" }, duration: 2800 },
    ].map((star, index) => (
      <Star key={index} {...star} />
    ))}
  </>
);

const AnimatedHeader = ({ title, onBackPress, showStars = true }) => {
  const isRTL = I18nManager.isRTL;
  
  return (
    <View style={styles.headerContainer}>
      <View style={styles.overlay} />
      {showStars && <StarsAnimation />}

      <View style={styles.headerContent}>
        {onBackPress ? (
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <Feather name={isRTL ? "chevron-right" : "chevron-left"} size={28} color="#FFF" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}

        <Text style={[styles.headerTitle, isRTL && styles.rtlText]}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>
    </View>
  );
};

const SalRepSpharm = ({ navigation, route }) => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  if (!navigation) {
    console.log('Navigation not available');
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Navigation not available</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
 
  const visitData = route?.params?.item;
  const visitId = route?.params?.visit_id;

  const menuItems = React.useMemo(() => {
    try {
      return getMenuItems(t);
    } catch (error) {
      console.log('Translation error:', error);
      return [
        { id: '1', title: 'سجل المدفوعات', icon: require('../../../assets/images/history_order.png'), screen: 'AccountInfo' },
        { id: '2', title: 'المرتجعات', icon: require('../../../assets/icons/return-box.png'), screen: 'Return' },
        { id: '3', title: 'المخزون', icon: require('../../../assets/icons/inventory.png'), screen: 'Inventory' },
        { id: '4', title: 'الطلبات', icon: require('../../../assets/icons/booking.png'), screen: 'OrderScreen' },
      ];
    }
  }, [t]);
  

  useEffect(() => {
    const initializeScreen = async () => {
      try {
        setIsLoading(true);
        
       
        await new Promise(resolve => setTimeout(resolve, 200));
        
        setIsReady(true);
        setIsLoading(false);
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🏥 SalRepSpharm - البيانات الواردة:');
        console.log('   - pharmacy_id:', visitData?.pharmacy_id);
        console.log('   - pharmacy_name:', visitData?.pharmacy_name || visitData?.name);
        console.log('   - visit_id:', visitId);
        console.log('   - isRTL:', isRTL);
        console.log('   - t available:', !!t);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      } catch (error) {
        console.error('❌ خطأ في تحميل الصفحة:', error);
        setIsLoading(false);
      }
    };
    
    initializeScreen();
  }, [visitData, visitId, isRTL, t]);
  
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
<StatusBar 
  barStyle={'light-content'} 
  backgroundColor={"#3498db"}  
/>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2197dcc7" />
          <Text style={styles.loadingText}>جاري التحميل...</Text>
        </View>
      </SafeAreaView>
    );
  }
  

  if (!visitData) {
    return (
      <SafeAreaView style={styles.safeArea}>
      <StatusBar 
  barStyle={'light-content'} 
  backgroundColor={"#3498db"}  
/>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>لا توجد بيانات للصيدلية</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handlePress = (screenName) => {
    try {
      console.log('🚀 الانتقال إلى:', screenName);
      console.log('📦 تمرير البيانات:', {
        pharmacy_id: visitData?.pharmacy_id,
        visit_id: visitId
      });
      
    
      navigation.navigate(screenName, { 
        item: visitData,
        visit_id: visitId
      });
    } catch (error) {
      console.log('Navigation error:', error);
    }
  };


  const handleEndVisit = async () => {
    if (!visitId) {
      Alert.alert(
        t('salesReportPharm.error') || 'خطأ',
        t('salesReportPharm.noVisitId') || 'معرف الزيارة مفقود'
      );
      return;
    }

    Alert.alert(
      t('salesReportPharm.confirmEndVisit') || 'تأكيد إنهاء الزيارة',
      t('salesReportPharm.confirmEndVisitMessage') || `هل أنت متأكد من إنهاء زيارة ${visitData?.pharmacy_name || visitData?.name}؟`,
      [
        {
          text: t('salesReportPharm.cancel') || 'إلغاء',
          style: 'cancel'
        },
        {
          text: t('salesReportPharm.confirm') || 'تأكيد',
          onPress: async () => {
            try {
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('📍 جلب الموقع لإنهاء الزيارة...');
              
              const location = await GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 15000,
              });

              console.log('✅ تم الحصول على الموقع:', location);
              console.log('🔚 إنهاء الزيارة:', visitId);

              const response = await put(
                `${Constants.visit.sales}/${visitId}`,
                {
                  longitude: location.longitude,
                  latitude: location.latitude
                },
                null
              );

              console.log('✅ Response:', response);
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

              if (response?.code === 200) {
                console.log('✅ تم إنهاء الزيارة بنجاح - الرجوع للصفحة السابقة');
                
             
                if (route?.params?.onVisitEnd) {
                  route.params.onVisitEnd();
                }
                
                navigation.goBack();
              } else {
                throw new Error(response?.message || 'Failed to end visit');
              }
            } catch (error) {
              console.error('❌ خطأ في إنهاء الزيارة:', error);
              Alert.alert(
                t('salesReportPharm.error') || 'خطأ',
                error.message || t('salesReportPharm.endVisitError') || 'حدث خطأ في إنهاء الزيارة'
              );
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handlePress(item.screen)}
    >
      <View style={styles.iconContainer}>
        <Image 
          source={item.icon} 
          style={styles.icon} 
          resizeMode="contain"
          onError={(error) => console.log('Image load error:', error)}
        />
      </View>
      <Text style={[styles.itemText, isRTL && styles.rtlText]}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
   <StatusBar 
  barStyle={'light-content'} 
  backgroundColor={"#3498db"}  translucent={false}
/>
      <View style={styles.header}>
        <AnimatedHeader
          title={visitData?.pharmacy_name || visitData?.name || t('salesReportPharm.headerTitle') || 'تقرير المبيعات'}
          onBackPress={() => navigation.goBack()}
        />
      </View>

      <View style={styles.contentContainer}>
        <FlatList
          data={menuItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={styles.listContentContainer}
          columnWrapperStyle={styles.row}
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          windowSize={5}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => (
            <View style={styles.endVisitContainer}>
              <TouchableOpacity
                style={styles.endVisitButton}
                onPress={handleEndVisit}
                activeOpacity={0.8}
              >
                <Feather name="check-circle" size={20} color="#FFF" />
                <Text style={styles.endVisitButtonText}>
                  {t('salesReportPharm.endVisit') || 'إنهاء الزيارة'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {},
  listContentContainer: {
    padding: itemMargin / 2,
  },
  row: {
    justifyContent: 'space-around',
  },
  itemContainer: {
    width: itemWidth,
    height: itemWidth,
    backgroundColor: '#EAF4FC',
    borderRadius: 20,
    padding: 10,
    margin: itemMargin / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: '60%',
    height: '60%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    textAlign: 'center',
  },
  icon: {
    width: '60%',
    height: '60%',
  },
  headerContainer: {
    height: 60,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#2197dcc7',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2197dcc7',
  },
  star: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  headerContent: {
    zIndex: 2,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  backButton: {
    padding: 5,
    width: 40,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  endVisitContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 10,
  },
  endVisitButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  endVisitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#2197dcc7',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default SalRepSpharm;