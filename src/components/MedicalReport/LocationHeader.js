import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const LocationHeader = ({ areaName, onEditPress, t }) => {
    return (
        <View style={styles.headerContentArea}>
            <View style={styles.locationContainer}>
                <View style={styles.locationInfo}>
                    <Text style={styles.locationLabel}>
                        {t('medicalReportScreen.currentArea')}
                    </Text>
                    {areaName ? (
                        <View style={styles.locationDetails}>
                            <Text style={styles.areaText}>{areaName}</Text>
                        </View>
                    ) : (
                        <Text style={styles.noLocationText}>
                            {t('medicalReportScreen.noAreaSet')}
                        </Text>
                    )}
                </View>
                <TouchableOpacity 
                    style={styles.editButtonHeader}
                    onPress={onEditPress}
                >
                    <Feather name="edit-3" size={12} color="#183E9F" />
                    <Text style={styles.editButtonTextHeader}>
                        {t('medicalReportScreen.edit')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContentArea: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        marginBottom: 5,
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
    areaText: {
        fontSize: 14,
        color: '#333',
    },
    noLocationText: {
        fontSize: 14,
        color: '#999',
        marginHorizontal: 2,
    },
    editButtonHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#183E9F',
        marginHorizontal: 5,
    },
    editButtonTextHeader: {
        fontSize: 10,
        color: '#183E9F',
        marginLeft: 5,
        fontWeight: '500',
    },
});

export default LocationHeader;

