import React, { useEffect, useState, useRef } from "react";
import {
	View,
	Text,
	SafeAreaView,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Dimensions,
    ActivityIndicator,
    Animated,
    I18nManager,
} from "react-native";
import DatePicker from "react-native-date-picker";
import Feather from "react-native-vector-icons/Feather";
import { Dropdown } from "react-native-element-dropdown";
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GoBack from '../components/GoBack';
Feather.loadFont();


const FAKE_CITIES = [
    { id: 1, name: "Baghdad" },
    { id: 2, name: "Basra" },
    { id: 3, name: "Erbil" },
];

const FAKE_AREAS = [
    { id: 101, name: "Karrada", city_id: 1 },
    { id: 102, name: "Mansour", city_id: 1 },
    { id: 201, name: "Al-Ashar", city_id: 2 },
    { id: 301, name: "Ankawa", city_id: 3 },
];

const FAKE_SALES_DATA = [
    { id: 1, client_name: "Ahmed Ali Al-Jubouri", total_price: "150.00", status: "delivered", created_at: "2023-10-26T10:00:00Z", city_id: 1, area_id: 101 },
    { id: 2, client_name: "Fatima Hassan", total_price: "220.50", status: "pending", created_at: "2023-10-25T11:30:00Z", city_id: 1, area_id: 102 },
    { id: 3, client_name: "Yusuf Khalid", total_price: "95.75", status: "delivered", created_at: "2023-10-24T09:00:00Z", city_id: 2, area_id: 201 },
    { id: 4, client_name: "Layla Ibrahim", total_price: "300.00", status: "canceled", created_at: "2023-10-23T14:00:00Z", city_id: 3, area_id: 301 },
    { id: 5, client_name: "Omar Saad Al-Dulaimi", total_price: "500.25", status: "delivered", created_at: "2023-10-22T16:45:00Z", city_id: 1, area_id: 101 },
    { id: 6, client_name: "Noor Abdullah", total_price: "75.00", status: "pending", created_at: "2023-10-21T12:15:00Z", city_id: 2, area_id: 201 },
];

// const GoBack = ({ text }) => <View style={{padding: 15, backgroundColor: '#FFF', alignItems: 'center'}}><Text style={{fontSize: 18, fontWeight: 'bold'}}>{text}</Text></View>;
const useAuth = () => ({ user: { id: 1 } });
const globalStyles = StyleSheet.create({ container: { flex: 1 } });


const { width } = Dimensions.get('window');
const FIXED_COLUMN_WIDTH = width * 0.35; 
const SCROLLABLE_COLUMN_WIDTH = width * 0.3;
const ROW_HEIGHT = 55;


const TablePlaceholder = () => {
    const opacity = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 1, useNativeDriver: true, duration: 500 }),
                Animated.timing(opacity, { toValue: 0.5, useNativeDriver: true, duration: 500 }),
            ])
        ).start();
    }, [opacity]);

    const PlaceholderRow = () => (
        <View style={styles.placeholderRow}>
            <View style={styles.placeholderFixedCell} />
            <View style={styles.placeholderScrollableCell} />
            <View style={styles.placeholderScrollableCell} />
            <View style={styles.placeholderScrollableCell} />
        </View>
    );

    return (
        <Animated.View style={[styles.table, { opacity }]}>
            <PlaceholderRow />
            <PlaceholderRow />
            <PlaceholderRow />
            <PlaceholderRow />
            <PlaceholderRow />
        </Animated.View>
    );
};


