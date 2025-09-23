import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
	View,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	ScrollView,
	Dimensions,
	I18nManager,
    Alert,
    ActivityIndicator,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Feather from "react-native-vector-icons/Feather";
import DatePicker from 'react-native-date-picker';
import AddVisiteModel from '../components/AddVisiteModel';
import { useTranslation } from 'react-i18next';
import GoBack from '../components/GoBack';
// --- Mock Components ---
// const GoBack = ({ text }) => <View style={styles.header}><Text style={styles.headerText}>{text}</Text></View>;

// --- FAKE DATA (with long names to test) ---
const FAKE_CITIES = [{ label: "Baghdad", value: 1 }, { label: "Basra", value: 2 }];
const FAKE_AREAS = [
    { label: "Karrada", value: 101, city_id: 1 },
    { label: "Mansour", value: 102, city_id: 1 },
    { label: "Al-Ashar", value: 201, city_id: 2 },
];
let FAKE_REPORT_DATA = [
    { id: 1, doctor_name: "Dr. Ali Hassan Al-Jubouri The Third", area_name: "Karrada", city_id: 1, target_visits: 10, actual_visits: 8, visit_date: "2025-09-10" },
    { id: 2, doctor_name: "Dr. Fatima Ahmed", area_name: "Mansour", city_id: 1, target_visits: 8, actual_visits: 8, visit_date: "2025-09-11" },
    { id: 3, doctor_name: "Dr. Omar Khalid Al-Tikriti", area_name: "Al-Ashar", city_id: 2, target_visits: 12, actual_visits: 9, visit_date: "2025-09-12" },
    { id: 4, doctor_name: "Dr. Layla Ghasan", area_name: "Karrada", city_id: 1, target_visits: 15, actual_visits: 15, visit_date: "2025-09-12" },
    { id: 5, doctor_name: "Prof. Dr. Mohammed Salah Al-Din", area_name: "Mansour", city_id: 1, target_visits: 9, actual_visits: 3, visit_date: "2025-09-09" },
];

const { width } = Dimensions.get('window');
const DEFAULT_ROW_HEIGHT = 60; // ارتفاع افتراضي للصف

