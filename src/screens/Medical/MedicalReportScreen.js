import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
    View, Text, TouchableOpacity, SafeAreaView, StyleSheet,
    ScrollView, Dimensions, ActivityIndicator, Animated, StatusBar, I18nManager,
    InteractionManager, Modal
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Moment from 'moment';
import DatePicker from 'react-native-date-picker';
import { BlurView } from '@react-native-community/blur';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { post, get } from '../../WebService/RequestBuilder';
import Constants from '../../config/globalConstants';
import { Dropdown } from 'react-native-element-dropdown';

import DailyaddModel from '../../components/Modals/DailyaddModel';

const FAKE_VISITS_DATA = [
    { id: 1, doctorName: 'Dr. Ali Hassan Al-Jubouri', specialty: 'Cardiologist', appointmentTime: '10:30 AM', lastVisit: '2025-08-15', status: 'Visited', visitDate: '2025-09-12' },
    { id: 2, doctorName: 'Dr. Fatima Ahmed', specialty: 'Pediatrician', appointmentTime: '11:00 AM', lastVisit: '2025-08-20', status: 'Visited', visitDate: '2025-09-12' },
    { id: 3, doctorName: 'Dr. Omar Khalid', specialty: 'Dermatologist', appointmentTime: '01:45 PM', lastVisit: '2025-07-30', status: 'Pending', visitDate: '2025-09-12' },
];

const Star = ({ size, position, duration }) => {
    const opacityAnim = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacityAnim, { toValue: 1, duration: duration * 0.5, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 0, duration: duration * 0.5, useNativeDriver: true }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [duration, opacityAnim]);
    
    return <Animated.View style={[styles.star, { width: size, height: size, left: position.x, top: position.y, opacity: opacityAnim }]} />;
};

const Stars = React.memo(() => (
    <>
        {[
            { size: 2, position: { x: "15%", y: "20%" }, duration: 2000 },
            { size: 1, position: { x: "25%", y: "60%" }, duration: 3000 },
            { size: 2, position: { x: "80%", y: "30%" }, duration: 2500 },
            { size: 1.5, position: { x: "90%", y: "75%" }, duration: 1800 },
        ].map((star, index) => (
            <Star key={index} {...star} />
        ))}
    </>
));

