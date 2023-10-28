import { TouchableOpacity, Text, View, StyleSheet, Dimensions, Modal, ScrollView } from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';


const CollectionsModel = ({ show, hide, data }) => {

    const pers = (data?.amount / data?.credit_amount) * 100

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

                    <View style={styles.header}>
                        <View style={{ ...styles.headerel, width: '33%' }}>
                            <Text style={styles.headerel_tetx}>Date Of Payment</Text>
                        </View>
                        <View style={styles.verticalline} />
                        <View style={{ ...styles.headerel, width: '33%' }}>
                            <Text style={styles.headerel_tetx}>Check Number</Text>
                        </View>
                        <View style={styles.verticalline} />
                        <View style={{...styles.headerel, width: '33%' }}>
                            <Text style={styles.headerel_tetx}>Achievment</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={{ ...styles.rowel, width: '33%', }}>
                            <Text style={styles.rowel_tetx}>{data?.received_at ?? ''}</Text>
                        </View>

                        <View style={styles.verticalline} />
                        <View style={{ ...styles.rowel, width: '33%', }}>
                            <Text style={styles.rowel_tetx}>{''}</Text>
                        </View>

                        <View style={styles.verticalline} />
                        <View style={{ ...styles.rowel, width: '33%', }}>
                            <Text style={styles.rowel_tetx}>%{pers > 100 ? 100 : pers}</Text>
                        </View>
                        
                    </View>

                </View>
            </View>

        </Modal>
    );
};

export default CollectionsModel;

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



    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        borderColor: '#000',
        marginTop: 10,
        paddingVertical: 7,
        borderBottomWidth: 1.5,
        borderStyle: 'dashed'
      },
      headerel: {
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 1,
        borderColor: '#7189FF',
      },
      headerel_tetx: {
        textAlign: 'center',
        fontSize: 17,
        textTransform: 'capitalize',
        color: '#000'
      },
      verticalline: {
        width: 1,
        height: '100%',
        borderWidth: 1,
        alignSelf: 'center',
        borderStyle: 'dashed',
        borderColor: '#000',
      },


      row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        borderBottomWidth: 1,
        marginTop: 10,
        borderStyle: 'dashed'
    },
      rowel: {
        width: '27%',
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
    verticalline: {
        width: 1,
        height: '100%',
        borderWidth: 1,
        alignSelf: 'center',
        borderStyle: 'dashed',
        borderColor: '#000',
    }
})