const SalesTable = ({ params }) => {
    const { t } = useTranslation();
    const isRTL = I18nManager.isRTL;
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            let filteredData = FAKE_SALES_DATA.filter(item => {
                const { city_id, area_id, dateFrom, dateTo } = params;
                const cityMatch = !city_id || item.city_id === city_id;
                const areaMatch = !area_id || item.area_id === area_id;
                const itemDate = new Date(item.created_at);
                const fromDate = dateFrom ? new Date(dateFrom) : null;
                const toDate = dateTo ? new Date(dateTo) : null;
                if(fromDate) fromDate.setHours(0, 0, 0, 0);
                if(toDate) toDate.setHours(23, 59, 59, 999);
                const dateFromMatch = !fromDate || itemDate >= fromDate;
                const dateToMatch = !toDate || itemDate <= toDate;
                return cityMatch && areaMatch && dateFromMatch && dateToMatch;
            });
            setData(filteredData);
            setIsLoading(false);
        }, 1500);
    }, [params]);

    const getStatusStyle = (status) => {
        if (status === 'delivered') return { color: '#28A745', fontWeight: 'bold' };
        if (status === 'pending') return { color: '#007BFF', fontWeight: 'bold' };
        if (status === 'canceled') return { color: '#DC3545', fontWeight: 'bold' };
        return { color: '#333' };
    };

    const getStatusText = (status) => {
        if (status === 'delivered') return t('sales.delivered');
        if (status === 'pending') return t('sales.pending');
        if (status === 'canceled') return t('sales.canceled');
        return status || 'N/A';
    };

    if (isLoading) {
        return <TablePlaceholder />;
    }

    if (data.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, isRTL && styles.rtlText]}>{t('sales.noData')}</Text>
            </View>
        );
    }

    return (
        <View style={styles.table}>
            <View style={styles.fixedColumn}>
                <View style={styles.fixedHeaderCell}><Text style={[styles.fixedHeaderText, isRTL && styles.rtlText]}>{t('sales.client')}</Text></View>
                {data.map((item, index) => (
                    <View key={item.id} style={[styles.fixedCell, index % 2 === 1 ? styles.oddRow : styles.evenRow]}>
                        <Text style={[styles.fixedCellText, isRTL && styles.rtlText]} numberOfLines={1}>{item.client_name || 'N/A'}</Text>
                    </View>
                ))}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View>
                    <View style={styles.scrollableHeaderRow}>
                        <View style={styles.scrollableHeaderCell}><Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>{t('sales.totalPrice')}</Text></View>
                        <View style={styles.scrollableHeaderCell}><Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>{t('sales.status')}</Text></View>
                        <View style={[styles.scrollableHeaderCell, { width: SCROLLABLE_COLUMN_WIDTH * 1.2 }]}><Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>{t('sales.createdAt')}</Text></View>
                    </View>
                    {data.map((item, index) => (
                        <View key={item.id} style={[styles.scrollableDataRow, index % 2 === 1 ? styles.oddRow : styles.evenRow]}>
                            <View style={styles.scrollableCell}><Text style={styles.scrollableCellText}>{item.total_price || '0'}</Text></View>
                            <View style={styles.scrollableCell}><Text style={[styles.scrollableCellText, getStatusStyle(item.status), isRTL && styles.rtlText]}>{getStatusText(item.status)}</Text></View>
                            <View style={[styles.scrollableCell, { width: SCROLLABLE_COLUMN_WIDTH * 1.2 }]}><Text style={styles.scrollableCellText}>{new Date(item.created_at).toLocaleDateString()}</Text></View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};


const Sales = ({ navigation }) => {
	const { t } = useTranslation();
	const isRTL = I18nManager.isRTL;
	const { user } = useAuth();
	const user_id = user?.id;

	const [citiesData, setCitiesData] = useState([]);
	const [cityValue, setCityValue] = useState(null);
	const [areasData, setAreasData] = useState([]);
	const [areaValue, setAreaValue] = useState(null);
	const [filter, setFilter] = useState({ sale_id: user_id });
	const [openFrom, setOpenFrom] = useState(false);
	const [dateFrom, setDateFrom] = useState(new Date());
	const [calenderFrom, setCalenderFrom] = useState("");
	const [openTo, setOpenTo] = useState(false);
	const [dateTo, setDateTo] = useState(new Date());
	const [calenderTo, setCalenderTo] = useState("");

	useEffect(() => {
        setTimeout(() => {
            const cityArray = FAKE_CITIES.map(city => ({ value: city.id, label: city.name }));
            setCitiesData(cityArray);
        }, 500);
	}, []);

	const getAreas = (cityId) => {
        const areaArray = FAKE_AREAS.filter(area => area.city_id == cityId).map(area => ({ value: area.id, label: area.name }));
        setAreasData(areaArray);
	};

	return (
		<SafeAreaView style={{ ...globalStyles.container, backgroundColor: "#F8F9FA" }}>
            {/* <View style={styles.header}>
         
            <Icon name="chevron-left" size={24} color="#000" />
            <Text style={styles.headerText}>{t('sales.headerTitle')}</Text>
            </View> */}
		   <GoBack text={t('sales.headerTitle')} />
			<View style={styles.filtersSection}>
				<View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', width: '100%' }}>
					<View style={styles.dropdownContainer}>
						<Dropdown data={citiesData} labelField="label" valueField="value" placeholder={t('sales.selectCity')} value={cityValue} onChange={item => { setCityValue(item.value); getAreas(item.value); setAreaValue(null); setFilter(prev => ({ ...prev, city_id: item.value, area_id: null })); }} style={styles.dropdown} placeholderStyle={styles.placeholderStyle} selectedTextStyle={styles.selectedTextStyle} />
					</View>
					<View style={styles.dropdownContainer}>
						<Dropdown data={areasData} labelField="label" valueField="value" placeholder={t('sales.selectArea')} value={areaValue} disable={!cityValue} onChange={item => { setAreaValue(item.value); setFilter(prev => ({ ...prev, area_id: item.value })); }} style={styles.dropdown} placeholderStyle={styles.placeholderStyle} selectedTextStyle={styles.selectedTextStyle} />
					</View>
				</View>
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", justifyContent: "space-between", width: '100%', marginTop: 10 }}>
                    <View style={styles.dateContainer}>
                        <Text style={[styles.dateLabel, isRTL && styles.rtlText]}>{t('sales.from')}</Text>
                        <TouchableOpacity style={styles.dateButton} onPress={() => setOpenFrom(true)}><Text style={[styles.dateButtonText, isRTL && styles.rtlText]}>{calenderFrom || "YYYY-MM-DD"}</Text></TouchableOpacity>
                        <DatePicker modal mode="date" open={openFrom} date={dateFrom} onConfirm={date => { setOpenFrom(false); setDateFrom(date); const formattedDate = date.toISOString().split('T')[0]; setCalenderFrom(formattedDate); setFilter(prev => ({ ...prev, dateFrom: formattedDate })); }} onCancel={() => setOpenFrom(false)} />
                    </View>
                    <View style={styles.dateContainer}>
                        <Text style={[styles.dateLabel, isRTL && styles.rtlText]}>{t('sales.to')}</Text>
                        <TouchableOpacity style={styles.dateButton} onPress={() => setOpenTo(true)}><Text style={[styles.dateButtonText, isRTL && styles.rtlText]}>{calenderTo || "YYYY-MM-DD"}</Text></TouchableOpacity>
                        <DatePicker modal mode="date" open={openTo} date={dateTo} onConfirm={date => { setOpenTo(false); setDateTo(date); const formattedDate = date.toISOString().split('T')[0]; setCalenderTo(formattedDate); setFilter(prev => ({ ...prev, dateTo: formattedDate })); }} onCancel={() => setOpenTo(false)} />
                    </View>
                </View>
			</View>
			<View style={styles.tableSection}>
				<SalesTable params={filter} />
			</View>
		</SafeAreaView>
	);
};

export default Sales;

const styles = StyleSheet.create({
    header: {  backgroundColor: '#1c6dbeff', alignContent: 'center',flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10 },
    filtersSection: { backgroundColor: '#FFFFFF', margin: 15, padding: 15, borderRadius: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    dropdownContainer: { width: "48%" },
	dropdown: { height: 50, borderColor: "#E0E0E0", borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#F8F9FA' },
	placeholderStyle: { fontSize: 16, color: "#808080" },
	selectedTextStyle: { fontSize: 16, color: "#000000" },
    dateContainer: { width: "48%" },
    dateLabel: { fontSize: 14, color: '#555', marginBottom: 8, fontWeight: '600' },
    dateButton: { height: 50, borderColor: "#E0E0E0", borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#F8F9FA', justifyContent: 'center' },
    dateButtonText: { fontSize: 16, color: "#808080" },
	tableSection: { flex: 1, marginHorizontal: 15, marginBottom: 15 },
    table: { flexDirection: 'row', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, overflow: 'hidden' },
    fixedColumn: { width: FIXED_COLUMN_WIDTH, backgroundColor: '#FFFFFF', borderRightWidth: 1, borderRightColor: '#E0E0E0' },
    fixedHeaderCell: { height: ROW_HEIGHT, justifyContent: 'center', paddingHorizontal: 10, backgroundColor: '#F1F3F5', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
    fixedHeaderText: { fontSize: 14, fontWeight: 'bold', color: '#183E9F' , },
    fixedCell: { height: ROW_HEIGHT, justifyContent: 'center', paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    fixedCellText: { fontSize: 14, color: '#333' },
    scrollableHeaderRow: { flexDirection: 'row', height: ROW_HEIGHT, backgroundColor: '#F1F3F5', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
    scrollableDataRow: { flexDirection: 'row', height: ROW_HEIGHT, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    scrollableHeaderCell: { width: SCROLLABLE_COLUMN_WIDTH, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 },
    scrollableHeaderText: { fontSize: 12, fontWeight: 'bold', color: '#1A46BE', textAlign: 'center' },
    scrollableCell: { width: SCROLLABLE_COLUMN_WIDTH, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 },
    scrollableCellText: { fontSize: 14, color: '#333', textAlign: 'center' },
    evenRow: { backgroundColor: '#FFFFFF' },
    oddRow: { backgroundColor: '#FAFAFA' },
    emptyContainer: { height: 200, alignItems: 'center', justifyContent: 'center', padding: 20, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8 },
    emptyText: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 10 },
    // أنماط الـ Placeholder
    placeholderRow: { flexDirection: 'row', height: ROW_HEIGHT, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', backgroundColor: '#FFF' },
    placeholderFixedCell: { width: FIXED_COLUMN_WIDTH, backgroundColor: '#EAEAEA', borderRightWidth: 1, borderRightColor: '#F0F0F0' },
    placeholderScrollableCell: { width: SCROLLABLE_COLUMN_WIDTH, backgroundColor: '#F5F5F5', marginLeft: 10 },
    // أنماط RTL
    rtlText: {
        textAlign: 'right',
        writingDirection: 'rtl',
    },
});