const FrequencyReport = ({ navigation }) => {
	const { t } = useTranslation();
	const isRTL = I18nManager.isRTL;
	const [allReports, setAllReports] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);
    const [allAreas, setAllAreas] = useState([]);
    const [rowHeights, setRowHeights] = useState({});

    const [filters, setFilters] = useState({ city_id: null, area_id: null, dateFrom: null, dateTo: null });
    const [dateFrom, setDateFrom] = useState(new Date());
    const [openDateFrom, setOpenDateFrom] = useState(false);
    const [dateTo, setDateTo] = useState(new Date());
    const [openDateTo, setOpenDateTo] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [visitedToday, setVisitedToday] = useState([]);

	const fetchData = useCallback(() => {
		setIsLoading(true);
		setTimeout(() => {
            setCities(FAKE_CITIES);
            setAllAreas(FAKE_AREAS);
			setAllReports([...FAKE_REPORT_DATA]);
			setIsLoading(false);
		}, 1000);
	}, []);

	useEffect(() => { fetchData(); }, [fetchData]);

    const handleFilterChange = useCallback((key, value) => {
		setFilters(prev => {
			const newFilters = { ...prev, [key]: value };
			if (key === 'city_id') {
				newFilters.area_id = null;
				setAreas(allAreas.filter(area => area.city_id == value));
			}
			return newFilters;
		});
	}, [allAreas]);

    const filteredReports = useMemo(() => {
		if (isLoading) return [];
		return allReports.filter(item => {
            const cityFilterMatch = !filters.city_id || item.city_id === filters.city_id;
			const areaFilterMatch = !filters.area_id || FAKE_AREAS.find(a => a.value === filters.area_id)?.label === item.area_name;
            const dateFromMatch = !filters.dateFrom || new Date(item.visit_date) >= new Date(filters.dateFrom);
            const dateToMatch = !filters.dateTo || new Date(item.visit_date) <= new Date(filters.dateTo);
            return cityFilterMatch && areaFilterMatch && dateFromMatch && dateToMatch;
		});
	}, [allReports, filters, isLoading]);

    const handleLogVisit = (doctorId) => {
        const updatedReports = allReports.map(report => {
            if (report.id === doctorId) {
                return { ...report, actual_visits: report.actual_visits + 1, visit_date: new Date().toISOString().split('T')[0] };
            }
            return report;
        });
        setAllReports(updatedReports);
        setVisitedToday(prev => [...prev, doctorId]);
    };

    const handleAddNewDoctorAndLog = (newDoctorData) => {
        const newDoctorId = Date.now();
        const newReport = {
            id: newDoctorId,
            doctor_name: newDoctorData.name,
            area_name: newDoctorData.address || "N/A",
            city_id: filters.city_id || 1,
            target_visits: 1,
            actual_visits: 1,
            visit_date: new Date().toISOString().split('T')[0],
        };
        setAllReports(prevReports => [newReport, ...prevReports]);
        setVisitedToday(prev => [...prev, newDoctorId]);
        Alert.alert(t('frequencyReport.success'), `${t('frequencyReport.visitLogged')} ${newDoctorData.name}`);
    };

    const handleRowLayout = (event, index) => {
        const { height } = event.nativeEvent.layout;
        if (height > 0 && (!rowHeights[index] || Math.abs(rowHeights[index] - height) > 1)) {
            setRowHeights(prev => ({ ...prev, [index]: height }));
        }
    };

	return (
		<SafeAreaView style={styles.safeArea}>
			<GoBack text={t('frequencyReport.headerTitle')} />
			<ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
				{/* Filters Section */}
                <View style={styles.filtersContainer}>
					<View style={styles.filterRow}>
						<View style={styles.filterBox}>
							<Text style={[styles.filterLabel, isRTL && styles.rtlText]}>{t('frequencyReport.city')}</Text>
							<Dropdown style={styles.dropdown} data={cities} labelField="label" valueField="value" placeholder={t('frequencyReport.selectCity')} value={filters.city_id} onChange={item => handleFilterChange('city_id', item.value)} {...dropdownStyles} />
						</View>
						<View style={styles.filterBox}>
							<Text style={[styles.filterLabel, isRTL && styles.rtlText]}>{t('frequencyReport.area')}</Text>
							<Dropdown style={styles.dropdown} data={areas} labelField="label" valueField="value" placeholder={!filters.city_id ? t('frequencyReport.selectCityFirst') : t('frequencyReport.selectArea')} value={filters.area_id} onChange={item => handleFilterChange('area_id', item.value)} disable={!filters.city_id} {...dropdownStyles} />
						</View>
					</View>
                    <View style={styles.filterRow}>
                        <View style={styles.filterBox}>
                            <Text style={[styles.filterLabel, isRTL && styles.rtlText]}>{t('frequencyReport.from')}</Text>
                            <TouchableOpacity style={styles.dateButton} onPress={() => setOpenDateFrom(true)}>
                                <Text style={[styles.dateButtonText, isRTL && styles.rtlText]}>{filters.dateFrom ? filters.dateFrom : 'YYYY-MM-DD'}</Text>
                                <Feather name="calendar" size={18} color="#555" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.filterBox}>
                            <Text style={[styles.filterLabel, isRTL && styles.rtlText]}>{t('frequencyReport.to')}</Text>
                            <TouchableOpacity style={styles.dateButton} onPress={() => setOpenDateTo(true)}>
                                <Text style={[styles.dateButtonText, isRTL && styles.rtlText]}>{filters.dateTo ? filters.dateTo : 'YYYY-MM-DD'}</Text>
                                <Feather name="calendar" size={18} color="#555" />
                            </TouchableOpacity>
                        </View>
                    </View>
				</View>

				{/* Table */}
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#183E9F" />
                        <Text style={[styles.loadingText, isRTL && styles.rtlText]}>{t('frequencyReport.loading')}</Text>
                    </View>
                ) : filteredReports.length > 0 ? (
                    <View style={styles.tableContainer}>
                        <View style={styles.tableWrapper}>
                            {/* Fixed Column */}
                            <View style={styles.fixedColumn}>
                                <View style={[styles.fixedHeaderCell, styles.tableHeader]}>
                                    <Text style={[styles.fixedHeaderText, isRTL && styles.rtlText]}>{t('frequencyReport.doctorName')}</Text>
                                </View>
                                {filteredReports.map((item, index) => (
                                    <View
                                        key={item.id}
                                        onLayout={(event) => handleRowLayout(event, index)}
                                        style={[
                                            styles.fixedCell,
                                            index % 2 === 1 ? styles.oddRow : styles.evenRow,
                                            { height: rowHeights[index] || undefined } // Use undefined to let it auto-size first
                                        ]}
                                    >
                                        <Text style={styles.fixedCellText} numberOfLines={2}>{item.doctor_name}</Text>
                                        {visitedToday.includes(item.id) && (
                                            <View style={styles.visitedBadge}>
                                                <Feather name="check-circle" size={12} color="#fff" />
                                                <Text style={styles.visitedBadgeText}>{t('frequencyReport.visited')}</Text>
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </View>

                            {/* Scrollable Columns */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.scrollableContent}>
                                <View style={styles.scrollableTable}>
                                    <View style={[styles.scrollableHeaderRow, styles.tableHeader]}>
                                        <View style={styles.scrollableHeaderCell}><Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>{t('frequencyReport.area')}</Text></View>
                                        <View style={styles.scrollableHeaderCell}><Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>{t('frequencyReport.targetVisits')}</Text></View>
                                        <View style={styles.scrollableHeaderCell}><Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>{t('frequencyReport.actualVisits')}</Text></View>
                                        <View style={styles.scrollableHeaderCell}><Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>{t('frequencyReport.lastVisit')}</Text></View>
                                    </View>
                                    {filteredReports.map((item, index) => (
                                        <View
                                            key={item.id}
                                            style={[
                                                styles.scrollableRow,
                                                index % 2 === 1 ? styles.oddRow : styles.evenRow,
                                                { height: rowHeights[index] || undefined } // Use undefined to let it auto-size first
                                            ]}
                                        >
                                            <View style={styles.scrollableCell}><Text style={styles.scrollableCellText}>{item.area_name}</Text></View>
                                            <View style={styles.scrollableCell}><Text style={styles.scrollableCellText}>{item.target_visits}</Text></View>
                                            <View style={styles.scrollableCell}><Text style={styles.scrollableCellText}>{item.actual_visits}</Text></View>
                                            <View style={styles.scrollableCell}><Text style={styles.scrollableCellText}>{item.visit_date}</Text></View>
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                ) : (
                    <Text style={[styles.emptyText, isRTL && styles.rtlText]}>{t('frequencyReport.noReports')}</Text>
                )}
			</ScrollView>

            {/* <TouchableOpacity style={styles.logVisitButton} onPress={() => setModalVisible(true)}>
                <Feather name="edit" size={24} color="#FFF" />
                <Text style={styles.logVisitButtonText}>Log Visit</Text>
            </TouchableOpacity> */}

            <AddVisiteModel visible={isModalVisible} onClose={() => setModalVisible(false)} doctors={allReports} onLogVisit={handleLogVisit} onAddNewDoctorAndLog={handleAddNewDoctorAndLog} />
            <DatePicker modal mode="date" open={openDateFrom} date={dateFrom} onConfirm={(date) => { setOpenDateFrom(false); setDateFrom(date); handleFilterChange('dateFrom', date.toISOString().split('T')[0]); }} onCancel={() => setOpenDateFrom(false)} />
            <DatePicker modal mode="date" open={openDateTo} date={dateTo} onConfirm={(date) => { setOpenDateTo(false); setDateTo(date); handleFilterChange('dateTo', date.toISOString().split('T')[0]); }} onCancel={() => setOpenDateTo(false)} />
		</SafeAreaView>
	);
};

const dropdownStyles = {
    placeholderStyle: { fontSize: 14, color: '#999' },
    selectedTextStyle: { fontSize: 14, color: '#333' },
    iconStyle: { width: 20, height: 20 },
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { padding: 15, backgroundColor: '#FFF', alignItems: 'center', borderBottomWidth: 1, borderColor: '#EEE' },
    headerText: { fontSize: 18, fontWeight: 'bold', color: '#183E9F' },
    container: { flex: 1 },
    filtersContainer: { padding: 15, backgroundColor: '#FFFFFF', margin: 15, borderRadius: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    filterBox: { flex: 1, marginHorizontal: 5 },
    filterLabel: { fontSize: 14, color: '#555', marginBottom: 8, fontWeight: '600' },
    dropdown: { height: 45, borderColor: '#E0E0E0', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#FFF' },
    dateButton: { height: 45, borderColor: '#E0E0E0', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    dateButtonText: { fontSize: 14, color: '#333' },
    
    tableContainer: { marginHorizontal: 15 },
    tableWrapper: { flexDirection: 'row' },
    fixedColumn: { width: width * 0.35 },
    fixedHeaderCell: { paddingVertical: 16, paddingHorizontal: 10, justifyContent: 'center', backgroundColor: '#F1F3F5' },
    fixedHeaderText: { fontSize: 14, fontWeight: 'bold', color: '#183E9F', textAlign: 'center' },
    fixedCell: {
        paddingVertical: 10, // Add some default padding
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        borderRightWidth: I18nManager.isRTL ? 0 : 1,
        borderLeftWidth: I18nManager.isRTL ? 1 : 0,
        borderColor: "#E0E0E0"
    },
    fixedCellText: { fontSize: 14, color: '#333', textAlign: 'center' , maxlines: 1},
    
    scrollableContent: { flex: 1 },
    scrollableTable: { minWidth: width * 1.2 },
    scrollableHeaderRow: { flexDirection: 'row' },
    scrollableHeaderCell: { width: width * 0.3, paddingVertical: 16, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center' },
    scrollableHeaderText: { fontSize: 12, fontWeight: 'bold', color: '#1A46BE', textAlign: 'center' },
    scrollableRow: { 
        flexDirection: 'row', 
        borderBottomWidth: 1, 
        borderBottomColor: '#F0F0F0',
        alignItems: 'stretch', // Use stretch to fill height
    },
    scrollableCell: {
        width: width * 0.3,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollableCellText: { fontSize: 14, color: '#333', textAlign: 'center' },
    
    tableHeader: { backgroundColor: '#F1F3F5' },
    evenRow: { backgroundColor: '#FFFFFF' },
    oddRow: { backgroundColor: '#FAFAFA' },
    
    emptyText: { fontSize: 16, color: '#888', padding: 40, textAlign: 'center' },
    logVisitButton: { position: 'absolute', bottom: 40, right: 20, backgroundColor: '#10B981', flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
    logVisitButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
    visitedBadge: { flexDirection: 'row', backgroundColor: '#28A745', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, marginTop: 5, alignItems: 'center' },
    visitedBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold', marginLeft: 4 },
    loadingContainer: { alignItems: 'center', padding: 40 },
    loadingText: { marginTop: 10, fontSize: 16, color: '#888' },
    rtlText: {
        textAlign: 'right',
        writingDirection: 'rtl',
    },
});

export default FrequencyReport;
