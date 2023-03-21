import { TouchableOpacity, Text, View, StyleSheet, Dimensions, Modal, ScrollView } from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

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
                        <AntDesign name="close" color='#7189FF' size={35} style={{ alignSelf: 'flex-end' }} />
                    </TouchableOpacity>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.card}>
                            <Text style={styles.lable}>Dr. name</Text>
                            <Text style={styles.value}>{data.docname?.docname}</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.lable}>Dr. Specialty</Text>
                            <Text style={styles.value}>{data.docSpecialty?.name}</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.lable}>Dr. classification</Text>
                            <Text style={styles.value}>{data.docclass?.name}</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.lable}>item 1</Text>
                            <Text style={styles.value}>{data.drug1 ? data.drug1.drug_name : '___________'}</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.lable}>item 2</Text>
                            <Text style={styles.value}>{data.drug2 ? data.drug2.drug_name : '___________'}</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.lable}>item 3</Text>
                            <Text style={styles.value}>{data.drug3 ? data.drug3.drug_name : '___________'}</Text>
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