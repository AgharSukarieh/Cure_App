import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../../components/styles';
import GoBack from '../../components/GoBack';
import Moment from 'moment';
import Weeklyareaedit from '../../components/Weeklyareaedit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MED_ADD_DAILYSCHEDULE, MED_GET_DAILYSCHEDULE } from '../../Provider/ApiRequest';
import axios from 'axios';

const WeeklySales = ({ navigation, route }) => {


    const [user, setuser] = useState('');
    const getlogs = async () => {
        const a = await AsyncStorage.getItem('userInfo')
        setuser(JSON.parse(a))
    }
    useEffect(() => {
        getlogs()
    }, []);

    // //////////////////////////////////////////////
    // //////////////////////////////////////////////
    // //////////////////////////////////////////////

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

    // //////////////////////////////////////////////
    // //////////////////////////////////////////////
    // //////////////////////////////////////////////

    const [weeklyscdata, setweeklyscdata] = useState([]);

    const getdata = () => {
        let newdata = {
            userid: user.id,
            date: year + '-' + month
        }
        axios({
            method: "POST",
            url: MED_GET_DAILYSCHEDULE,
            data: newdata
        }).then((response) => {
            console.log(response.data)
            // setweeklyscdata(response.data)
        }).catch((error) => { console.log("🚀 ~ file: DailyaddModel.js ~ line 43 ~ getdoctors ~ error", error) })
    }
    useEffect(() => {
        getdata()
    }, [user])


    // //////////////////////////////////////////////
    // //////////////////////////////////////////////
    // //////////////////////////////////////////////




    const [modal, setModal] = useState(false)

    const [dayinfo, setdayinfo] = useState([])

    const edit = (item) => {
        let data = {
            item: Moment(item).format('yyyy-M-D'),
        }
        setdayinfo(data)
        setModal(true)

    }

    const submitedit = (data) => {
        let newdata = {
            area_id: data.area_id,
            date: dayinfo.item,
            userid: user.id
        }
        axios({
            method: "POST",
            url: MED_ADD_DAILYSCHEDULE,
            data: newdata
        }).then((response) => {
            getdata()
            console.log(response.data)
        }).catch((error) => { console.log("🚀 ~ file: DailyaddModel.js ~ line 43 ~ getdoctors ~ error", error) })
    }


    const alertarea = () => {
        Alert.alert('Please Make Sure that you select an area for that day')
    }

console.log("--------");
const goToDaily = () => {
    if (user.role == 'sales'){
        navigation.navigate('Daily-sales', { title: Moment(item).format('dd  D - M - yyyy'), date: Moment(item).format('yyyy-M-D'), area: matchingData })
    } else {
        navigation.navigate('Daily-notSales', { title: Moment(item).format('dd  D - M - yyyy'), date: Moment(item).format('yyyy-M-D'), area: matchingData })
    } 
}

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <GoBack text={'Weekly Plan'} />
                <Text style={style.lale}>{data.name}</Text>
                <View style={{ width: '95%', alignSelf: 'center', marginVertical: 8, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    {daysInMarch20232?.map((item, index) => {
                        // Find the object in weeklyscdata with the same date as the current item
                        const matchingData = weeklyscdata.find(data => Moment(data.date).isSame(item, 'day'));
                        // Get the area_name from the matching object, or use a default value if it's not found
                        const areaName = matchingData ? matchingData.area_name : 'No Area';
                        const areaid = matchingData?.area_id
                        return (
                            <React.Fragment key={index}>
                                {index % 7 === 0 && <View style={style.week}><Text style={style.weektext}>{'Week ' + (Math.floor(index / 7) + 1)}</Text></View>}
                                <TouchableOpacity
                                    // disabled={!weeklyscdata.find(sc => Moment(sc.date).format('yyyy-M-D') === Moment(item).format('yyyy-M-D'))}
                                    style={style.card}
                                    onLongPress={() => { edit(item) }}
                                    onPress={() => {
                                        !weeklyscdata.find(sc => Moment(sc.date).format('yyyy-M-D') === Moment(item).format('yyyy-M-D'))
                                            ? alertarea()
                                            : goToDaily()
                                    }}>
                                    <View style={style.header}>
                                        <Text style={style.dayt}>{Moment(item).format('dd')}</Text>
                                    </View>
                                    <View style={{ ...style.day, backgroundColor: !weeklyscdata.find(sc => Moment(sc.date).format('yyyy-M-D') === Moment(item).format('yyyy-M-D')) ? '#7383d1' : '#7189FF' }}>
                                        <Text style={style.dayd}>{Moment(item).format('D')}</Text>
                                        <Text style={style.dayn}>{areaName}</Text>
                                    </View>
                                </TouchableOpacity>
                            </React.Fragment>
                        );
                    })}

                </View>
            </ScrollView>
            <Weeklyareaedit show={modal} hide={() => { setModal(false) }} data={dayinfo} submit={(e) => { submitedit(e) }} />
        </SafeAreaView >
    );
};

export default WeeklySales;

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