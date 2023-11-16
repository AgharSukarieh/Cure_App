import { TouchableOpacity, Text, View, StyleSheet, Dimensions, Modal, ScrollView } from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';

const SkuModel = ({ show, hide, data, submit }) => {

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

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <AntDesign name="infocirlce" color='#469ED8' size={30} />
                        <Text style={styles.maintitle}>INFO</Text>
                    </View>

                    <ScrollView showsVertical
                        ScrollIndicator={false}>

                        <View style={styles.card}>
                            <Text style={styles.lable}>Dr. name:</Text>
                            <Text style={styles.value}>{data?.doctor?.name}</Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.lable}>Dr. Specialty:</Text>
                            <Text style={styles.value}>{data?.doctor?.speciality?.name}</Text>
                        </View>

                        <View style={{ ...styles.card, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.lable}>Time of Visit:</Text>
                            <Text style={styles.value}>{moment(data?.start_visit).format('hh:mm A')}</Text>
                        </View>

                        {data?.sample_product?.length > 0 ?
                            data?.sample_product?.map((item, index) => (
                                <View style={styles.card} key={index}>
                                    <Text style={styles.lable}>Product {index + 1}</Text>
                                    <Text style={styles.value}>{item?.product?.name}</Text>
                                </View>
                            ))
                            :
                            null
                        }
                        <View style={styles.card}>
                            <Text style={styles.lable}>Note</Text>
                            <Text style={styles.value}>{data?.notes}</Text>
                        </View>

                    </ScrollView>
                </View>
            </View>
        </Modal >
    );
};

export default SkuModel;

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
        height: '90%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        padding: 20
    },
    card: {
        width: '100%',
        marginVertical: 10
    },
    lable: {
        marginBottom: 5,
        fontSize: 22,
        color: '#000',
        textTransform: 'capitalize'
    },
    value: {
        marginHorizontal: 10,
        marginBottom: 5,
        fontSize: 20,
        color: '#000',
        textTransform: 'capitalize'
    },
    maintitle: {
        fontSize: 25,
        color: '#000',
        marginHorizontal: 10
    },

})