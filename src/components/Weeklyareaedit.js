import { TouchableOpacity, Text, View, StyleSheet, Dimensions, Modal, ScrollView } from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Moment from 'moment';
import { areas } from '../helpers/data';
import SearchableDropdown from 'react-native-searchable-dropdown';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const Weeklyareaedit = ({ show, hide, data, submit }) => {

    const [filterValue, setFilterValue] = useState('');

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
                    <Text style={styles.title}>{Moment(data.item).format('yyyy - m - D')}</Text>
                    < View style={styles.filterContainer}>
                        <Text style={styles.calenderText}>Area</Text>
                        <SearchableDropdown
                            onItemSelect={(item) => { setFilterValue(item) }}
                            onRemoveItem={(item, index) => {
                                setFilterValue('')
                            }}
                            containerStyle={{ padding: 5, width: '100%', alignSelf: 'center' }}
                            itemStyle={{
                                padding: 10,
                                backgroundColor: '#fff',
                                borderColor: '#bbb',
                                borderWidth: 1,


                            }}
                            itemTextStyle={{ color: '#000' }}
                            itemsContainerStyle={{ maxHeight: 140, width: '100%' }}
                            items={areas}
                            resetValue={false}
                            textInputProps={
                                {
                                    placeholder: filterValue != '' ? filterValue.name : 'Select Area',
                                    underlineColorAndroid: "transparent",
                                    style: {
                                        padding: 12,
                                        borderWidth: 1,
                                        borderColor: filterValue != '' ? '#7189FF' : '#7189FF',
                                        borderRadius: 5,
                                    },
                                }
                            }
                        />
                    </View>
                    <TouchableOpacity style={styles.btn} onPress={() => { hide() }}>
                        <Text style={{ fontSize: 18, fontWeight: '700', textTransform: 'capitalize', color: '#fff' }}>submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal >
    );
};

export default Weeklyareaedit;

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
        height: '45%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        padding: 20
    },
    title: {
        fontSize: 25,
        color: '#7189FF',
    },
    filterContainer: {
        marginVertical: 20,
        width: '100%',

    },
    calenderText: {
        fontSize: 17,
        color: 'rgba(37, 50, 116, 0.6)',
        marginHorizontal: 15
    },
    btn: {
        backgroundColor: '#7189FF',
        width: '90%',
        alignSelf: 'center',
        borderRadius: 7,
        padding: 7,
        alignItems: 'center',
        justifyContent: 'center'
    }

})