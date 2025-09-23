// FileName: screens/MedicalReportScreen.js

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    View, Text, TouchableOpacity, SafeAreaView, StyleSheet,
    ScrollView, Dimensions, ActivityIndicator, Animated, StatusBar, I18nManager
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Moment from 'moment';
import DatePicker from 'react-native-date-picker';
import { BlurView } from '@react-native-community/blur';
import { useTranslation } from 'react-i18next';

// --- استيراد المودال الجديد ---
import AddVisit from '../../components/AddVisit'; // تأكد من أن المسار صحيح

// --- Mock Data ---
const FAKE_VISITS_DATA = [
    { id: 1, doctorName: 'Dr. Ali Hassan Al-Jubouri', specialty: 'Cardiologist', appointmentTime: '10:30 AM', lastVisit: '2025-08-15', status: 'Visited', visitDate: '2025-09-12' },
    { id: 2, doctorName: 'Dr. Fatima Ahmed', specialty: 'Pediatrician', appointmentTime: '11:00 AM', lastVisit: '2025-08-20', status: 'Visited', visitDate: '2025-09-12' },
    { id: 3, doctorName: 'Dr. Omar Khalid', specialty: 'Dermatologist', appointmentTime: '01:45 PM', lastVisit: '2025-07-30', status: 'Pending', visitDate: '2025-09-12' },
];

const { width } = Dimensions.get('window');

// --- Animation Components ---
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

const Stars = () => (
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
);

// --- Main Screen Component ---
const MonthlyPlanSales = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const isRTL = I18nManager.isRTL;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [visits, setVisits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [rowHeights, setRowHeights] = useState({});
    const [isModalVisible, setModalVisible] = useState(false); // حالة المودال

    const isTodaySelected = Moment(selectedDate).isSame(new Date(), 'day');

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setVisits(FAKE_VISITS_DATA);
            setIsLoading(false);
        }, 1000);
    }, []);

    const filteredVisits = useMemo(() => {
        return visits.filter(visit => Moment(visit.visitDate).isSame(selectedDate, 'day'));
    }, [visits, selectedDate]);

    const handleDateChange = (date) => {
        setDatePickerVisible(false);
        setSelectedDate(date);
        setRowHeights({});
    };

    const handleRowLayout = (event, index) => {
        const { height } = event.nativeEvent.layout;
        if (height > 0 && (!rowHeights[index] || Math.abs(rowHeights[index] - height) > 1)) {
            setRowHeights(prev => ({ ...prev, [index]: height }));
        }
    };

    // --- دالة إضافة الزيارة الجديدة ---
    const handleAddNewVisit = (newVisitData) => {
        setVisits(prevVisits => [newVisitData, ...prevVisits]);
        setModalVisible(false);
    };


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#39a5e4" />
            <ScrollView
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={false}
            >
                {isLoading ? (
                    <ActivityIndicator size="large" color="#39a5e4" style={{ marginTop: 50 }} />
                ) : filteredVisits.length > 0 ? (
                    <View style={styles.tableContainer}>
                        <View style={styles.tableWrapper}>
                    
                            <View style={styles.fixedColumn}>
                                <View style={styles.fixedHeaderCell}>
                                    <Text style={[styles.fixedHeaderText, isRTL && styles.rtlText]}>{t('monthlyPlanSales.name')}</Text>
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
                                        <View style={styles.scrollableHeaderCell}><Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>{t('monthlyPlanSales.specialty')}</Text></View>
                                        <View style={styles.scrollableHeaderCell}><Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>{t('monthlyPlanSales.time')}</Text></View>
                                        <View style={styles.scrollableHeaderCell}><Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>{t('monthlyPlanSales.lastVisit')}</Text></View>
                                        <View style={styles.scrollableHeaderCell}><Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>{t('monthlyPlanSales.status')}</Text></View>
                                    </View>
                                    {filteredVisits.map((item, index) => (
                                        <View key={item.id} style={[styles.scrollableRow, index % 2 === 1 ? styles.oddRow : styles.evenRow, { height: rowHeights[index] }]}>
                                            <View style={styles.scrollableCell}><Text style={styles.scrollableCellText}>{item.specialty}</Text></View>
                                            <View style={styles.scrollableCell}><Text style={styles.scrollableCellText}>{item.appointmentTime}</Text></View>
                                            <View style={styles.scrollableCell}><Text style={styles.scrollableCellText}>{item.lastVisit}</Text></View>
                                            <View style={styles.scrollableCell}>
                                                <View style={[styles.statusBadge, item.status === 'Visited' ? styles.statusVisited : styles.statusPending]}>
                                                    <Text style={styles.statusTitle}>
                                                        {item.status === 'Visited' ? t('monthlyPlanSales.visited') : t('monthlyPlanSales.pending')}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                ) : (
                    <View style={styles.noDataContainer}>
                        <Feather name="info" size={40} color="#A0AEC0" />
                        <Text style={[styles.noDataText, isRTL && styles.rtlText]}>{t('monthlyPlanSales.noVisits')}</Text>
                    </View>
                )}
            </ScrollView>

            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <BlurView style={styles.blurView} blurType="light" blurAmount={5} />
                    <View style={styles.overlay} />
                    <Stars />
                    <View style={styles.headerContent}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Feather name={I18nManager.isRTL ? "chevron-right" : "chevron-left"} size={28} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{t('monthlyPlanSales.headerTitle')}</Text>
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

            {/* --- زر الإضافة العائم --- */}
            {isTodaySelected && (
                <TouchableOpacity style={styles.addNewButton} onPress={() => setModalVisible(true)}>
                    <Feather name="plus" size={24} color="#FFF" />
                </TouchableOpacity>
            )}

            {/* --- المودالات --- */}
            <DatePicker modal open={isDatePickerVisible} date={selectedDate} mode="date" onConfirm={handleDateChange} onCancel={() => setDatePickerVisible(false)} />
            
            <AddVisit
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleAddNewVisit}
                existingDoctors={FAKE_VISITS_DATA}
            />
        </SafeAreaView>
    );
};

