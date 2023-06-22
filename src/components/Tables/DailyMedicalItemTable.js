import { View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import React, {useState} from 'react'
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SkuModel from '../Modals/skuModel';
import SkueditModel from '../Modals/skueditModel';

const DailyMedicalItemTable = ({item}) => {
    const [modal, setModal] = useState(false)
    const [editmodal, seteditmodal] = useState(false)
    const [rowdata, setrowdata] = useState(false)

    const rowModal = (rowdata) => {
        setrowdata(rowdata)
        setModal(true)
    }
    const editrowModal = (rowdata) => {
        setrowdata(rowdata)
        seteditmodal(true)
    }
  return (
    <>
                        <View style={{ ...styles.row, backgroundColor: item?.id % 2 == 0 ? '#7189FF' : '#fff' }}>

                            <View style={{ ...styles.filtterel, width: '40%', }}>
                                <TouchableOpacity style={{ ...styles.filtterbtn, backgroundColor: item?.id % 2 == 0 ? '#7189FF' : '#fff' }} onPress={() => { }}>
                                    <Text style={{ ...styles.filtterbtntext, color: item?.id % 2 == 0 ? '#fff' : '#7189FF' }}>{item?.doctor?.name}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ width: 1, height: '80%', backgroundColor: item?.id % 2 == 0 ? '#fff' : '#7189FF', alignSelf: 'center' }} />

                            <View style={{ ...styles.filtterel, width: '23%', }}>
                                <TouchableOpacity style={{ ...styles.filtterbtn, backgroundColor: item?.id % 2 == 0 ? '#7189FF' : '#fff' }} onPress={() => { }}>
                                    <Text style={{ ...styles.filtterbtntext, color: item?.id % 2 == 0 ? '#fff' : '#7189FF', textTransform: 'uppercase' }}>{item?.doctor?.speciality?.name}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ width: 1, height: '80%', backgroundColor: item?.id % 2 == 0 ? '#fff' : '#7189FF', alignSelf: 'center' }} />

                            <View style={{ ...styles.filtterel, width: '22%', }}>
                                <TouchableOpacity style={{ ...styles.filtterbtn, backgroundColor: item?.id % 2 == 0 ? '#7189FF' : '#fff' }} onPress={() => { }}>
                                    <Text style={{ ...styles.filtterbtntext, color: item?.id % 2 == 0 ? '#fff' : '#7189FF' }}>{moment(item?.start_visit).format('h:m A')}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ width: 1, height: '80%', backgroundColor: item?.id % 2 == 0 ? '#fff' : '#7189FF', alignSelf: 'center' }} />

                            <View style={{ ...styles.filtterel, flexDirection: 'row', width: '15%', justifyContent: 'space-between' }} >

                                <TouchableOpacity style={{ marginHorizontal: 0 }} onPress={() => { rowModal(item) }}>
                                    <AntDesign name="infocirlceo" color='gold' size={17} />
                                </TouchableOpacity>

                                <TouchableOpacity style={{ marginHorizontal: 2 }} onPress={() => { editrowModal(item) }}>
                                    <AntDesign name="edit" color={item?.id % 2 == 0 ? '#fff' : '#7189FF'} size={17} />
                                </TouchableOpacity>

                            </View>

                        </View>
                        <SkuModel show={modal} data={rowdata} hide={() => { setModal(false) }} submit={(e) => { console.log(e) }} />
                        <SkueditModel show={editmodal} data={rowdata} hide={() => { seteditmodal(false) }} submit={(e) => {  }} />
                        </>
  )
}

export default DailyMedicalItemTable

const styles = StyleSheet.create({
filtterrow1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '98%',
    alignSelf: 'center',
    borderColor: '#7189FF',
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 7,
    paddingVertical: 7
},
filtterrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '98%',
    alignSelf: 'center',
    borderColor: '#7189FF',
    borderBottomWidth: 1,
    marginTop: 10,
    paddingVertical: 7,
    borderRadius: 7
},
filtterel: {
    width: '29%',
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
filtterbtn2: {
    width: '32%',
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
rowel: {
    width: '29%',
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
});