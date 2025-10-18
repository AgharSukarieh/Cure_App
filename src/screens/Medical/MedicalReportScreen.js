import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
    SafeAreaView, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, StatusBar, InteractionManager, Alert, View, Text
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Moment from 'moment';
import DatePicker from 'react-native-date-picker';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrentUser, useMedicalId } from '../../hooks/useCurrentUser';
import { put } from '../../WebService/RequestBuilder';
import Constants from '../../config/globalConstants';
import GetLocation from 'react-native-get-location';
import { useAlert } from '../../components/Alert/AlertProvider';

// المكونات الفرعية
import MedicalReportHeader from '../../components/MedicalReport/MedicalReportHeader';
import DateSelector from '../../components/MedicalReport/DateSelector';
import LocationHeader from '../../components/MedicalReport/LocationHeader';
import LoadingState from '../../components/MedicalReport/LoadingState';
import NoDataState from '../../components/MedicalReport/NoDataState';
import VisitsTable from '../../components/MedicalReport/VisitsTable';
import LocationModal from '../../components/MedicalReport/LocationModal';

// المودالات
import DailyaddModel from '../../components/Modals/DailyaddModel';
import DailySalesaddModel from '../../components/Modals/DailySalesaddModel';
import SkuModel from '../../components/Modals/skuModel';
import SkueditModel from '../../components/Modals/skueditModel';

// Custom Hooks
import useMedicalVisits from '../../hooks/useMedicalVisits';
import useLocationManagement from '../../hooks/useLocationManagement';