// --- Styles ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffffff' },
    
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
        position: 'absolute', bottom: 30, right: 20, backgroundColor: '#45adf3ff',
        width: 60, height: 60, borderRadius: 30, justifyContent: 'center',
        alignItems: 'center', elevation: 12, zIndex: 20,
    },

    tableContainer: { marginHorizontal: 20 },
    tableWrapper: { flexDirection: 'row',  overflow: 'hidden' ,borderRadius:2},
    
    fixedColumn: { width: width * 0.28, borderRightWidth: 1, borderRightColor: '#E2E8F0' },
    fixedHeaderCell: { backgroundColor: '#45adf394', padding: 15, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
    fixedHeaderText: { fontSize: 14, fontWeight: 'bold', color: '#050708ff', textAlign: 'center' },
    fixedCell: { padding: 15, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#EDF2F7' },
    fixedCellText: { fontSize: 14, color: '#050708ff', textAlign: 'center',},

    scrollableHeaderRow: { flexDirection: 'row', backgroundColor: '#45adf394',padding: 2, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
    scrollableHeaderCell: { width: width * 0.28, padding: 15, justifyContent: 'center', alignItems: 'center' },
    scrollableHeaderText: { fontSize: 12, fontWeight: 'bold', color: '#050708ff', textAlign: 'center' },
    
    scrollableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#EDF2F7' },
    scrollableCell: { width: width * 0.28, padding: 15, justifyContent: 'center', alignItems: 'center' },
    scrollableCellText: { fontSize: 12, color: '#050708ff', textAlign: 'center' },
    
    evenRow: { backgroundColor: '#FFFFFF' },
    oddRow: { backgroundColor: '#F7FAFC' },
    
    statusBadge: { borderRadius: 6, paddingHorizontal: 6, justifyContent: 'center', alignItems: 'center' },
    statusVisited: { backgroundColor: '#38A169' },
    statusPending: { backgroundColor: '#DD6B20' , paddingHorizontal:4, justifyContent:'center', alignItems:'center' },
    statusTitle:{ borderRadius:12, paddingHorizontal:6, justifyContent:'center', alignItems:'center',color:'#fff',fontSize:12 , paddingVertical:6},
    rtlText: {
        textAlign: 'right',
        writingDirection: 'rtl',
    },
});

export default MonthlyPlanSales;
