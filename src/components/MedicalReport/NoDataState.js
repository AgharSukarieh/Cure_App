import React from 'react';
import { View, Text, StyleSheet, I18nManager } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const NoDataState = ({ t }) => {
    const isRTL = I18nManager.isRTL;

    return (
        <View style={styles.noDataContainer}>
            <Feather name="info" size={40} color="#A0AEC0" />
            <Text style={[styles.noDataText, isRTL && styles.rtlText]}>
                {t('medicalReportScreen.noVisits') || 'لا توجد زيارات'}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    noDataContainer: {
        alignItems: 'center',
        paddingTop: 80
    },
    noDataText: {
        marginTop: 15,
        fontSize: 16,
        color: '#718096'
    },
    rtlText: {
        textAlign: 'right',
        writingDirection: 'rtl',
    },
});

export default NoDataState;

