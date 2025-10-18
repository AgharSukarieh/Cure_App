import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Moment from 'moment';

const DateSelector = ({ selectedDate, onPress }) => {
    return (
        <View style={styles.dateCardWrapper}>
            <View style={styles.dateCard}>
                <TouchableOpacity style={styles.dateSelector} onPress={onPress}>
                    <Feather name="calendar" size={24} color="#4A5568" />
                    <Text style={styles.dateSelectorText}>
                        {Moment(selectedDate).format('dddd, MMMM Do, YYYY')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    dateCardWrapper: {
        paddingHorizontal: 20,
        marginTop: 100,  // 120 (height of header) - 40 (overlap)
        zIndex: 50
    },
    dateCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    dateSelectorText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2D3748',
        marginLeft: 15
    }
});

export default DateSelector;

