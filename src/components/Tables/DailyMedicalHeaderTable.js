import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const DailyMedicalHeaderTable = () => {
    return (
        <View style={styles.header}>
            <View style={{ ...styles.headerel, width: '40%', }}>
                <Text style={styles.headerel_tetx}>Dr. name</Text>
            </View>
            <View style={styles.verticalline} />
            <View style={{ ...styles.headerel, width: '23%', }}>
                <Text style={styles.headerel_tetx}>Specialty</Text>
            </View>
            <View style={styles.verticalline} />
            <View style={{ ...styles.headerel, width: '22%', }}>
                <Text style={styles.headerel_tetx}>Time</Text>
            </View>
            <View style={styles.verticalline} />
            <View style={{ ...styles.headerel, width: '15%', }}>
                <Text style={styles.headerel_tetx}>...</Text>
            </View>
        </View>
    )
}

export default DailyMedicalHeaderTable
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '98%',
        alignSelf: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '98%',
        alignSelf: 'center',
        marginTop: 10,
        paddingVertical: 7,
        borderColor: '#000',
        borderBottomWidth: 1.5,
        borderStyle: 'dashed'
    },
    headerel: {
        width: '24%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 1,
        borderColor: '#469ED8',
    },
    headerel_tetx: {
        textAlign: 'center',
        fontSize: 17,
        textTransform: 'capitalize',
        color: '#000'
    },
    verticalline: {
        width: 1,
        height: '100%',
        borderWidth: 1,
        alignSelf: 'center',
        borderStyle: 'dashed',
        borderColor: '#000'
    }
});