// FileName: screens/MonthlyScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, ScrollView, Dimensions } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Feather from 'react-native-vector-icons/Feather';
import { PieChart } from 'react-native-chart-kit';

const GoBack = ({ text }) => (
    <View style={styles.header}>
        <Text style={styles.headerText}>{text}</Text>
    </View>
);

const FAKE_YEARS = [2024, 2025, 2026];

const getFakeMonthlyPlans = (year) => {
    const baseVisits = year === 2024 ? 120 : 140;
    return [
        { id: 1, name: 'January', status: 'Completed', visits: baseVisits, completedVisits: baseVisits },
        { id: 2, name: 'February', status: 'Completed', visits: baseVisits, completedVisits: 115 },
        { id: 3, name: 'March', status: 'Completed', visits: baseVisits + 10, completedVisits: 130 },
        { id: 4, name: 'April', status: 'Completed', visits: baseVisits, completedVisits: 125 },
        { id: 5, name: 'May', status: 'Pending', visits: baseVisits + 20, completedVisits: 95 },
        { id: 6, name: 'June', status: 'Pending', visits: baseVisits + 15, completedVisits: 50 },
        { id: 7, name: 'July', status: 'Not Started', visits: baseVisits + 20, completedVisits: 0 },
        { id: 8, name: 'August', status: 'Not Started', visits: baseVisits + 15, completedVisits: 0 },
        { id: 9, name: 'September', status: 'Not Started', visits: baseVisits + 30, completedVisits: 0 },
        { id: 10, name: 'October', status: 'Not Started', visits: baseVisits + 25, completedVisits: 0 },
        { id: 11, name: 'November', status: 'Not Started', visits: baseVisits + 20, completedVisits: 0 },
        { id: 12, name: 'December', status: 'Not Started', visits: baseVisits + 10, completedVisits: 0 },
    ];
};

const chartConfig = {
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
};

const MonthlyScreen = ({ navigation }) => {
    const [year, setYear] = useState(FAKE_YEARS[1]);
    const [monthlyPlans, setMonthlyPlans] = useState([]);
    const [summaryData, setSummaryData] = useState({ completed: 0, pending: 0, notStarted: 0 });

    useEffect(() => {
        const plans = getFakeMonthlyPlans(year);
        setMonthlyPlans(plans);

        const completed = plans.filter(p => p.status === 'Completed').length;
        const pending = plans.filter(p => p.status === 'Pending').length;
        const notStarted = plans.filter(p => p.status === 'Not Started').length;
        setSummaryData({ completed, pending, notStarted });
    }, [year]);

    const pieChartData = [
        { name: 'Completed', population: summaryData.completed, color: '#28A745', legendFontColor: '#7F7F7F', legendFontSize: 14 },
        { name: 'Pending', population: summaryData.pending, color: '#FFC107', legendFontColor: '#7F7F7F', legendFontSize: 14 },
        { name: 'Not Started', population: summaryData.notStarted, color: '#DC3545', legendFontColor: '#7F7F7F', legendFontSize: 14 },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <GoBack text={'Monthly Plan'} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.summaryContainer}>
                    <View style={styles.yearSelectorContainer}>
                        <Text style={styles.summaryTitle}>Yearly Overview</Text>
                        <SelectDropdown
                            data={FAKE_YEARS}
                            onSelect={(selectedItem) => setYear(selectedItem)}
                            defaultValue={year}
                            buttonStyle={styles.dropdownButton}
                            buttonTextStyle={styles.dropdownButtonText}
                            renderDropdownIcon={isOpened => (
                                <Feather name={isOpened ? 'chevron-up' : 'chevron-down'} color='#183E9F' size={20} />
                            )}
                        />
                    </View>
                    <View style={styles.chartContainer}>
                        <PieChart
                            data={pieChartData}
                            width={Dimensions.get('window').width * 0.9}
                            height={180}
                            chartConfig={chartConfig}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            paddingLeft={"10"}
                            center={[5, 0]}
                            absolute
                        />
                    </View>
                </View>

                <View style={styles.cardsContainer}>
                    {monthlyPlans.map((item) => {
                        const progress = item.visits > 0 ? (item.completedVisits / item.visits) * 100 : 0;
                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.card}
                                onPress={() => navigation.navigate('Weekly', { monthData: item, year: year })}
                            >
                                <Text style={styles.cardMonthText}>{item.name}</Text>
                                <View style={styles.cardBody}>
                                    <Text style={styles.cardVisitsText}>{`${item.completedVisits} / ${item.visits}`}</Text>
                                    <Text style={styles.cardStatusLabel}>Visits</Text>
                                </View>
                                <View style={styles.progressBarBackground}>
                                    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F7FC' },
    header: { padding: 15, backgroundColor: '#183E9F', alignItems: 'center' },
    headerText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    summaryContainer: {
        backgroundColor: '#FFF', margin: 15, borderRadius: 20, padding: 20,
        elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
    },
    yearSelectorContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    summaryTitle: { fontSize: 22, fontWeight: 'bold', color: '#183E9F' },
    dropdownButton: { backgroundColor: '#F4F7FC', borderRadius: 10, width: '40%', height: 45 },
    dropdownButtonText: { color: "#183E9F", fontSize: 16, fontWeight: 'bold' },
    chartContainer: { alignItems: 'center', marginTop: 10 },
    cardsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 15, marginTop: 10 },
    card: {
        width: '48%', backgroundColor: '#FFF', borderRadius: 15, padding: 15, marginBottom: 15,
        elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 5,
    },
    cardMonthText: { fontSize: 18, fontWeight: 'bold', color: '#183E9F', marginBottom: 10 },
    cardBody: { alignItems: 'flex-start', marginBottom: 10 },
    cardVisitsText: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    cardStatusLabel: { fontSize: 13, color: '#777' },
    progressBarBackground: { height: 8, backgroundColor: '#E0E7FF', borderRadius: 4 },
    progressBarFill: { height: '100%', backgroundColor: '#4A90E2', borderRadius: 4 },
});

export default MonthlyScreen;
