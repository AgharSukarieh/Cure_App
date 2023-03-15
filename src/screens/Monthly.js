import { View, Text, TouchableOpacity, SafeAreaView ,Dimensions} from 'react-native';
import React, { useState } from 'react';
import { styles } from '../components/styles';
import GoBack from '../components/GoBack';
import { Monthes } from '../helpers/data';
import SelectDropdown from 'react-native-select-dropdown'
import Feather from 'react-native-vector-icons/Feather';
import Moment from 'moment';
 
const Monthly = ({ navigation, route }) => { 
    const [year, setyear] = useState(Moment(new Date()).format('Y'));
    const start = parseInt(Moment(new Date()).format('Y')) - 2
    const end = parseInt(Moment(new Date()).format('Y')) + 5
    const years = Array.from({ length: end - start + 1 }, (_, index) => start + index);

    // console.log('year ==> ', year);
    const submit = (data) => {
        navigation.navigate('Weekly', { data: data, year: year });

    }

    return (
        <SafeAreaView style={styles.container}>
            <GoBack text={'Monthly Plan'} />
            <View style={{ marginVertical: 10, alignItems: 'center' }}>
                <Text style={{ marginBottom: 7, fontSize: 21 }}>Year</Text>
                <SelectDropdown
                    buttonStyle={{ ...styles.filterbutton, flexDirection: 'row', alignSelf: 'center' }}
                    buttonTextStyle={{ color: "#000", fontSize: 13, marginTop: 0 }}
                    defaultButtonText='Select'
                    data={years}
                    onSelect={(selectedItem, index) => {
                        setyear(selectedItem)
                    }}
                    rowTextForSelection={(item, index) => {
                        return (
                            <Text style={{ fontSize: 16, paddingHorizontal: 0, color: '#000', fontWeight: '600' }}>
                                {item}
                            </Text>
                        );
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        return (

                            <Text style={{ fontSize: 16, paddingHorizontal: 0, color: '#000', fontWeight: '600' }}>
                                {selectedItem}
                            </Text>

                        );
                    }}
                    renderDropdownIcon={isOpened => {
                        return <Feather name={isOpened ? 'chevron-up' : 'chevron-down'} color='#000' size={13} style={{ marginLeft: 0 }} />;
                    }}
                    dropdownStyle={{ backgroundColor: '#fff', borderRadius: 10 }}
                    defaultValueByIndex={2}
                />
            </View>
            <View style={{ marginVertical: 10 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '95%', justifyContent: 'space-between', alignSelf: 'center' }}>
                    {Monthes.map((item, index) => (
                        <TouchableOpacity onPress={() => { submit(item) }} key={index} style={styles.card}>
                            <Text style={styles.cardtext}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

            </View>
        </SafeAreaView >
    );
};

export default Monthly;
