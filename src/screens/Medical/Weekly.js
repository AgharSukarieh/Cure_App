// FileName: screens/WeeklyScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, ScrollView, Alert } from 'react-native';
import Moment from 'moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

// --- Mock Components & Data ---
const GoBack = ({ text, onBack }) => (
    <TouchableOpacity onPress={onBack} style={styles.header}>
        <Feather name="chevron-left" size={24} color="#FFF" />
        <Text style={styles.headerText}>{text}</Text>
    </TouchableOpacity>
);

const FAKE_WEEKLY_DATA = [
    { date: '2025-09-01', area: 'Karrada' }, { date: '2025-09-02', area: 'Mansour' },
    { date: '2025-09-04', area: 'Al-Adhamiyah' }, { date: '2025-09-08', area: 'Zayouna' },
    { date: '2025-09-10', area: 'Al-Jadriya' }, { date: '2025-09-15', area: 'Amiriyah' },
    { date: '2025-09-17', area: 'Iskan' }, { date: '2025-09-18', area: 'Bab Al-Sharqi' },
];

const WeeklyScreen = ({ route, navigation }) => {
    const { monthData, year } = route.params;
    const [weeklyPlans, setWeeklyPlans] = useState([]);

    useEffect(() => {
        // In a real app, you would fetch this data based on month and year
        setWeeklyPlans(FAKE_WEEKLY_DATA);
    }, [monthData, year]);

    function getDaysInMonth(year, month) {
        const date = new Date(year, month - 1, 1);
        const days = [];
        while (date.getMonth() === month - 1) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }

    const daysOfMonth = getDaysInMonth(year, monthData.id);
    const weeks = [];
    for (let i = 0; i < daysOfMonth.length; i += 7) {
        weeks.push(daysOfMonth.slice(i, i + 7));
    }

    const handleDayPress = (day, plan) => {
        if (!plan) {
            Alert.alert('No Plan Set', 'Please set an area for this day first by clicking the edit icon.');
        } else {
            navigation.navigate('Daily', { day, plan });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <GoBack text={'Weekly Plan'} onBack={() => navigation.goBack()} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.monthTitle}>{monthData.name} {year}</Text>
                {weeks.map((weekDays, weekIndex) => (
                    <View key={weekIndex} style={styles.weekContainer}>
                        <View style={styles.weekHeaderContainer}>
                            <FontAwesome name='calendar-check-o' size={18} color="#183E9F" />
                            <Text style={styles.weekHeaderText}>Week {weekIndex + 1}</Text>
                        </View>
                        <View style={styles.daysGrid}>
                            {weekDays.map((day, dayIndex) => {
                                const plan = weeklyPlans.find(d => Moment(d.date).isSame(day, 'day'));
                                return (
                                    <TouchableOpacity
                                        key={dayIndex}
                                        style={[styles.dayCard, plan ? styles.dayCardPlanned : styles.dayCardNotPlanned]}
                                        onPress={() => handleDayPress(day, plan)}
                                    >
                                        <View style={styles.dayCardHeader}>
                                            <Text style={[styles.dayText, plan ? {} : styles.dayTextUnplanned]}>{Moment(day).format('ddd')}</Text>
                                            <Text style={[styles.dateText, plan ? {} : styles.dateTextUnplanned]}>{Moment(day).format('D')}</Text>
                                        </View>
                                        <View style={styles.areaContainer}>
                                            <Text style={[styles.areaText, plan ? {} : styles.areaTextUnplanned]} numberOfLines={2}>
                                                {plan ? plan.area : 'Not Planned'}
                                            </Text>
                                        </View>
                                        <TouchableOpacity style={styles.editIcon} onPress={() => Alert.alert("Edit", `Editing plan for ${Moment(day).format("MMM D")}`)}>
                                            <Feather name="edit-2" size={16} color={plan ? '#183E9F' : '#777'} />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F7FC' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#183E9F' },
    headerText: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
    monthTitle: { marginVertical: 15, fontSize: 28, color: '#183E9F', fontWeight: '700', textAlign: 'center' },
    weekContainer: {
        width: '95%', alignSelf: 'center', backgroundColor: '#FFFFFF', marginBottom: 20,
        borderRadius: 16, padding: 10, elevation: 4, shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
    },
    weekHeaderContainer: { flexDirection: 'row', alignItems: 'center', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#EEE' },
    weekHeaderText: { color: '#183E9F', fontSize: 18, fontWeight: '600', marginLeft: 10 },
    daysGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', paddingTop: 10 },
    dayCard: {
        width: '31%', margin: '1.1%', borderRadius: 12, padding: 10,
        minHeight: 110, justifyContent: 'space-between',
    },
    dayCardPlanned: { backgroundColor: '#E8F0FE', borderWidth: 1, borderColor: '#B0C8F0' },
    dayCardNotPlanned: { backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#E0E0E0' },
    dayCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
    dayText: { fontSize: 14, fontWeight: '600', color: '#183E9F' },
    dayTextUnplanned: { color: '#777' },
    dateText: { fontSize: 18, fontWeight: 'bold', color: '#183E9F' },
    dateTextUnplanned: { color: '#777' },
    areaContainer: { flex: 1, justifyContent: 'center' },
    areaText: { fontSize: 14, fontWeight: '500', textAlign: 'center', color: '#333' },
    areaTextUnplanned: { color: '#999', fontStyle: 'italic' },
    editIcon: { position: 'absolute', bottom: 5, right: 5, padding: 3 },
});

export default WeeklyScreen;
