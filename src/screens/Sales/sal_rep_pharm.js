import React, { useEffect, useRef } from 'react';
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
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';

const getMenuItems = (t) => [
  { id: '1', title: t('salesReportPharm.paymentHistory'), icon: require('../../../assets/images/history_order.png'), screen: 'AccountInfo' },
  { id: '2', title: t('salesReportPharm.returns'), icon: require('../../../assets/icons/return-box.png'), screen: 'Return' },
  { id: '3', title: t('salesReportPharm.inventory'), icon: require('../../../assets/icons/inventory.png'), screen: 'Inventory' },
  { id: '4', title: t('salesReportPharm.monthlyPlan'), icon: require('../../../assets/icons/report.png'), screen: 'MonthlyPlanSales' },
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

const sal_rep_pharm = ({ navigation }) => {
  if (!navigation) {
    console.log('Navigation not available');
    return null;
  }
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  if (!t) {
    console.log('Translation not available');
    return null;
  }
  
  if (!I18nManager) {
    console.log('I18nManager not available');
    return null;
  }
  
  const menuItems = React.useMemo(() => {
    try {
      return getMenuItems(t);
    } catch (error) {
      console.log('Translation error:', error);
      return [
        { id: '1', title: 'سجل المدفوعات', icon: require('../../../assets/images/history_order.png'), screen: 'AccountInfo' },
        { id: '2', title: 'المرتجعات', icon: require('../../../assets/icons/return-box.png'), screen: 'Return' },
        { id: '3', title: 'المخزون', icon: require('../../../assets/icons/inventory.png'), screen: 'Inventory' },
        { id: '4', title: 'الخطة الشهرية', icon: require('../../../assets/icons/monthly-plan.png'), screen: 'MonthlyPlanSales' },
        { id: '5', title: 'الطلبات', icon: require('../../../assets/icons/booking.png'), screen: 'OrderScreen' },
      ];
    }
  }, [t]);

  const handlePress = (screenName) => {
    try {
      navigation.navigate(screenName);
    } catch (error) {
      console.log('Navigation error:', error);
    }
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
      <StatusBar barStyle={'light-content'} backgroundColor={"#39a5e4"} />
      <View style={styles.header}>
        <AnimatedHeader
          title={t('salesReportPharm.headerTitle') || 'تقرير المبيعات'}
          onBackPress={() => navigation.goBack()}
        />
      </View>

      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.listContentContainer}
        columnWrapperStyle={styles.row}
      />
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
    backgroundColor: '#39a5e4',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#39a5e4',
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
});

export default sal_rep_pharm;