const MedicalReportScreen = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const isRTL = I18nManager.isRTL;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [visits, setVisits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [rowHeights, setRowHeights] = useState({});
    const [isModalVisible, setModalVisible] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));
    const [currentCity, setCurrentCity] = useState("");
    const [currentArea, setCurrentArea] = useState("");
    const [isLocationModalVisible, setLocationModalVisible] = useState(false);
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);
    const [allAreas, setAllAreas] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedArea, setSelectedArea] = useState(null);
    const [weeklyscdata, setWeeklyscdata] = useState([]);

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
                        
                        setTimeout(() => {
                            if (isActive) {
                                setVisits(FAKE_VISITS_DATA);
                                setIsLoading(false);
                            }
                        }, 300);
                    }
                } catch (error) {
                    console.log('Error initializing screen:', error);
                    if (isActive) {
                        setIsReady(true);
                        setIsLoading(false);
                    }
                }
            };

            initializeScreen();

            return () => {
                isActive = false;
            };
        }, [i18n])
    );

    const submitedit = async (data) => {
        const body = {
            user_id: user.id,
            city_id: data.city,
            area_id: data.area,
            date: Moment(selectedDate).format('yyyy-MM-DD')
        }
         const res = await post(Constants.plans.get_plans, body, null)
      
            .then((res) => {
                console.log('=====================================================res', res);
                // تحديث المنطقة والمدينة المحلية
                setCurrentCity(data.cityName);
                setCurrentArea(data.areaName);
                setLocationModalVisible(false);
                // إعادة تحميل البيانات لتحديث الواجهة
                getdata();
            }).catch((err) => {
                console.log('Error updating location:', err);
            }).finally(() => { })
    };

    // دالة لجلب البيانات
    const getdata = async () => {
        setIsLoading(true);
        await get(Constants.plans.get_plans, null, { 
            user_id: user.id, 
            date: Moment(selectedDate).format('yyyy-MM-DD') 
        })
            .then((res) => {
                console.log('📊 استجابة API:', res);
                setWeeklyscdata(res.data || []);
                
                // تحديث المنطقة الحالية من البيانات المحفوظة
                const matchingData = res.data?.find(data => 
                    Moment(data.date).isSame(selectedDate, 'day')
                );
                
                if (matchingData && matchingData.area) {
                    setCurrentArea(matchingData.area);
                    console.log('📍 المنطقة الحالية:', matchingData.area);
                } else {
                    setCurrentArea("");
                    console.log('⚠️ لا توجد منطقة محفوظة لهذا التاريخ');
                }
            })
            .catch((err) => {
                console.error('❌ خطأ في جلب البيانات:', err);
                setCurrentArea("");
            })
            .finally(() => {
                setIsLoading(false);
            })
    };

    // دالة لجلب بيانات الزيارات الطبية
    const getMedicalVisits = async () => {
        try {
            console.log('🏥 جلب بيانات الزيارات الطبية...');
            const response = await get(Constants.visit.medical, null, {
                medical_id: user.id,
                date: Moment(selectedDate).format('yyyy-MM-DD')
            });
            
            console.log('🏥 استجابة API الزيارات الطبية:');
            console.log('📋========================= البيانات الكاملة:', response);
            console.log('📊 البيانات (res.data):', response.data);
            console.log('📈 عدد الزيارات:', response.data?.length || 0);
            
            if (response.data && Array.isArray(response.data)) {
                console.log('🔍 تفاصيل كل زيارة:');
                response.data.forEach((visit, index) => {
                    console.log(`📝 زيارة ${index + 1}:`, {
                        id: visit.id,
                        doctorName: visit.doctorName,
                        specialty: visit.specialty,
                        status: visit.status,
                        start_visit: visit.start_visit,
                        end_visit: visit.end_visit,
                        area: visit.area,
                        city: visit.city,
                        area_id: visit.area_id,
                        city_id: visit.city_id
                    });
                });
            } else {
                console.log('⚠️ لا توجد بيانات زيارات أو البيانات ليست array');
            }
            
            return response;
        } catch (error) {
            console.error('❌ خطأ في جلب الزيارات الطبية:', error);
            return null;
        }
    };

    // دالة لجلب المدن والمناطق
    const loadCitiesAndAreas = async () => {
        try {
            const response = await get(`${Constants.users.cityArea}${user.id}`);
            const cityArea = response.data || response;
            
            if (cityArea.cities && Array.isArray(cityArea.cities)) {
                const cityArray = cityArea.cities.map(c => ({
                    value: c.id,
                    label: c.name
                }));
                setCities(cityArray);
            }
            
            if (cityArea.areas && Array.isArray(cityArea.areas)) {
                const areaArray = cityArea.areas.map(a => ({
                    value: a.id,
                    label: a.name,
                    city_id: a.city_id
                }));
                setAllAreas(areaArray);
            }
        } catch (error) {
            console.error('Error loading cities and areas:', error);
        }
    };

    // دالة لتحديث المناطق عند اختيار المدينة
    const handleCityChange = (cityId) => {
        setSelectedCity(cityId);
        setSelectedArea(null);
        const filteredAreas = allAreas.filter(area => area.city_id == cityId);
        setAreas(filteredAreas);
    };

    // دالة لحفظ التحديد
    const handleSaveLocation = () => {
        if (selectedCity && selectedArea) {
            const cityName = cities.find(c => c.value === selectedCity)?.label;
            const areaName = areas.find(a => a.value === selectedArea)?.label;
            
            console.log('💾 حفظ المنطقة الجديدة:', areaName);
            
            // حفظ في API
            submitedit({
                city: selectedCity,
                area: selectedArea,
                cityName: cityName,
                areaName: areaName
            });
        }
    };

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setScreenDimensions(window);
        });

        return () => subscription?.remove();
    }, []);

    // تحميل البيانات عند تحميل الصفحة
    useEffect(() => {
        if (user?.id) {
            getdata();
            // جلب بيانات الزيارات الطبية لطباعة الـ structure
            getMedicalVisits();
        }
    }, [user?.id, selectedDate]);

    // تحميل المدن والمناطق عند فتح المودال
    useEffect(() => {
        if (isLocationModalVisible) {
            loadCitiesAndAreas();
        }
    }, [isLocationModalVisible]);

    // تحديث الواجهة عند تغيير البيانات
    useEffect(() => {
        console.log('🔄 تم تحديث weeklyscdata:', weeklyscdata);
        // إعادة تحميل البيانات لتحديث الواجهة
        if (weeklyscdata.length > 0) {
            // البحث عن البيانات المطابقة للتاريخ الحالي
            const matchingData = weeklyscdata.find(data => 
                Moment(data.date).isSame(selectedDate, 'day')
            );
            
            if (matchingData && matchingData.area) {
                console.log('📍 تم العثور على منطقة جديدة:', matchingData.area);
            }
        }
    }, [weeklyscdata, selectedDate]);

    const filteredVisits = useMemo(() => {
        if (!visits.length) return [];
        return visits.filter(visit => Moment(visit.visitDate).isSame(selectedDate, 'day'));
    }, [visits, selectedDate]);

    const handleDateChange = useCallback((date) => {
        setDatePickerVisible(false);
        setSelectedDate(date);
        setRowHeights({});
    }, []);

    const handleRowLayout = useCallback((event, index) => {
        const { height } = event.nativeEvent.layout;
        if (height > 0 && (!rowHeights[index] || Math.abs(rowHeights[index] - height) > 1)) {
            setRowHeights(prev => ({ ...prev, [index]: height }));
        }
    }, [rowHeights]);

    const handleAddNewVisit = useCallback((newVisitData) => {
        setVisits(prevVisits => [newVisitData, ...prevVisits]);
        setModalVisible(false);
    }, []);

    if (!isReady) {
        return (
            <SafeAreaView style={[styles.container, styles.loadingFullScreen]}>
                <StatusBar barStyle="light-content" backgroundColor="#39a5e4" />
                <ActivityIndicator size="large" color="#39a5e4" />
                <Text style={styles.loadingText}>جاري التحميل...</Text>
            </SafeAreaView>
        );
    }

    const renderContent = () => {
        if (isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <View style={styles.loadingHeader}>
                        <View style={[styles.loadingTitle, isRTL && styles.rtlLoadingText]} />
                        <View style={[styles.loadingDateButton, isRTL && styles.rtlLoadingText]} />
                    </View>
                    
                    <View style={styles.loadingTableContainer}>
                        <View style={styles.loadingTableWrapper}>
                            <View style={styles.loadingFixedColumn}>
                                <View style={styles.loadingFixedHeaderCell}>
                                    <View style={[styles.loadingHeaderText, isRTL && styles.rtlLoadingText]} />
                                </View>
                                {[1, 2, 3].map((index) => (
                                    <View key={index} style={[styles.loadingFixedCell, index % 2 === 1 ? styles.loadingOddRow : styles.loadingEvenRow]}>
                                        <View style={[styles.loadingCellText, isRTL && styles.rtlLoadingText]} />
                                    </View>
                                ))}
                            </View>
                            
                            <View style={styles.loadingScrollableContainer}>
                                <View style={styles.loadingScrollableHeaderRow}>
                                    {[1, 2, 3, 4].map((index) => (
                                        <View key={index} style={styles.loadingScrollableHeaderCell}>
                                            <View style={[styles.loadingHeaderText, isRTL && styles.rtlLoadingText]} />
                                        </View>
                                    ))}
                                </View>
                                {[1, 2, 3].map((rowIndex) => (
                                    <View key={rowIndex} style={[styles.loadingScrollableRow, rowIndex % 2 === 1 ? styles.loadingOddRow : styles.loadingEvenRow]}>
                                        {[1, 2, 3, 4].map((cellIndex) => (
                                            <View key={cellIndex} style={styles.loadingScrollableCell}>
                                                {cellIndex === 4 ? (
                                                    <View style={[styles.loadingStatusBadge, isRTL && styles.rtlLoadingText]} />
                                                ) : (
                                                    <View style={[styles.loadingCellText, isRTL && styles.rtlLoadingText]} />
                                                )}
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                    
                    <View style={styles.loadingAddButton}>
                        <View style={[styles.loadingButtonText, isRTL && styles.rtlLoadingText]} />
                    </View>
                </View>
            );
        }
        
        if (filteredVisits.length > 0) {
            return (
                <View style={styles.tableContainer}>
                    <View style={styles.tableWrapper}>
                        <View style={[styles.fixedColumn, { width: screenDimensions.width * 0.28 }]}>
                            <View style={styles.fixedHeaderCell}>
                                <Text style={[styles.fixedHeaderText, isRTL && styles.rtlText]}>
                                    {t('medicalReportScreen.name') || 'الاسم'}
                                </Text>
                            </View>
                            {filteredVisits.map((item, index) => (
                                <View
                                    key={item.id}
                                    style={[styles.fixedCell, index % 2 === 1 ? styles.oddRow : styles.evenRow, { height: rowHeights[index] }]}
                                    onLayout={(e) => handleRowLayout(e, index)}
                                >
                                    <Text style={styles.fixedCellText} numberOfLines={3}>{item.doctorName}</Text>
                                </View>
                            ))}
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View>
                                <View style={styles.scrollableHeaderRow}>
                                    <View style={[styles.scrollableHeaderCell, { width: screenDimensions.width * 0.28 }]}>
                                        <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                                            {t('medicalReportScreen.specialty') || 'التخصص'}
                                        </Text>
                                    </View>
                                    <View style={[styles.scrollableHeaderCell, { width: screenDimensions.width * 0.28 }]}>
                                        <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                                            {t('medicalReportScreen.time') || 'الوقت'}
                                        </Text>
                                    </View>
                                    <View style={[styles.scrollableHeaderCell, { width: screenDimensions.width * 0.28 }]}>
                                        <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                                            {t('medicalReportScreen.lastVisit') || 'آخر زيارة'}
                                        </Text>
                                    </View>
                                    <View style={[styles.scrollableHeaderCell, { width: screenDimensions.width * 0.28 }]}>
                                        <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                                            {t('medicalReportScreen.status') || 'الحالة'}
                                        </Text>
                                    </View>
                                </View>
                                {filteredVisits.map((item, index) => (
                                    <View key={item.id} style={[styles.scrollableRow, index % 2 === 1 ? styles.oddRow : styles.evenRow, { height: rowHeights[index] }]}>
                                        <View style={[styles.scrollableCell, { width: screenDimensions.width * 0.28 }]}>
                                            <Text style={styles.scrollableCellText}>{item.specialty}</Text>
                                        </View>
                                        <View style={[styles.scrollableCell, { width: screenDimensions.width * 0.28 }]}>
                                            <Text style={styles.scrollableCellText}>{item.appointmentTime}</Text>
                                        </View>
                                        <View style={[styles.scrollableCell, { width: screenDimensions.width * 0.28 }]}>
                                            <Text style={styles.scrollableCellText}>{item.lastVisit}</Text>
                                        </View>
                                        <View style={[styles.scrollableCell, { width: screenDimensions.width * 0.28 }]}>
                                            <View style={[styles.statusBadge, item.status === 'Visited' ? styles.statusVisited : styles.statusPending]}>
                                                <Text style={styles.statusTitle}>
                                                    {item.status === 'Visited' ? 
                                                        (t('medicalReportScreen.visited') || 'تم') : 
                                                        (t('medicalReportScreen.pending') || 'في الانتظار')
                                                    }
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            );
        }
        
        return (
            
            <View style={styles.noDataContainer}>
                <Feather name="info" size={40} color="#A0AEC0" />
                <Text style={[styles.noDataText, isRTL && styles.rtlText]}>
                    {t('medicalReportScreen.noVisits') || 'لا توجد زيارات'}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#39a5e4" />
            <View style={styles.headerConentArea}>
                <View style={styles.locationContainer}>
                    <View style={styles.locationInfo}>
                        <Text style={styles.locationLabel}>المنطقة الحالية:</Text>
                        {(() => {
                            // البحث عن البيانات المطابقة للتاريخ
                            const matchingData = weeklyscdata.find(data => 
                                Moment(data.date).isSame(selectedDate, 'day')
                            );
                            const areaName = matchingData ? matchingData.area : null;
                            
                            return areaName ? (
                                <View style={styles.locationDetails}>
                                    <Text style={styles.areaText}>{areaName}</Text>
                                </View>
                            ) : (
                                <Text style={styles.noLocationText}>لم يتم تحديد منطقة بعد لهذا اليوم</Text>
                            );
                        })()}
                    </View>
                    <TouchableOpacity 
                        style={styles.editButton}
                        onPress={() => {
                            console.log('تم الضغط على زر التعديل');
                            setLocationModalVisible(true);
                        }}
                    >
                        <Feather name="edit-3" size={16} color="#183E9F" />
                        <Text style={styles.editButtonText}>تعديل</Text>
                    </TouchableOpacity>
                </View>
            </View>
        
            <ScrollView
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={false}
            >
                {renderContent()}
            </ScrollView>

            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <BlurView style={styles.blurView} blurType="light" blurAmount={5} />
                    <View style={styles.overlay} />
                    <Stars />
                    <View style={styles.headerContent}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                             <Feather name={isRTL ? "chevron-right" : "chevron-left"} size={28} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>
                            {t('medicalReportScreen.headerTitle') || 'التقارير الطبية'}
                        </Text>
                        <View style={{ width: 40 }} />
                    </View>
                </View>
                <View style={styles.dateCardWrapper}>
                    <View style={styles.dateCard}>
                        <TouchableOpacity style={styles.dateSelector} onPress={() => setDatePickerVisible(true)}>
                            <Feather name="calendar" size={24} color="#4A5568" />
                            <Text style={styles.dateSelectorText}>{Moment(selectedDate).format('dddd, MMMM Do, YYYY')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {isTodaySelected && (
                <TouchableOpacity style={styles.addNewButton} onPress={() => setModalVisible(true)}>
                    <Feather name="plus" size={24} color="#FFF" />
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
            
            <DailyaddModel
                show={isModalVisible}
                hide={() => setModalVisible(false)}
                
                existingDoctors={FAKE_VISITS_DATA}
            />

            {/* مودال اختيار المنطقة والمدينة */}
            <Modal
                visible={isLocationModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setLocationModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>اختيار المنطقة والمدينة</Text>
                            <TouchableOpacity 
                                onPress={() => setLocationModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <Feather name="x" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.modalBody}>
                            {/* اختيار المدينة */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>المدينة</Text>
                                <Dropdown
                                    style={styles.dropdown}
                                    data={cities}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="اختر المدينة"
                                    value={selectedCity}
                                    onChange={item => handleCityChange(item.value)}
                                />
                            </View>

                            {/* اختيار المنطقة */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>المنطقة</Text>
                                <Dropdown
                                    style={styles.dropdown}
                                    data={areas}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={selectedCity ? "اختر المنطقة" : "اختر المدينة أولاً"}
                                    value={selectedArea}
                                    onChange={item => setSelectedArea(item.value)}
                                    disable={!selectedCity}
                                />
                            </View>
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity 
                                style={styles.cancelButton}
                                onPress={() => setLocationModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>إلغاء</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[styles.saveButton, (!selectedCity || !selectedArea) && styles.disabledButton]}
                                onPress={handleSaveLocation}
                                disabled={!selectedCity || !selectedArea}
                            >
                                <Text style={styles.saveButtonText}>حفظ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

// Styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffffff' },
    
    loadingFullScreen: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#39a5e4',
        fontWeight: '500',
    },
    
    headerContainer: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
    header: {
        height: 120, borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
        overflow: 'hidden', 
    },
    blurView: { ...StyleSheet.absoluteFillObject },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#39a5e4c7' },
    star: { position: 'absolute', backgroundColor: 'white', borderRadius: 5, shadowColor: '#fff', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 5 },
    headerContent: { zIndex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, marginTop: 20 },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 },
    
    dateCardWrapper: { paddingHorizontal: 20, marginTop: -40 },
    dateCard: {
        backgroundColor: 'white', borderRadius: 16, padding: 20,
        elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1, shadowRadius: 12,
    },
    dateSelector: { flexDirection: 'row', alignItems: 'center' },
    dateSelectorText: { fontSize: 18, fontWeight: '600', color: '#2D3748', marginLeft: 15 },

    scrollContentContainer: { paddingTop: 160, paddingBottom: 100 },
    
    noDataContainer: { alignItems: 'center', paddingTop: 80 },
    noDataText: { marginTop: 15, fontSize: 16, color: '#718096' },

    addNewButton: {
        position: 'absolute', bottom: 30, right: 20, backgroundColor: '#183E9F',
        width: 60, height: 60, borderRadius: 30, justifyContent: 'center',
        alignItems: 'center', elevation: 12, zIndex: 20,
    },

    tableContainer: { marginHorizontal: 20 },
    tableWrapper: { flexDirection: 'row', overflow: 'hidden', borderRadius: 2 },
    
    fixedColumn: { borderRightWidth: 1, borderRightColor: '#E2E8F0' },
    fixedHeaderCell: { backgroundColor: '#45adf394', padding: 15, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
    fixedHeaderText: { fontSize: 14, fontWeight: 'bold', color: '#050708ff', textAlign: 'center' },
    fixedCell: { padding: 15, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#EDF2F7' },
    fixedCellText: { fontSize: 14, color: '#050708ff', textAlign: 'center' },

    scrollableHeaderRow: { flexDirection: 'row', backgroundColor: '#45adf394', padding: 2, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
    scrollableHeaderCell: { padding: 15, justifyContent: 'center', alignItems: 'center' },
    scrollableHeaderText: { fontSize: 12, fontWeight: 'bold', color: '#050708ff', textAlign: 'center' },
    
    scrollableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#EDF2F7' },
    scrollableCell: { padding: 15, justifyContent: 'center', alignItems: 'center' },
    scrollableCellText: { fontSize: 12, color: '#050708ff', textAlign: 'center' },
    
    evenRow: { backgroundColor: '#FFFFFF' },
    oddRow: { backgroundColor: '#F7FAFC' },
    
    statusBadge: { borderRadius: 6, paddingHorizontal: 6, justifyContent: 'center', alignItems: 'center' },
    statusVisited: { backgroundColor: '#38A169' },
    statusPending: { backgroundColor: '#DD6B20', paddingHorizontal: 4, justifyContent: 'center', alignItems: 'center' },
    statusTitle: { borderRadius: 12, paddingHorizontal: 6, justifyContent: 'center', alignItems: 'center', color: '#fff', fontSize: 12, paddingVertical: 6 },
    rtlText: {
        textAlign: 'right',
        writingDirection: 'rtl',
    },
    loadingContainer: {
        paddingHorizontal: 20,
    },
    loadingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    loadingTitle: {
        width: 200,
        height: 24,
        backgroundColor: '#E5E5EA',
        borderRadius: 12,
    },
    loadingDateButton: {
        width: 120,
        height: 40,
        backgroundColor: '#E5E5EA',
        borderRadius: 8,
    },
    loadingTableContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 20,
    },
    loadingTableWrapper: {
        flexDirection: 'row',
    },
    loadingFixedColumn: {
        width: '40%',
        borderRightWidth: 1,
        borderRightColor: '#EDF2F7',
    },
    loadingFixedHeaderCell: {
        backgroundColor: '#F7FAFC',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EDF2F7',
    },
    loadingFixedCell: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EDF2F7',
        minHeight: 60,
    },
    loadingScrollableContainer: {
        flex: 1,
    },
    loadingScrollableHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#F7FAFC',
        borderBottomWidth: 1,
        borderBottomColor: '#EDF2F7',
    },
    loadingScrollableHeaderCell: {
        flex: 1,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingScrollableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#EDF2F7',
        minHeight: 60,
    },
    loadingScrollableCell: {
        flex: 1,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingHeaderText: {
        width: 80,
        height: 16,
        backgroundColor: '#E5E5EA',
        borderRadius: 8,
    },
    loadingCellText: {
        width: 60,
        height: 12,
        backgroundColor: '#E5E5EA',
        borderRadius: 6,
    },
    loadingStatusBadge: {
        width: 50,
        height: 20,
        backgroundColor: '#E5E5EA',
        borderRadius: 10,
    },
    loadingOddRow: {
        backgroundColor: '#F7FAFC',
    },
    loadingEvenRow: {
        backgroundColor: '#FFFFFF',
    },
    loadingAddButton: {
        backgroundColor: '#39a5e4',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    loadingButtonText: {
        width: 100,
        height: 16,
        backgroundColor: '#E5E5EA',
        borderRadius: 8,
    },
    rtlLoadingText: {
        alignSelf: 'flex-end',
    },
    headerConent: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        marginBottom: 5,
    },
    headerConentArea:{
marginTop:140,
backgroundColor:'#FFFFFF',
paddingHorizontal:15,
paddingVertical:15,
borderBottomWidth:1,
borderBottomColor:'#EEE',
marginBottom:5,
flexDirection:'row',
alignItems:'center',
justifyContent:'space-between',
borderBottomWidth:1,
borderBottomColor:'#EEE',
marginBottom:5,
flexDirection:'row',
alignItems:'center',
justifyContent:'space-between',

    },
    locationContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    locationInfo: {
        flex: 1,
    },
    locationLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    locationDetails: {
        flexDirection: 'column',
    },
    cityText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#183E9F',
        marginBottom: 2,
        textAlign:'right',
    },
    areaText: {
        fontSize: 14,
        color: '#333',

    },
    noLocationText: {
        fontSize: 14,
        color: '#999',
        marginHorizontal:2,
   
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#183E9F',
    },
    editButtonText: {
        fontSize: 14,
        color: '#183E9F',
        marginLeft: 5,
        fontWeight: '500',
    },
    // أنماط المودال
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        width: '90%',
        maxHeight: '80%',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#183E9F',
    },
    closeButton: {
        padding: 5,
    },
    modalBody: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    dropdown: {
        height: 50,
        borderColor: '#183E9F',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#FFFFFF',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },
    cancelButton: {
        flex: 1,
        marginRight: 10,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#CCC',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    saveButton: {
        flex: 1,
        marginLeft: 10,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#183E9F',
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    disabledButton: {
        backgroundColor: '#CCC',
    },
});

export default MedicalReportScreen;