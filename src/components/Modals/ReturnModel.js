import { TouchableOpacity, Text, View, StyleSheet, Dimensions, Modal, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import Input from '../Input';
import { post } from '../../WebService/RequestBuilder';
import globalConstants from '../../config/globalConstants';

const ReturnModel = ({ show, hide, data, func }) => {
    const [returnUnits, setReturnUnits] = useState(0);

    const submitBtn = (order_id, product_id, units) => {
        if (units > 0 && returnUnits > 0 && returnUnits <= units) {
            const data = {
                product_id: product_id,
                order_id: order_id,
                quantity: returnUnits
            }
            post(globalConstants.return.add_returns, data, null).then((res) => {
                func()
            }).catch((err) => {

            }).finally(() => {

            })
        }else {
            if (returnUnits == 0){
                Alert.alert("Please enter valid numbers");
            }else {
                Alert.alert("Number of units must be less than or equal to order amount.");
            } 
        }
    }

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
                        <AntDesign name="close" color='#469ED8' size={35} style={{ alignSelf: 'flex-end' }} />
                    </TouchableOpacity>

                    <Text style={styles.phname}>{data?.pharmacy?.name}</Text>
                    <Text style={styles.phlocation}>{data?.pharmacy?.address}</Text>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ marginVertical: 10 }}>
                            {data?.order_details?.map((item, index) => (
                                <>
                                <View key={index} style={styles.card}>
                                    <Text style={styles.item_name}>{item?.product?.name}</Text>
                                    <View style={{ width: '99%', height: 0.5, backgroundColor: '#469ED8', alignSelf: 'center', marginVertical: 10, borderRadius: 22 }} />
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
                                
                                <View>
                                    <Input
                                        lable={'Units'}
                                        setData={setReturnUnits}
                                        onEndEditing={()=>{}}
                                        style={styles.inputModel}
                                        value={returnUnits}
                                        isNumeric
                                    />

                                    <TouchableOpacity
                                        style={{
                                            ...styles.btn,
                                            backgroundColor: '#469ED8',
                                            height: 45,
                                            marginRight: 40,
                                        }}
                                        onPress={() => {
                                            submitBtn(item?.order_id, item?.product_id, item?.units);
                                        }}>
                                        <Text
                                            style={{
                                            fontSize: 18,
                                            fontWeight: '700',
                                            textTransform: 'capitalize',
                                            color: '#fff',
                                            }}>
                                            submit
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                                </>
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
    btn: {
        backgroundColor: '#469ED8',
        alignSelf: 'center',
        borderRadius: 7,
        padding: 7,
        paddingHorizontal: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        // width:'47%'
      },
    inputModel: {
        height: 40,
        borderColor: '#000',
        borderWidth: 1,
        paddingLeft: 10,
        borderRadius: 5,
      },
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
        shadowColor: "#469ED8",
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
        color: '#469ED8'
    },
    phlocation: {
        marginHorizontal: 15,
        marginVertical: 5,
        fontSize: 16,
    },
    item_name: {
        fontSize: 20,
        textTransform: 'capitalize',
        color: '#469ED8'
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