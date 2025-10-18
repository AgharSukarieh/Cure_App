import React from 'react';
import { View, StyleSheet, I18nManager } from 'react-native';

const LoadingState = () => {
    const isRTL = I18nManager.isRTL;

    return (
        <View style={styles.loadingContainer}>
            <View style={styles.loadingHeader}>
                <View style={[styles.loadingTitle, isRTL && styles.rtlLoadingText]} />
                <View style={[styles.loadingDateButton, isRTL && styles.rtlLoadingText]} />
            </View>
            
            <View style={styles.loadingTableContainer}>
                <View style={styles.loadingTableWrapper}>
                    <View style={styles.loadingFixedColumn}>
                        <View style={styles.loadingFixedHeaderCell}>
                            <View style={[styles.loadingHeaderText, isRTL && styles.rtlLoadingText]} />
                        </View>
                        {[1, 2, 3].map((index) => (
                            <View 
                                key={index} 
                                style={[
                                    styles.loadingFixedCell, 
                                    index % 2 === 1 ? styles.loadingOddRow : styles.loadingEvenRow
                                ]}
                            >
                                <View style={[styles.loadingCellText, isRTL && styles.rtlLoadingText]} />
                            </View>
                        ))}
                    </View>
                    
                    <View style={styles.loadingScrollableContainer}>
                        <View style={styles.loadingScrollableHeaderRow}>
                            {[1, 2, 3, 4].map((index) => (
                                <View key={index} style={styles.loadingScrollableHeaderCell}>
                                    <View style={[styles.loadingHeaderText, isRTL && styles.rtlLoadingText]} />
                                </View>
                            ))}
                        </View>
                        {[1, 2, 3].map((rowIndex) => (
                            <View 
                                key={rowIndex} 
                                style={[
                                    styles.loadingScrollableRow, 
                                    rowIndex % 2 === 1 ? styles.loadingOddRow : styles.loadingEvenRow
                                ]}
                            >
                                {[1, 2, 3, 4].map((cellIndex) => (
                                    <View key={cellIndex} style={styles.loadingScrollableCell}>
                                        {cellIndex === 4 ? (
                                            <View style={[styles.loadingStatusBadge, isRTL && styles.rtlLoadingText]} />
                                        ) : (
                                            <View style={[styles.loadingCellText, isRTL && styles.rtlLoadingText]} />
                                        )}
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>
            </View>
            
            <View style={styles.loadingAddButton}>
                <View style={[styles.loadingButtonText, isRTL && styles.rtlLoadingText]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        paddingHorizontal: 20,
    },
    loadingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    loadingTitle: {
        width: 200,
        height: 24,
        backgroundColor: '#E5E5EA',
        borderRadius: 12,
    },
    loadingDateButton: {
        width: 120,
        height: 40,
        backgroundColor: '#E5E5EA',
        borderRadius: 8,
    },
    loadingTableContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 20,
    },
    loadingTableWrapper: {
        flexDirection: 'row',
    },
    loadingFixedColumn: {
        width: '40%',
        borderRightWidth: 1,
        borderRightColor: '#EDF2F7',
    },
    loadingFixedHeaderCell: {
        backgroundColor: '#F7FAFC',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EDF2F7',
    },
    loadingFixedCell: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EDF2F7',
        minHeight: 60,
    },
    loadingScrollableContainer: {
        flex: 1,
    },
    loadingScrollableHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#F7FAFC',
        borderBottomWidth: 1,
        borderBottomColor: '#EDF2F7',
    },
    loadingScrollableHeaderCell: {
        flex: 1,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingScrollableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#EDF2F7',
        minHeight: 60,
    },
    loadingScrollableCell: {
        flex: 1,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingHeaderText: {
        width: 80,
        height: 16,
        backgroundColor: '#E5E5EA',
        borderRadius: 8,
    },
    loadingCellText: {
        width: 60,
        height: 12,
        backgroundColor: '#E5E5EA',
        borderRadius: 6,
    },
    loadingStatusBadge: {
        width: 50,
        height: 20,
        backgroundColor: '#E5E5EA',
        borderRadius: 10,
    },
    loadingOddRow: {
        backgroundColor: '#F7FAFC',
    },
    loadingEvenRow: {
        backgroundColor: '#FFFFFF',
    },
    loadingAddButton: {
        backgroundColor: '#39a5e4',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    loadingButtonText: {
        width: 100,
        height: 16,
        backgroundColor: '#E5E5EA',
        borderRadius: 8,
    },
    rtlLoadingText: {
        alignSelf: 'flex-end',
    },
});

export default LoadingState;

