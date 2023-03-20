import { TouchableOpacity, Text, View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DailySalesModel from './OrderPopup';
import DailySales from '../screens/DailySales';
AntDesign.loadFont();
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const DailyTableSales = ({ data , idSelected , setIdSelected}) => {
    const [modal, setModal] = useState(false)
    const [rowdata, setrowdata] = useState(false)

    const rowModal = (rowdata) => {
        setrowdata(rowdata)
        setModal(true)
    }
    const handleSubmit = (id) =>{
        console.log(id);
        setIdSelected(id);
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerel}>
                    <Text style={styles.headerel_tetx}>Pharmacy</Text>
                </View>
                <View style={{ width: 1, height: '100%', backgroundColor: '#7189FF' }} />
                <View style={styles.headerel}>
                    <Text style={styles.headerel_tetx}>Account</Text>
                </View>
                <View style={{ width: 1, height: '100%', backgroundColor: '#7189FF' }} />
                <View style={{ ...styles.headerel }}>
                    <Text style={styles.headerel_tetx}>Action</Text>
                </View>
                <View style={{ width: 1, height: '100%', backgroundColor: '#7189FF' }} />
                <View style={{ ...styles.headerel, width: '20%', }}>
                    <Text style={styles.headerel_tetx}>...</Text>
                </View>
            </View>

            <>
                {data ?
                    data.map((item, index) => (
                        <View style={{ ...styles.row, backgroundColor: index % 2 == 0 ? '#7189FF' : '#fff' }} key={index}>
                            <View style={{ ...styles.filtterel, width: '25%', }}>
                                    <Text style={{ ...styles.filtterbtntext, color: index % 2 == 0 ? '#fff' : '#7189FF' }}>{item.listPharmacy}</Text>
                            </View>
                            <View style={{ ...styles.filtterel, width: '25%',alignItems:"center" }}>
                                    <Text style={{ ...styles.filtterbtntext, color: index % 2 == 0 ? '#fff' : '#7189FF' }}>{item.accountPharamcy}</Text>
                            </View>
                            <View style={{ ...styles.filtterel, width: '30%', }}>
                                <TouchableOpacity onPress={() => handleSubmit(data.id)} style={{ ...styles.filtterbtn, backgroundColor: index % 2 == 0 ? '#7189FF' : '#fff' }} onPress={() => { }}>
                                    <Text style={{ ...styles.filtterbtntext, color: index % 2 == 0 ? '#fff' : '#7189FF' }}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ ...styles.filtterel, width: '20%', }}>
                                <TouchableOpacity onPress={() => { setModal(true) }}>
                                    <AntDesign name="infocirlceo" color='gold' size={17} />
                                </TouchableOpacity>
                            </View>
                             
                        </View>
                    ))
                    :
                    <View style={{ width: '100%', height: 70, justifyContent: 'center', alignItems: 'center', borderWidth: 1 }}>
                        <Text style={{ textTransform: 'capitalize', fontSize: 25 }}>no available data</Text>
                    </View>
                }
            </>
            <DailySalesModel show={modal} data={rowdata} hide={() => { setModal(false) }} submit={(e) => { console.log(e) }} />
        </View >
    );
};

export default DailyTableSales;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '98%',
        alignSelf: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '98%',
        alignSelf: 'center',
        borderColor: '#7189FF',
        borderBottomWidth: 1,
        marginTop: 8,
        paddingVertical: 7
    },
    headerel: {
        width: '21%',
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 0.6,
        borderColor: '#7189FF',
    },
    headerel_tetx: {
        textAlign: 'center',
        fontSize: 17,
        textTransform: 'capitalize',
        color: '#000'
    },
    // ***********************
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
        width: '21%',
        justifyContent: 'center',
        alignItems: 'center',
        justifyContent:"center",
        flexDirection:"row",
        alignSelf:"center",
        paddingHorizontal:2,
        // borderWidth: 1, 
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
    // ***********************
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        borderWidth: 1,
        borderColor: '#7189FF',
        marginTop: 10,
        borderRadius: 7,
        
    },
    rowel: {
        width: '29%',
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 1, 
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