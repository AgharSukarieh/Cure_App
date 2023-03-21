import { TouchableOpacity, Text, View, StyleSheet, Dimensions, Modal, ScrollView } from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const SkuSalesModel = ({ show, hide, data, submit }) => {

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
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.card}>
                            <Text style={styles.lable}>Pharmacy</Text>
                            <Text style={styles.value}>{data.pharam?.pname}</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.lable}>accout details</Text>
                            <Text style={styles.value}>{data.accout}</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.lable}>last payment</Text>
                            <Text style={styles.value}>{data.last_payment}</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.lable}>date</Text>
                            <Text style={styles.value}>{data.date}</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.lable}>Note</Text>
                            <Text style={styles.value}>{data.note}</Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal >
    );
};

export default SkuSalesModel;

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
        color: '#7189FF',
        textTransform: 'capitalize'
    },
    value: {
        marginHorizontal: 10,
        marginBottom: 5,
        fontSize: 20,
        color: '#000',
        textTransform: 'capitalize'
    }

})