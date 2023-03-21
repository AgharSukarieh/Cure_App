import { TouchableOpacity, Text, View, StyleSheet, Dimensions, Modal, ScrollView, TextInput } from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SelectDropdown from 'react-native-select-dropdown'
import { pharams } from '../../helpers/data';
import Feather from 'react-native-vector-icons/Feather';
import { styles } from '../styles';
import Moment from 'moment';
import DatePicker from 'react-native-date-picker'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const DailySalesaddModel = ({ show, hide, data, submit }) => {

    const [pharam, setpharam] = useState('')
    const [accout, setaccout] = useState('')
    const [note, setnote] = useState('')

    const [open, setOpen] = useState(false)
    const [date, setDate] = useState(new Date())
    const [last_payment, setlast_payment] = useState('');

    const [textInputHeight, setTextInputHeight] = useState(40);

    const handleContentSizeChange = (event) => {
        const { height } = event.nativeEvent.contentSize;
        setTextInputHeight(height);
    };

    const submit2 = () => {
        let data = {
            pharam: pharam,
            accout: accout,
            note: note,
            last_payment:last_payment,
            date: Moment(new Date()).format('Y-M-D h:m:s a'),
        }
        // console.log(data);
        submit(data)
        hide()
    }

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
                    <TouchableOpacity onPress={() => { hide() }}>
                        <AntDesign name="close" color='#7189FF' size={35} style={{ alignSelf: 'flex-end' }} />
                    </TouchableOpacity>

                    <Text style={style.maintitle}>Add new</Text>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ marginVertical: 10 }}>
                            <View style={style.card}>
                                <Text style={style.lable}>Pharmacy</Text>
                                <SelectDropdown
                                    buttonStyle={{ ...styles.drop, flexDirection: 'row' }}
                                    buttonTextStyle={{ color: "#000", fontSize: 15, fontWeight: '600', marginTop: 0 }}
                                    defaultButtonText='Select'
                                    data={pharams}
                                    onSelect={(selectedItem, index) => {
                                        setpharam(selectedItem)
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        return (
                                            <>
                                                <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                                    {item.pname}
                                                </Text>
                                            </>
                                        );
                                    }}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        return (
                                            <>
                                                <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                                    {selectedItem.pname}
                                                </Text>
                                            </>
                                        );
                                    }}
                                    renderDropdownIcon={isOpened => {
                                        return <Feather name={isOpened ? 'chevron-up' : 'chevron-down'} color="#000" size={13} style={{ marginLeft: 0 }} />;
                                    }}
                                    dropdownStyle={{ backgroundColor: '#fff', borderRadius: 10 }}
                                />
                            </View>

                            <View style={style.card}>
                                <Text style={style.lable}>accout details</Text>
                                <TextInput
                                    onChangeText={(text) => { setaccout(text) }}
                                    placeholder='accout details'
                                    style={{ ...styles.drop, height: textInputHeight, paddingHorizontal: 10 }}
                                    maxLength={300}
                                    multiline
                                    numberOfLines={10}
                                    textAlignVertical='top'
                                    onContentSizeChange={handleContentSizeChange}
                                />
                            </View>

                            <View style={style.card}>
                                <Text style={style.lable}>last payment</Text>
                                <TouchableOpacity style={{ ...styles.drop, justifyContent: 'center', alignItems: 'center' }} onPress={() => { setOpen(true) }}>
                                    <Text style={{ fontSize: 18, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>{last_payment != '' ? last_payment : '-- -- -- -- --'}</Text>
                                </TouchableOpacity>
                                <DatePicker
                                    modal
                                    mode="date"
                                    format="YYYY-MM-DD"
                                    open={open}
                                    date={date}
                                    minimumDate={date}
                                    onConfirm={(data) => {
                                        setOpen(false)
                                        setDate(data)
                                        const formattedDate = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate()
                                        setlast_payment(formattedDate)
                                    }}

                                    onCancel={() => {
                                        setOpen(false)
                                    }}
                                />
                            </View>
                            <View style={style.card}>
                                <Text style={style.lable}>note</Text>
                                <TextInput
                                    onChangeText={(text) => { setnote(text) }}
                                    placeholder='Note'
                                    style={{ ...styles.drop, height: textInputHeight, paddingHorizontal: 10 }}
                                    maxLength={300}
                                    multiline
                                    numberOfLines={10}
                                    textAlignVertical='top'
                                    onContentSizeChange={handleContentSizeChange}
                                />
                            </View>
                            <View style={style.card}>
                                <TouchableOpacity style={styles.btn} onPress={() => { submit2() }}>
                                    <Text style={{ fontSize: 18, fontWeight: '700', textTransform: 'capitalize', color: '#fff' }}>submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default DailySalesaddModel;

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
        width: '95%',
        height: '90%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        padding: 20
    },
    maintitle: {
        fontSize: 25,
        textTransform: 'capitalize',
        color: '#7189FF'
    },
    card: {
        marginVertical: 15,
        width: '100%',
    },
    lable: {
        marginBottom: 5,
        fontSize: 16,
        color: '#000',
        textTransform: 'capitalize'
    },
    filterbuttontext2: {

    }

})