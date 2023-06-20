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

const Weekly = ({ navigation, route }) => {
    const {user, role} = useAuth();
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
        await get(Constants.plans.get_plans, null, {user_id: user.id, date: Moment(`${data.id}-${year}`, 'M-YYYY').format('yyyy-MM')} )
        .then((res) => {
            setweeklyscdata(res.data)
        })
        .catch((err) => {})
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
        await post(Constants.plans.get_plans, body,null)
        .then((res) => {
            getdata()
        }).catch((err) => {

        }).finally(() => {})
    }

    const alertarea = () => {
        Alert.alert('Please Make Sure that you select an area for that day')
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
                        const areaName = matchingData ? matchingData.area : 'No Area';
                        // const areaid = matchingData?.area_id
                        
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
                                            : role == 'sales' ? navigation.navigate('Daily-sales', { title: Moment(item).format('dd  D - M - yyyy'), date: Moment(item).format('yyyy-M-D'), area: matchingData }) 
                                            : 
                                            navigation.navigate('Daily-notSales', { title: Moment(item).format('dd  D - M - yyyy'), date: Moment(item).format('yyyy-M-D'), area: matchingData })
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
            {isLoading && <LoadingScreen />}
            <Weeklyareaedit show={modal} hide={() => { setModal(false) }} data={dayinfo} cityArea = {cityArea} submit={(e) => { submitedit(e) }} />
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