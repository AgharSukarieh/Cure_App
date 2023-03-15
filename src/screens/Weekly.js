import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { styles } from '../components/styles';
import GoBack from '../components/GoBack';
import Moment from 'moment';
import Weeklyareaedit from '../components/Weeklyareaedit';

const Weekly = ({ navigation, route }) => {

    const data = route.params.data
    const year = route.params.year
    const month = route.params.data.id


    function getDaysInMonth() {
        const daysInMonth = new Date(year, month, 0).getDate();
        const days = [];

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month - 1, i);
            days.push(date);
        }
        return days;
    }

    const daysInMarch20232 = getDaysInMonth();

    const [modal, setModal] = useState(false)

    const [dayinfo, setdayinfo] = useState([])

    const edit = (item) => {
        let year = Moment(item).format('yyyy')
        let month = Moment(item).format('M')
        let day = Moment(item).format('D')
        let data = {
            item: item,
            year: year,
            month: month,
            day: day,
        }

        setModal(true)
        setdayinfo(data)
    }


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <GoBack text={'Weekly Plan'} />
                <Text style={style.lale}>{data.name}</Text>
                <View style={{ width: '95%', alignSelf: 'center', marginVertical: 8, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    {daysInMarch20232?.map((item, index) => (
                        <React.Fragment key={index}>
                            {index % 7 === 0 && <View style={style.week}><Text style={style.weektext}>{'Week ' + (Math.floor(index / 7) + 1)}</Text></View>}
                            <TouchableOpacity style={style.card} onLongPress={() => { edit(item) }} onPress={() => { navigation.navigate('Daily', { title: Moment(item).format('dd  D - M - yyyy'), date: Moment(item).format('yyyy-M-D') }) }}>
                                <View style={style.header}>
                                    <Text style={style.dayt}>{Moment(item).format('dd')}</Text>
                                </View>
                                <View style={style.day}>
                                    <Text style={style.dayd}>{Moment(item).format('D')}</Text>
                                    <Text style={style.dayn}>Area Name</Text>
                                </View>
                            </TouchableOpacity>

                        </React.Fragment>
                    ))}

                </View>
            </ScrollView>
            <Weeklyareaedit show={modal} hide={() => { setModal(false) }} data={dayinfo} submit={(e) => { console.log(e) }} />
        </SafeAreaView >
    );
};

export default Weekly;

export const style = StyleSheet.create({
    card: {
        width: '12%',
        height: 100,
        marginBottom: 25,
    },
    header: {
        backgroundColor: '#253274',
        width: '100%',
        height: '40%',
        marginBottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3
    },
    day: {
        backgroundColor: '#7189FF',
        width: '100%',
        height: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3
    },
    dayt: {
        color: '#fff',
        textTransform: 'uppercase'
    },
    dayd: {
        color: '#fff',
        fontSize: 16
    },
    dayn: {
        color: '#fff',
        fontSize: 12,
        textAlign: 'center'
    },
    week: {
        width: '100%',
        alignItems: 'center'
    },
    weektext: {
        marginBottom: 7,
        color: '#000',
        fontSize: 18
    },
    lale: {
        marginHorizontal: 15,
        marginVertical: 8,
        fontSize: 30,
        textTransform: 'capitalize',
        color: '#7189FF',
        fontWeight: '700'
    }
})