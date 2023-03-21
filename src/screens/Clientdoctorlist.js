import { View, Text, SafeAreaView, Dimensions, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { styles } from '../components/styles';
import GoBack from '../components/GoBack';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { areas, classification, doctors, pharams, Specialty } from '../helpers/data';
import ClientdoctorTable from '../components/Tables/ClientdoctorTable';
import Feather from 'react-native-vector-icons/Feather';

const wwidth = Dimensions.get('window').width
const Clientdoctorlist = () => {

    const [filterValue, setFilterValue] = useState('');

    const [Specialtyfilter, setSpecialtyfilter] = useState('');
    const [classfilter, setclassfilter] = useState('');


    return (
        <SafeAreaView style={styles.container}>

            <GoBack text={'Client List'} />
            <View style={{ width: '90%', alignSelf: 'center' }}>
                <View style={styles.search}>
                    <TextInput
                        style={styles.searchinput}
                        placeholder="Search"
                        onChangeText={(text) => { console.log(text); }}
                    />
                    <TouchableOpacity onPress={() => { }} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }} >
                        <Feather name="x" color='#7189FF' size={27} style={{ marginHorizontal: 2 }} />
                    </TouchableOpacity>
                </View>
                <View style={{ width: '100%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between' }}>
                    < View style={style.filterContainer}>
                        <Text style={style.calenderText}>Specialty</Text>
                        <SearchableDropdown
                            onItemSelect={(item) => { setSpecialtyfilter(item) }}
                            containerStyle={{ padding: 5, width: '90%', height: 50 }}
                            itemStyle={{
                                padding: 10,
                                backgroundColor: '#fff',
                                borderColor: '#bbb',
                                borderWidth: 1,


                            }}
                            itemTextStyle={{ color: '#000', }}
                            itemsContainerStyle={{ maxHeight: 140, width: '100%' }}
                            items={Specialty}
                            resetValue={false}
                            textInputProps={
                                {
                                    placeholder: Specialtyfilter != '' ? Specialtyfilter.name : 'Select Specialty',
                                    underlineColorAndroid: "transparent",
                                    style: {
                                        padding: 12,
                                        borderWidth: 1,
                                        borderColor: Specialtyfilter != '' ? '#7189FF' : '#7189FF',
                                        borderRadius: 5,
                                    },
                                }
                            }
                        />
                    </View>
                    < View style={style.filterContainer}>
                        <Text style={style.calenderText}>Classification</Text>
                        <SearchableDropdown
                            onItemSelect={(item) => { setclassfilter(item) }}
                            onRemoveItem={(item, index) => {
                                setclassfilter('')
                            }}
                            containerStyle={{ padding: 5, width: '90%', height: 50 }}
                            itemStyle={{
                                padding: 10,
                                backgroundColor: '#fff',
                                borderColor: '#bbb',
                                borderWidth: 1,
                            }}
                            itemTextStyle={{ color: '#000', }}
                            itemsContainerStyle={{ maxHeight: 140, width: '100%' }}
                            items={classification}
                            resetValue={false}
                            textInputProps={
                                {
                                    placeholder: classfilter != '' ? classfilter.name : 'Select Specialty',
                                    underlineColorAndroid: "transparent",
                                    style: {
                                        padding: 12,
                                        borderWidth: 1,
                                        borderColor: classfilter != '' ? '#7189FF' : '#7189FF',
                                        borderRadius: 5,
                                    },
                                }
                            }
                        />
                    </View>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <ClientdoctorTable data={doctors} />
            </ScrollView>
        </SafeAreaView >
    );
};

export default Clientdoctorlist;

export const style = StyleSheet.create({
    filterContainer: {
        justifyContent: 'center',
        // alignItems: 'center',
        marginTop: 10,
        width: '50%',
    },
    calenderText: {
        fontSize: 16,
        color: 'rgba(37, 50, 116, 0.6)',
        marginHorizontal: 10
    },
})
