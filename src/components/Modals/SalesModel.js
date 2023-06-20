import { TouchableOpacity, Text, View, StyleSheet, Dimensions, Modal, ScrollView } from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Constants from '../../config/globalConstants';
import TableView from '../../General/TableView';
import SalesModelItemTable from '../Tables/SalesModelItemTable';


const SalesModel = ({ show, hide, data }) => {
    const getOrderDetailsEndpoint = Constants.users.order_details + data?.id;

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
                    <Text style={styles.phname}>{data?.pharmacy}</Text>
                    <Text style={styles.phlocation}>{data?.area}</Text>

                    <View style={styles.tableContainer}>
                        <TableView
                            apiEndpoint={getOrderDetailsEndpoint} 
                            renderItem={({ item }) => <SalesModelItemTable item={item} />} 
                        />
                        <View style={styles.card}>
                            <Text style={{...styles.item_name, color: '#000000'}}>Total Price</Text>
                            <Text style={styles.item_name}>{data?.total_price}</Text>
                        </View>
                    </View>

                </View>
            </View>

        </Modal>
    );
};

export default SalesModel;

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
        shadowColor: "#7189FF",
        shadowOffset: { width: 0, height: 1, },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        width: '99%',
        alignSelf: 'center',
        backgroundColor: '#fff',
        padding: 15,
        marginTop: 10,
        borderRadius: 7,
        borderWidth:0.5,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    phname: {
        fontSize: 25,
        textTransform: 'capitalize',
        color: '#7189FF',
        textAlign:'center'
    },
    tableContainer: {
        flex: 1,
        width: '98%',
        alignSelf: 'center',
        marginVertical: 10
      },
      item_name: {
        fontSize: 20,
        textTransform: 'capitalize',
        color: '#7189FF'
    },
})