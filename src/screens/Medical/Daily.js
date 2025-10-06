
import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import { LineChart } from 'react-native-chart-kit';

const GoBack = ({ text, onBack }) => (
    <TouchableOpacity onPress={onBack} style={styles.header}>
        <Feather name="chevron-left" size={24} color="#FFF" />
        <Text style={styles.headerText}>{text}</Text>
    </TouchableOpacity>
);

const FAKE_VISITS_LIST = [
    { id: 1, doctorName: 'Dr. Ali Hassan', specialty: 'Cardiologist', status: 'Visited' },
    { id: 2, doctorName: 'Dr. Fatima Ahmed', specialty: 'Pediatrician', status: 'Visited' },
    { id: 3, doctorName: 'Dr. Omar Khalid', specialty: 'Dermatologist', status: 'Pending' },
    { id: 4, doctorName: 'Dr. Layla Ghasan', specialty: 'Neurologist', status: 'Pending' },
    { id: 5, doctorName: 'Dr. Youssef Ibrahim', specialty: 'General Practitioner', status: 'Pending' },
];

const chartConfig = {
    backgroundColor: '#183E9F',
    backgroundGradientFrom: '#1E45B0',
    backgroundGradientTo: '#3B62C9',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: '6', strokeWidth: '2', stroke: '#ffa726' },
};

const DailyScreen = ({  navigation }) => {
    const { day } = 6;
    const plan = { area: 'Karrada' };

    const lineChartData = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        datasets: [{
            data: [5, 8, 6, 9, 7, 8], // Fake visits per day for the week
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            strokeWidth: 2,
        }],
        legend: ["Weekly Visits"],
    };

    return (
        <SafeAreaView style={styles.container}>
            <GoBack text={'Daily Plan'} onBack={() => navigation.goBack()} />
            <ScrollView>
                <View style={styles.titleContainer}>
                    <View>
                        <Text style={styles.areaTitle}>{plan.area}</Text>
                        <Text style={styles.dateTitle}>{Moment(day).format('dddd, MMMM D, YYYY')}</Text>
                    </View>
                    <TouchableOpacity style={styles.addButton}>
                        <Feather name="plus" size={20} color="#FFF" />
                        <Text style={styles.addButtonText}>Add Visit</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.chartTitleContainer}>
                    <Feather name="bar-chart-2" size={20} color="#183E9F" />
                    <Text style={styles.chartTitle}>Weekly Performance</Text>
                </View>
                <View style={styles.chartWrapper}>
                    <LineChart
                        data={lineChartData}
                        width={Dimensions.get('window').width - 30}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        style={{ borderRadius: 16 }}
                    />
                </View>

                <View style={styles.listContainer}>
                    <Text style={styles.listTitle}>Today's Visits</Text>
                    {FAKE_VISITS_LIST.map(visit => (
                        <View key={visit.id} style={styles.visitCard}>
                            <View style={[styles.statusIndicator, visit.status === 'Visited' ? styles.statusVisited : styles.statusPending]} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.doctorName}>{visit.doctorName}</Text>
                                <Text style={styles.specialty}>{visit.specialty}</Text>
                            </View>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>{visit.status}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F7FC' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#183E9F' },
    headerText: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
    titleContainer: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 15, paddingVertical: 20,
    },
    areaTitle: { fontSize: 26, fontWeight: 'bold', color: '#183E9F' },
    dateTitle: { fontSize: 16, color: '#555', marginTop: 4 },
    addButton: {
        flexDirection: 'row', backgroundColor: '#183E9F', paddingHorizontal: 15,
        paddingVertical: 10, borderRadius: 20, alignItems: 'center', elevation: 3,
    },
    addButtonText: { color: '#FFF', fontWeight: 'bold', marginLeft: 5 },
    chartTitleContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginTop: 10 },
    chartTitle: { fontSize: 18, fontWeight: 'bold', color: '#183E9F', marginLeft: 8 },
    chartWrapper: { padding: 15, alignItems: 'center' },
    listContainer: { paddingHorizontal: 15, marginTop: 10 },
    listTitle: { fontSize: 18, fontWeight: 'bold', color: '#183E9F', marginBottom: 10 },
    visitCard: {
        flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12,
        padding: 15, marginBottom: 10, alignItems: 'center', elevation: 2,
    },
    statusIndicator: { width: 8, height: '100%', borderRadius: 4, marginRight: 15 },
    statusVisited: { backgroundColor: '#28A745' },
    statusPending: { backgroundColor: '#FFC107' },
    doctorName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    specialty: { fontSize: 14, color: '#777', marginTop: 2 },
    statusBadge: {
        paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15,
        backgroundColor: '#F0F0F0',
    },
    statusText: { fontSize: 12, fontWeight: 'bold', color: '#555' },
});

export default DailyScreen;
