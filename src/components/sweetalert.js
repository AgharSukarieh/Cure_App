import { TouchableOpacity, Text, View, StyleSheet, Dimensions, Modal, ScrollView, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const Sweetalert = ({ show, hide, title, }) => {

    setTimeout(() => {
        hide()
    }, 1500);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={show}
            coverScreen={false}
            onSwipeComplete={() => setModalVisible2(false)}
        >
            <View style={style.ModalContainer}>
                <View style={style.ModalView}>
                    <AntDesign name="checkcircle" color='#469ED8' size={55} style={{ alignSelf: 'center' }} />
                    <View style={{ width: '100%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
                        <Text style={{ fontSize: 20, color: '#000', textTransform: 'capitalize' }}>{title}</Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default Sweetalert;

const style = StyleSheet.create({
    ModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0707078c',
    },
    ModalView: {
        backgroundColor: "#fff",
        borderRadius: 10,
        width: '90%',
        height: '20%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        padding: 20
    },

})