import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import SkuModel from '../Modals/skuModel'

const PharmacyItemTable = ({item}) => {
    const [modal, setModal] = useState(false)
    const [rowdata, setrowdata] = useState(false)
    const rowModal = (rowdata) => {
        setrowdata(rowdata)
        setModal(true)
    }

  return (
    <>
    <View style={{ ...styles.row, backgroundColor: item?.id % 2 == 0 ? '#7189FF' : '#fff' }}>
        <View style={{ ...styles.filtterel, }}>
            <TouchableOpacity style={{ ...styles.filtterbtn, backgroundColor: item?.id % 2 == 0 ? '#7189FF' : '#fff' }} onPress={() => { }}>
                 <Text style={{ ...styles.filtterbtntext, color: item?.id % 2 == 0 ? '#fff' : '#7189FF' }}>{item?.name}</Text>
            </TouchableOpacity>
        </View>
        <View style={{ width: 1, height: '80%', backgroundColor: item?.id % 2 == 0 ? '#fff' : '#7189FF', alignSelf: 'center' }} />

        <View style={{ ...styles.filtterel, }}>
            <TouchableOpacity style={{ ...styles.filtterbtn, backgroundColor: item?.id % 2 == 0 ? '#7189FF' : '#fff' }} onPress={() => { }}>
                <Text style={{ ...styles.filtterbtntext, color: item?.id % 2 == 0 ? '#fff' : '#7189FF' }}>{item?.address}</Text>
            </TouchableOpacity>
        </View>
        <View style={{ width: 1, height: '80%', backgroundColor: item?.id % 2 == 0 ? '#fff' : '#7189FF', alignSelf: 'center' }} />

        <View style={{ ...styles.filtterel, }}>
            <TouchableOpacity style={{ ...styles.filtterbtn, backgroundColor: item?.id % 2 == 0 ? '#7189FF' : '#fff' }} onPress={() => { }}>
                <Text style={{ ...styles.filtterbtntext, color: item?.id % 2 == 0 ? '#fff' : '#7189FF' }}>{item?.classification}</Text>
            </TouchableOpacity>
        </View>
    </View>
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
        backgroundColor: '#7189FF',
        width: '90%',
        paddingVertical: 5,
        borderRadius: 7
    },
    filtterbtntext: {
        textAlign: 'center',
        fontSize: 15,
        textTransform: 'capitalize',
        color: '#fff',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        borderWidth: 1,
        borderColor: '#7189FF',
        marginTop: 10,
        borderRadius: 7
    },
})