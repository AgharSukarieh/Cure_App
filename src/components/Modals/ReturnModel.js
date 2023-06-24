import { TouchableOpacity, Text, View, StyleSheet, Dimensions, Modal, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';

const ReturnModel = ({ show, hide, data }) => {

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={show}
            coverScreen={false}
            onSwipeComplete={() => setModalVisible2(false)}
        >
            <View style={styles.ModalContainer}>
                <View style={styles.ModalView}>

                    <TouchableOpacity onPress={() => { hide() }}>
                        <AntDesign name="close" color='#7189FF' size={35} style={{ alignSelf: 'flex-end' }} />
                    </TouchableOpacity>

                    <Text style={styles.phname}>{data?.pharmacy?.name}</Text>
                    <Text style={styles.phlocation}>{data?.pharmacy?.address}</Text>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ marginVertical: 10 }}>

                            {data?.order_details?.map((item, index) => (
                                
                                <View key={index} style={styles.card}>
                                    <Text style={styles.item_name}>{item?.product?.name}</Text>
                                    <View style={{ width: '99%', height: 0.5, backgroundColor: '#7189FF', alignSelf: 'center', marginVertical: 10, borderRadius: 22 }} />
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 2 }}>
                                        
                                        <View style={styles.item_info}>
                                            <Text style={styles.item_itemtitle}>Batch Number</Text>
                                            <Text style={{...styles.item_item, fontSize: 11}}>{item?.product?.batch_number}</Text>
                                        </View>

                                        <View style={styles.item_info}>
                                            <Text style={styles.item_itemtitle}>Amount</Text>
                                            <Text style={styles.item_item}>{item?.units}</Text>
                                        </View>

                                        <View style={styles.item_info}>
                                            <Text style={styles.item_itemtitle}>Bonus</Text>
                                            <Text style={styles.item_item}>{item?.bonus}</Text>
                                            
                                        </View> 

                                        <View style={styles.item_info}>
                                            <Text style={styles.item_itemtitle}>Date</Text>
                                            <Text style={styles.item_item}>{moment(item?.created_at).format('YYYY-MM-DD')}</Text>
                                        </View> 

                                        <View style={styles.item_info}>
                                            <Text style={styles.item_itemtitle}>Expiry date</Text>
                                            <Text style={styles.item_item}>{moment(item?.product?.expiry_date).format('YYYY-MM-DD')}</Text>
                                        </View> 

                                    </View>
                                </View>
                            ))}

                        </View>
                    </ScrollView>

                </View>
            </View>
        </Modal>
    );
};

export default ReturnModel;

const styles = StyleSheet.create({
    ModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0707078c',
    },
    ModalView: {
        backgroundColor: "#fff",
        borderRadius: 10,
        width: '95%',
        height: '80%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        padding: 20
    },
    card: {
        shadowColor: "#7189FF",
        shadowOffset: { width: 0, height: 1, },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        width: '99%',
        alignSelf: 'center',
        backgroundColor: '#fff',
        padding: 5,
        marginTop: 10,
        borderRadius: 7
    },
    phname: {
        fontSize: 25,
        textTransform: 'capitalize',
        color: '#7189FF'
    },
    phlocation: {
        marginHorizontal: 15,
        marginVertical: 5,
        fontSize: 16,
    },
    item_name: {
        fontSize: 20,
        textTransform: 'capitalize',
        color: '#7189FF'
    },
    item_info: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    item_itemtitle: {
        marginBottom: 5,
        textTransform: 'capitalize',
    },
    item_item: {
        fontSize:12
    }
})