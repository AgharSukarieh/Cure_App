import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import SkuModel from '../Modals/skuModel'

const PharmacyItemTable = ({ item }) => {
    const [modal, setModal] = useState(false)
    const [rowdata, setrowdata] = useState(false)
    const rowModal = (rowdata) => {
        setrowdata(rowdata)
        setModal(true)
    }

    return (
        <>
            <View style={styles.row}>
                <View style={{ ...styles.filtterel, }}>
                    <TouchableOpacity style={styles.filtterbtn} onPress={() => { }}>
                        <Text style={styles.filtterbtntext}>{item?.name}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.verticalline} />

                <View style={{ ...styles.filtterel, }}>
                    <TouchableOpacity style={styles.filtterbtn} onPress={() => { }}>
                        <Text style={styles.filtterbtntext}>{item?.address}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.verticalline} />

                <View style={{ ...styles.filtterel, }}>
                    <TouchableOpacity style={styles.filtterbtn} onPress={() => { }}>
                        <Text style={styles.filtterbtntext}>{item?.classification}</Text>
                    </TouchableOpacity>
                </View>
            </View >
            <SkuModel show={modal} data={rowdata} hide={() => { setModal(false) }} submit={(e) => { console.log(e) }} />
        </>
    )
}

export default PharmacyItemTable
const styles = StyleSheet.create({
    filtterel: {
        width: '33%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 4
    },
    filtterbtn: {
        width: '90%',
        paddingVertical: 5,
        borderRadius: 7
    },
    filtterbtntext: {
        textAlign: 'center',
        fontSize: 15,
        textTransform: 'capitalize',
        color: '#000',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        // borderWidth: 1,
        borderColor: '#000',
        marginTop: 5,
        paddingBottom: 3,
        // borderRadius: 7
        borderBottomWidth: 1.5,
        borderStyle: 'dashed'
    },
    verticalline: {
        height: '90%',
        borderWidth: 1,
        alignSelf: 'center',
        borderStyle: 'dashed',
        borderColor: '#000',
    }
})