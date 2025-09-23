import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  Animated,
  I18nManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';

Feather.loadFont();

// بيانات وهمية للصيدليات
const getFakePharmaciesData = (t) => [
  { id: '1', name: t('dailySales.pharmacies.alTaj'), location: t('dailySales.locations.ammanUniversity'), phone: '0791234567' },
  { id: '2', name: t('dailySales.pharmacies.alNahdi'), location: t('dailySales.locations.zarqaPrinceRashid'), phone: '0781234567' },
  { id: '3', name: t('dailySales.pharmacies.alMuttahida'), location: t('dailySales.locations.irbidMedical'), phone: '0771234567' },
  { id: '4', name: t('dailySales.pharmacies.zahratAlRouda'), location: t('dailySales.locations.ammanJabal'), phone: '0792345678' },
  { id: '5', name: t('dailySales.pharmacies.alMujtama'), location: t('dailySales.locations.saltOldTown'), phone: '0782345678' },
];

// مكون الهيكل العظمي للنص
const SkeletonText = ({ width = '100%', height = 16, style = {} }) => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    startAnimation();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: '#E2E8F0',
          borderRadius: 4,
          opacity,
        },
        style,
      ]}
    />
  );
};

// مكون الهيكل العظمي لشريط البحث
const SearchBarSkeleton = () => (
  <View style={styles.searchContainer}>
    <SkeletonText width={20} height={20} style={styles.searchIcon} />
    <SkeletonText width="80%" height={16} style={{ marginLeft: 8 }} />
  </View>
);

// مكون الهيكل العظمي لبطاقة الصيدلية
const PharmacyCardSkeleton = () => (
  <View style={styles.card}>
    <View style={styles.cardContent}>
      <View style={styles.cardRow}>
        <SkeletonText width={14} height={14} style={styles.icon} />
        <SkeletonText width="70%" height={16} />
      </View>
      <View style={styles.cardRow}>
        <SkeletonText width={14} height={14} style={styles.icon} />
        <SkeletonText width="60%" height={14} />
      </View>
      <View style={styles.cardRow}>
        <SkeletonText width={14} height={14} style={styles.icon} />
        <SkeletonText width="50%" height={14} />
      </View>
    </View>
    <SkeletonText width={24} height={24} style={{ borderRadius: 12 }} />
  </View>
);

// مكون شاشة التحميل بالهياكل العظمية
const LoadingSkeletons = () => (
  <View style={{ flex: 1 }}>
    <SearchBarSkeleton />
    <View style={styles.listContainer}>
      {[1, 2, 3, 4, 5].map((item) => (
        <PharmacyCardSkeleton key={item} />
      ))}
    </View>
  </View>
);

// مكون شريط البحث
const SearchBar = ({ value, onChangeText }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  return (
    <View style={styles.searchContainer}>
      <Feather name="search" size={20} color="#A0AEC0" style={styles.searchIcon} />
      <TextInput
        style={[styles.searchInput, isRTL && styles.rtlText]}
        placeholder={t('dailySales.searchPlaceholder')}
        placeholderTextColor="#A0AEC0"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

// مكون بطاقة الصيدلية
const PharmacyCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.cardContent}>
      <View style={styles.cardRow}>
        <FontAwesome5 name="clinic-medical" size={14} color="#4263EB" style={styles.icon} />
        <Text style={styles.cardTextName}>{item.name}</Text>
      </View>
      <View style={styles.cardRow}>
        <FontAwesome5 name="map-marker-alt" size={14} color="#4A5568" style={styles.icon} />
        <Text style={styles.cardText}>{item.location}</Text>
      </View>
      <View style={styles.cardRow}>
        <FontAwesome5 name="phone" size={14} color="#4A5568" style={styles.icon} />
        <Text style={styles.cardText}>{item.phone}</Text>
      </View>
    </View>
    <Feather name={I18nManager.isRTL ? "chevron-left" : "chevron-right"} size={24} color="#A0AEC0" />
  </TouchableOpacity>
);

// مكون شاشة إضافة صيدلية
const AddPharmacyModal = ({ visible, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <TouchableOpacity style={StyleSheet.absoluteFill} onPressOut={onClose} />
        <View style={styles.modalContainer}>
          <Text style={[styles.modalTitle, isRTL && styles.rtlText]}>{t('dailySales.addPharmacy')}</Text>
          <TextInput style={[styles.modalInput, isRTL && styles.rtlText]} placeholder={t('dailySales.pharmacyName')} placeholderTextColor="#CBD5E0" />
          <TextInput style={[styles.modalInput, isRTL && styles.rtlText]} placeholder={t('dailySales.pharmacyLocation')} placeholderTextColor="#CBD5E0" />
          <TextInput style={[styles.modalInput, isRTL && styles.rtlText]} placeholder={t('dailySales.phoneNumber')} placeholderTextColor="#CBD5E0" keyboardType="phone-pad" />
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={onSubmit}>
              <Text style={styles.modalButtonText}>{t('dailySales.add')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.closeButton]} onPress={onClose}>
              <Text style={[styles.modalButtonText, styles.closeButtonText]}>{t('dailySales.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const DailySales = ({ navigation }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [pharmacies, setPharmacies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    setTimeout(() => {
      setPharmacies(getFakePharmaciesData(t));
      setIsLoading(false);
    }, 1500);
  }, [t]);

  const filteredPharmacies = pharmacies.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pharmacy.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPharmacy = () => {
    console.log('Adding pharmacy...');
    setModalVisible(false);
  };

  // تحديد حجم الخط بناءً على عرض الشاشة
  const responsiveFontSize = width < 350 ? 18 : 20;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name={I18nManager.isRTL ? "chevron-right" : "chevron-left"} size={28} color="#1A202C" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: responsiveFontSize }, isRTL && styles.rtlText]}>{t('dailySales.headerTitle')}</Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <LoadingSkeletons />
      ) : (
        <>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          <FlatList
            data={filteredPharmacies}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PharmacyCard
                item={item}
                onPress={() => navigation.navigate('Sal_rep_pharm',{item:"dfd",area:"dssfvsd",date:"sdef"})}
              />
            )}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={<Text style={[styles.emptyListText, isRTL && styles.rtlText]}>{t('dailySales.noPharmacies')}</Text>}
          />
        </>
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Feather name="plus" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <AddPharmacyModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddPharmacy}
      />
    </SafeAreaView>
  );
};
export  default DailySales ;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '4%',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#1A202C',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: '4%',
    marginVertical: 10,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2D3748',
    textAlign: 'right',
  },
  listContainer: {
    paddingHorizontal: '4%',
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
    marginRight: 10,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
    width: 15,
    textAlign: 'center',
  },
  cardTextName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    textAlign: 'left',
  },
  cardText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'left',
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#718096',
  },
  fab: {
    position: 'absolute',
    bottom: '4%',
    right: '5%',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4263EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4263EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#F7FAFC',
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    color: '#2D3748',
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  modalButtonContainer: {
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: '#4263EB',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  closeButtonText: {
    color: '#4A5568',
  },
  // أنماط RTL
  rtlText: {
    textAlign: I18nManager.isRTL ? "right" : "left",
    writingDirection: 'rtl',
  },
});