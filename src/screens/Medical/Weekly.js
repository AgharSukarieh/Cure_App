import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../../components/styles';
import GoBack from '../../components/GoBack';
import Moment from 'moment';
import Weeklyareaedit from '../../components/Weeklyareaedit';
import { useAuth } from '../../contexts/AuthContext';
import Constants from '../../config/globalConstants';
import { get, post } from '../../WebService/RequestBuilder';
import LoadingScreen from '../../components/LoadingScreen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Weekly = ({ navigation, route }) => {
    const { user, role } = useAuth();
    const data = route.params.data
    const year = route.params.year
    const month = route.params.data.id
    const cityArea = route.params.cityArea

    const [modal, setModal] = useState(false)
    const [dayinfo, setdayinfo] = useState([])
    const [weeklyscdata, setweeklyscdata] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    const getdata = async () => {
        setIsLoading(true);
        await get(Constants.plans.get_plans, null, { user_id: user.id, date: Moment(`${data.id}-${year}`, 'M-YYYY').format('yyyy-MM') })
            .then((res) => {
                setweeklyscdata(res.data)
            })
            .catch((err) => { })
            .finally(() => {
                setIsLoading(false);
            })
    }

    useEffect(() => {
        getdata()
    }, [])

    const edit = (item) => {
        let data = {
            item: Moment(item).format('yyyy-MM-DD'),
        }
        setdayinfo(data)
        setModal(true)
    }

    const submitedit = async (data) => {
        const body = {
            user_id: user.id,
            city_id: data.city,
            area_id: data.area,
            date: Moment(dayinfo.item).format('yyyy-MM-DD')
        }
        await post(Constants.plans.get_plans, body, null)
            .then((res) => {
                getdata()
            }).catch((err) => {

            }).finally(() => { })
    }

    const alertarea = () => {
        Alert.alert('Please Make Sure that you select an area for that day')
    }
    const weeks = [];


    // Divide days into groups of 7
    for (let i = 0; i < daysInMarch20232.length; i += 7) {
        const weekDays = daysInMarch20232.slice(i, i + 7);
        weeks.push(weekDays);
    }

    return (
        <SafeAreaView style={{ ...styles.container, backgroundColor: '#e3e9e9b3' }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <GoBack text={'Weekly Plan'} isIcon={'calendar-o'} />
                <Text style={style.lale}>{data.name}</Text>

                <View>
                    {weeks.map((weekDays, weekIndex) => {
                        return (
                            <View key={weekIndex} style={style.weekContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 15 }}>
                                    <FontAwesome name='calendar-o' size={18} color="#469ED8" />
                                    <Text style={style.weekHeader}>Week {weekIndex + 1}</Text>
                                </View>
                                <View style={{ width: '100%', height: 1, borderTopWidth: 1, borderStyle: 'dashed', marginBottom: 6 }} />
                                <View style={style.dayContainer}>
                                    {weekDays.map((day, dayIndex) => {
                                        // Check if there's data for the current day in weeklyscdata
                                        const matchingData = weeklyscdata.find(data => Moment(data.date).isSame(day, 'day'));
                                        const areaName = matchingData ? matchingData.area : 'No Area';
                                        const hasDataForDay = matchingData !== undefined;

                                        return (
                                            <TouchableOpacity
                                                key={dayIndex}
                                                style={{
                                                    ...style.dayCard,
                                                    backgroundColor: hasDataForDay ? '#469ED8' : '#7383d1',
                                                }}
                                                onLongPress={() => { edit(day) }}
                                                onPress={() => {
                                                    !hasDataForDay
                                                        ? alertarea()
                                                        : role == 'sales'
                                                            ? navigation.navigate('Daily-sales', {
                                                                title: Moment(day).format('dd  D - M - yyyy'),
                                                                date: Moment(day).format('yyyy-M-D'),
                                                                area: matchingData,
                                                            })
                                                            : navigation.navigate('Daily-notSales', {
                                                                title: Moment(day).format('dd  D - M - yyyy'),
                                                                date: Moment(day).format('yyyy-M-D'),
                                                                area: matchingData,
                                                            });
                                                }}
                                            >
                                                <Text style={style.cardtext}>{Moment(day).format('ddd')}</Text>
                                                <Text style={style.cardtext}>{Moment(day).format('D')}</Text>
                                                {/* Additional content for the day card */}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                                <View style={{ width: '100%', height: 1, borderTopWidth: 1, borderStyle: 'dashed', marginBottom: 6 }} />
                                <View style={{ ...style.dayContainer, marginBottom: 6 }}>
                                    {weekDays.map((day, dayIndex) => {
                                        const matchingData = weeklyscdata.find(data => Moment(data.date).isSame(day, 'day'));
                                        const areaName = matchingData ? matchingData.area : 'No Area';

                                        return (
                                            <TouchableOpacity style={style.dayn} key={dayIndex} onPress={() => { edit(day) }}>
                                                <Text style={style.dayn2}>{areaName}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        );
                    })}
                </View>



            </ScrollView>
            {isLoading && <LoadingScreen />}
            {cityArea && <Weeklyareaedit show={modal} hide={() => { setModal(false) }} data={dayinfo} cityArea={cityArea} submit={(e) => { submitedit(e) }} />}
        </SafeAreaView >
    );
};

export default Weekly;

export const style = StyleSheet.create({
    weekContainer: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#fff',
        marginBottom: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#469ED8',
        shadowColor: "#469ED8",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
    },
    weekHeader: {
        color: '#000',
        fontSize: 18,
        fontWeight: '500',
        marginVertical: 8,
        marginHorizontal: 10
    },
    dayContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    dayCard: {
        width: '12.5%',
        marginHorizontal: '1%',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lale: {
        marginHorizontal: 15,
        marginVertical: 8,
        fontSize: 30,
        textTransform: 'capitalize',
        color: '#000',
        fontWeight: '700',
        textAlign: 'center',
    },
    cardtext: {
        color: '#fff'
    },
    dayn: {
        width: '12.5%',
        marginHorizontal: '1%',
    },
    dayn2: {
        color: '#000',
        textAlign: 'center'
    },
})