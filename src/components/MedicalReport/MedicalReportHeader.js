import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, I18nManager } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { BlurView } from '@react-native-community/blur';
import Stars from './Stars';

const MedicalReportHeader = ({ title, onBackPress }) => {
    const isRTL = I18nManager.isRTL;
    
    return (
        <View style={styles.headerContainer}>
            <View style={styles.header}>
                <BlurView style={styles.blurView} blurType="light" blurAmount={5} />
                <View style={styles.overlay} />
                <Stars />
                <View style={styles.headerContent}>
                    <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
                        <Feather name={isRTL ? "chevron-right" : "chevron-left"} size={28} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{title}</Text>
                    <View style={{ width: 40 }} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10
    },
    header: {
        height: 120,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
    },
    blurView: {
        ...StyleSheet.absoluteFillObject
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#39a5e4c7'
    },
    headerContent: {
        zIndex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginTop: 20
    },
    backButton: {
        padding: 5
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3
    }
});

export default MedicalReportHeader;

