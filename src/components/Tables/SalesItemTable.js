import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import SalesModel from '../Modals/SalesModel'
import AntDesign from 'react-native-vector-icons/AntDesign';

const SalesItemTable = ({ item }) => {
    const [modal, setModal] = useState(false)
    const [rowData, setRowData] = useState('')

    const DDD = async (item) => {
        setModal(true)
        setRowData(item)
    }

    return (
        <>
            <View style={{ ...styles.row, backgroundColor: item?.id % 2 == 0 ? '#7189FF' : '#fff' }}>
                <View style={{ ...styles.rowel, width: '30.1%', }}>
                    <Text style={{ ...styles.rowel_tetx, color: item?.id % 2 == 0 ? '#fff' : '#000' }}>{item?.pharmacy}</Text>
                </View>

                <View style={styles.rowel}>
                    <Text style={{ ...styles.rowel_tetx, color: item?.id % 2 == 0 ? '#fff' : '#000' }}>{item?.total_price}</Text>
                </View>

                <View style={styles.rowel}>
                    <Text style={{ ...styles.rowel_tetx, color: item?.id % 2 == 0 ? '#fff' : '#000' }}>{new Date(item?.created_at).toISOString().split('T')[0]}</Text>
                </View>

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

export default SalesItemTable

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        borderWidth: 1,
        borderColor: '#7189FF',
        marginTop: 10,
        borderRadius: 7
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
    }
})