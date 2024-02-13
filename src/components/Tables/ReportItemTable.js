import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

const ReportItemTable = ({ item }) => {
    return (
        <>
            <View style={styles.row}>

                <View style={{ ...styles.rowel, width: '25%', }}>
                    <Text style={styles.rowel_tetx}>{item?.product}</Text>
                </View>

                <View style={styles.verticalline} />

                <View style={{ ...styles.rowel, width: '20%', }}>
                    <Text style={styles.rowel_tetx}>{item?.sold_units ?? ''}</Text>
                </View>

                <View style={styles.verticalline} />

                <View style={{ ...styles.rowel, width: '20%', }}>
                    <Text style={styles.rowel_tetx}>{item?.target ?? ''}</Text>
                </View>

                <View style={styles.verticalline} />

                <View style={{ ...styles.rowel, width: '30%', }}>
                    <Text style={styles.rowel_tetx}>{item?.percentage ?? ''}</Text>
                </View>

            </View>
        </>
    )
}

export default ReportItemTable

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        borderBottomWidth: 1,
        marginTop: 10,
        borderStyle: 'dashed'
    },
    rowel: {
        width: '27%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 4
    },
    rowel_tetx: {
        textAlign: 'center',
        fontSize: 15,
        textTransform: 'capitalize',
        color: '#000',
        height: 20,
    },
    rowel_tetx2: {
        textAlign: 'center',
        fontSize: 15,
        textTransform: 'capitalize',
        color: '#fff',
        height: 20,
    },
    verticalline: {
        width: 1,
        height: '100%',
        borderWidth: 1,
        alignSelf: 'center',
        borderStyle: 'dashed',
        borderColor: '#000',
    }
})