import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { styles } from '../components/styles';
import GoBack from '../components/GoBack';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { areas, doctors, pharams } from '../helpers/data';
import DatePicker from 'react-native-date-picker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ClientdoctorTable from '../components/ClientdoctorTable';
import ClientpharmaTable from '../components/ClientpharmaTable';

const Clientpharmalist = () => {

    const [filterValue, setFilterValue] = useState('');
 
    return (
        <SafeAreaView style={styles.container}>

            <GoBack text={'Client List'} />

            < View style={styles.filterContainer}>
                <Text style={styles.calenderText}>Filter</Text>
                <SearchableDropdown
                    onItemSelect={(item) => { setFilterValue(item) }}
                    onRemoveItem={(item, index) => {
                        setFilterValue('')
                    }}
                    containerStyle={{ padding: 5, width: '90%', }}
                    itemStyle={{
                        padding: 10,
                        backgroundColor: '#fff',
                        borderColor: '#bbb',
                        borderWidth: 1,


                    }}
                    itemTextStyle={{ color: '#000', }}
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

            <ScrollView showsVerticalScrollIndicator={false}>
                <ClientpharmaTable data={pharams} />
            </ScrollView>
        </SafeAreaView >
    );
};

export default Clientpharmalist;
