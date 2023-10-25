import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import SalesModel from '../Modals/SalesModel'
import AntDesign from 'react-native-vector-icons/AntDesign';

const CollectionItemTable = ({ item }) => {
    const [modal, setModal] = useState(false)
    const [rowData, setRowData] = useState('')

    const DDD = async (item) => {
        setModal(true)
        setRowData(item)
    }

    return (
        <>
            <View style={styles.row}>
                <View style={{ ...styles.rowel, width: '30.1%', }}>
                    <Text style={styles.rowel_tetx}>{item?.name}</Text>
                </View>
                <View style={styles.verticalline} />
                <View style={styles.rowel}>
                    <Text style={styles.rowel_tetx}>{item?.total_price}</Text>
                </View>
                <View style={styles.verticalline} />
                <View style={styles.rowel}>
                    <Text style={styles.rowel_tetx}>{new Date(item?.start_visit).toISOString().split('T')[0]}</Text>
                </View>
                <View style={styles.verticalline} />
                <View style={{ ...styles.rowel, width: '12%', }}>
                    <TouchableOpacity onPress={() => { DDD(item) }}>
                        <AntDesign name="infocirlceo" color='gold' size={17} />
                    </TouchableOpacity>
                </View>
            </View>
            <SalesModel show={modal} hide={() => { setModal(false) }} data={rowData} />
        </>
    )
}

export default CollectionItemTable

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