const MedicalReportScreen = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const { token } = useAuth();
    const { user: currentUser, isFromRedux } = useCurrentUser();
    const medicalId = useMedicalId();
    const alert = useAlert();
    
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [isLocationModalVisible, setLocationModalVisible] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedVisitData, setSelectedVisitData] = useState(null);
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    
    const scrollViewRef = useRef(null);

    const {
        visits,
        isLoading,
        isLoadingMore,
        hasMoreData,
        getMedicalVisits,
        loadMoreVisits,
        addVisit
    } = useMedicalVisits(currentUser, medicalId, selectedDate);

    const {
        citiesFormatted,
        areas,
        currentArea,
        currentCityId,
        currentAreaId,
        selectedCity,
        selectedArea,
        locationsLoading,
        weeklyscdata,
        handleCityChange,
        handleSaveLocation,
        loadCurrentLocation,
        setSelectedArea,
    } = useLocationManagement(currentUser, token, selectedDate);

    useEffect(() => {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('👤 MedicalReportScreen - مصدر بيانات المستخدم:');
        console.log('   - From Redux:', isFromRedux ? '✅' : '❌');
        console.log('   - User ID:', currentUser?.id);
        console.log('   - Medical ID:', medicalId);
        console.log('   - User Role:', currentUser?.role);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }, [currentUser, medicalId, isFromRedux]);

    const isTodaySelected = Moment(selectedDate).isSame(new Date(), 'day');

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initializeScreen = async () => {
                try {
                    let attempts = 0;
                    while (attempts < 20 && (!i18n.isInitialized && !i18n.language)) {
                        await new Promise(resolve => setTimeout(resolve, 50));
                        attempts++;
                    }

                    await new Promise(resolve => {
                        InteractionManager.runAfterInteractions(() => {
                            resolve();
                        });
                    });

                    if (isActive) {
                        setIsReady(true);
                        
                        console.log('🔄 Refreshing data on focus...');
                        getMedicalVisits(1, false);
                    }
                } catch (error) {
                    console.log('Error initializing screen:', error);
                    if (isActive) {
                        setIsReady(true);
                    }
                }
            };

            initializeScreen();

            return () => {
                isActive = false;
            };
        }, [i18n, getMedicalVisits])
    );

    useEffect(() => {
        if (isLocationModalVisible && citiesFormatted.length > 0 && weeklyscdata.length > 0) {
            loadCurrentLocation();
        }
    }, [isLocationModalVisible, citiesFormatted.length, weeklyscdata.length, loadCurrentLocation]);

    const handleDateChange = useCallback((date) => {
        console.log('📅 تم تغيير التاريخ إلى:', Moment(date).format('yyyy-MM-DD'));
        setDatePickerVisible(false);
        setSelectedDate(date);
    }, []);

    const handleAddNewVisit = useCallback((newVisitData) => {
        addVisit(newVisitData);
        setModalVisible(false);
    }, [addVisit]);

    const handleSaveLocationWrapper = useCallback(async () => {
        const result = await handleSaveLocation();
        if (result) {
            setLocationModalVisible(false);
        }
    }, [handleSaveLocation]);

    const handleDetailsPress = useCallback((item) => {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔍 فتح تفاصيل الزيارة:', item.id);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        setSelectedVisitData(item);
        setShowDetailsModal(true);
    }, []);

    const handleEditPress = useCallback((item) => {
        console.log('✏️ فتح تعديل الزيارة:', item.id);
        setSelectedVisitData(item);
        setShowEditModal(true);
    }, []);

    const scrollToTop = useCallback(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, []);

    const handleEndVisit = useCallback(async (visitItem) => {
        const visitIdToEnd = visitItem?.id;
        
        if (!visitIdToEnd) {
            alert.showError('خطأ', 'معرف الزيارة مفقود');
            return;
        }

        alert.showConfirm(
            'تأكيد إنهاء الزيارة',
            `هل أنت متأكد من إنهاء زيارة ${visitItem?.doctorName}؟`,
            async () => {
        try {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🔚 إنهاء الزيارة بدون موقع:', visitIdToEnd);
            
            const endpoint = currentUser?.role === 'sales' 
                ? `${Constants.visit.sales}/${visitIdToEnd}`
                : `${Constants.visit.medical}/${visitIdToEnd}`;

            console.log('📡 Endpoint:', endpoint);

            const response = await put(
                endpoint,
                {
                    longitude: "0",
                    latitude: "0"
                },
                null
            );

                            console.log('✅ Response:', response);
                            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

                            if (response?.code === 200) {
                                console.log('✅ تم إنهاء الزيارة بنجاح');
                                
                                getMedicalVisits(1, false);
            } else {
                                throw new Error(response?.message || 'Failed to end visit');
                            }
        } catch (error) {
                            console.error('❌ خطأ في إنهاء الزيارة:', error);
                            alert.showError(
                                'خطأ',
                                error.message || 'حدث خطأ في إنهاء الزيارة'
                            );
                        }
            }
        );
    }, [currentUser, getMedicalVisits]);

    const filteredVisits = useMemo(() => {
        if (!visits.length) return [];
        return visits.filter(visit => Moment(visit.visitDate).isSame(selectedDate, 'day'));
    }, [visits, selectedDate]);

    if (!isReady) {
        return (
            <SafeAreaView style={[styles.container, styles.loadingFullScreen]}>
                <StatusBar barStyle="light-content" backgroundColor="#2197dcc7" translucent={false} />
                <ActivityIndicator size="large" color="#39a5e4" />
            </SafeAreaView>
        );
    }

    const renderContent = () => {
        console.log('🔍 renderContent - التحقق من البيانات:');
        console.log('   - isLoading:', isLoading);
        console.log('   - visits.length:', visits.length);
        console.log('   - filteredVisits.length:', filteredVisits.length);
        console.log('   - selectedDate:', Moment(selectedDate).format('YYYY-MM-DD'));
        
        if (isLoading) {
            return <LoadingState />;
        }
        
        if (filteredVisits.length > 0) {
            console.log('✅ عرض الجدول - يوجد', filteredVisits.length, 'زيارة');
            return (
                <VisitsTable
                    visits={filteredVisits}
                    currentUser={currentUser}
                    t={t}
                    onDetailsPress={handleDetailsPress}
                    onEditPress={handleEditPress}
                    onEndVisit={handleEndVisit}
                />
            );
        }
        
        console.log('⚠️ عرض NoDataState - لا توجد زيارات لهذا اليوم');
        return <NoDataState t={t} />;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2197dcc7" translucent={false} />
            
            <MedicalReportHeader
                title={t('medicalReportScreen.headerTitle') || 'التقارير الطبية'}
                onBackPress={() => navigation.goBack()}
            />
            
            <DateSelector
                selectedDate={selectedDate}
                onPress={() => setDatePickerVisible(true)}
            />
            
            <LocationHeader
                areaName={currentArea}
                onEditPress={() => setLocationModalVisible(true)}
                t={t}
            />
        
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={false}
                onScroll={(event) => {
                    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
                    const currentScrollY = contentOffset.y;
                    
                    setScrollY(currentScrollY);
                    
                    setShowScrollToTop(currentScrollY > 300);
                    
                    const isNearBottom = layoutMeasurement.height + currentScrollY >= contentSize.height - 100;
                    
                    if (isNearBottom && hasMoreData && !isLoadingMore && visits.length > 0) {
                        console.log('🔄 تم الوصول للنهاية، بدء تحميل المزيد...');
                        loadMoreVisits();
                    }
                }}
                scrollEventThrottle={400}
            >
                {renderContent()}
                
                {isLoadingMore && (
                    <ActivityIndicator 
                        size="small" 
                        color="#183E9F" 
                        style={{ marginVertical: 20 }} 
                    />
                )}
                
                {!hasMoreData && visits.length > 0 && filteredVisits.length > 0 && (
                    <View style={styles.allVisitsDisplayedContainer}>
                        <Text style={styles.allVisitsDisplayedText}>
                            {t('medicalReportScreen.allVisitsDisplayed') || '✓ تم عرض جميع الزيارات'}
                        </Text>
                    </View>
                )}
            </ScrollView>

            {isTodaySelected && (
                <TouchableOpacity 
                    style={styles.addNewButton} 
                    onPress={() => setModalVisible(true)}
                >
                    <Feather name="plus" size={24} color="#FFF" />
                </TouchableOpacity>
            )}

            {showScrollToTop && (
                <TouchableOpacity
                    style={styles.scrollToTopButton}
                    onPress={scrollToTop}
                >
                    <AntDesign name="upcircleo" size={24} color="#FFF" />
                </TouchableOpacity>
            )}

            <DatePicker 
                modal 
                open={isDatePickerVisible} 
                date={selectedDate} 
                mode="date" 
                onConfirm={handleDateChange} 
                onCancel={() => setDatePickerVisible(false)} 
            />
            
            {currentUser?.role === 'sales' ? (
                <DailySalesaddModel
                    show={isModalVisible}
                    hide={() => setModalVisible(false)}
                    submit={handleAddNewVisit}
                    date={selectedDate}
                    area={{ area_id: currentAreaId }}
                    navigation={navigation}
                    onRefresh={() => getMedicalVisits(1, false)} // ✅ إضافة refresh للجدول
                />
            ) : (
                <DailyaddModel
                    show={isModalVisible}
                    hide={() => setModalVisible(false)}
                    onAddVisit={handleAddNewVisit}
                    existingDoctors={visits}
                    cityId={currentCityId}
                    areaId={currentAreaId}
                    selectedDate={selectedDate}
                    onRefresh={() => getMedicalVisits(1, false)} // ✅ إضافة refresh للجدول
                />
            )}

            <LocationModal
                visible={isLocationModalVisible}
                onClose={() => setLocationModalVisible(false)}
                citiesFormatted={citiesFormatted}
                areas={areas}
                selectedCity={selectedCity}
                selectedArea={selectedArea}
                currentArea={currentArea}
                locationsLoading={locationsLoading}
                onCityChange={handleCityChange}
                onAreaChange={setSelectedArea}
                onSave={handleSaveLocationWrapper}
                t={t}
            />
            
            <SkuModel
                show={showDetailsModal}
                hide={() => {
                    setShowDetailsModal(false);
                    setSelectedVisitData(null);
                }}
                data={selectedVisitData}
            />
            
            <SkueditModel
                show={showEditModal}
                hide={() => {
                    setShowEditModal(false);
                    setSelectedVisitData(null);
                }}
                data={selectedVisitData}
                reload={() => {
                    console.log('🔄 إعادة تحميل البيانات بعد التعديل');
                    getMedicalVisits(1, false);
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffffff'
    },
    loadingFullScreen: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContentContainer: {
        paddingTop: 10,
        paddingBottom: 100
    },
    addNewButton: {
        position: 'absolute',
        bottom: 40,
        right: 20,
        backgroundColor: '#183E9F',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 12,
        zIndex: 20,
    },
    scrollToTopButton: {
        position: 'absolute',
        bottom: 110,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#28A745',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        zIndex: 19,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    allVisitsDisplayedContainer: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingBottom: 40,
    },
    allVisitsDisplayedText: {
        fontSize: 14,
        color: '#28A745',
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default MedicalReportScreen;
