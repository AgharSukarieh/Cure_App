import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { styles } from '../../components/styles';
import moment from 'moment';
import GoBack from '../../components/GoBack';
import DailySalesaddModel from '../../components/Modals/DailySalesaddModel';
import DailySalesTable from '../../components/Tables/DailyTableSales';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Constants from '../../config/globalConstants';
import { get } from '../../WebService/RequestBuilder';
import LoadingScreen from '../../components/LoadingScreen';

const DailySales = ({ navigation, route }) => {
    const {user} = useAuth();
    const title = route.params.title
    const date = route.params.date
    const area = route.params.area
    const [isLoading, setIsLoading] = useState(true);
    const [modal, setModal] = useState(false)
    const [rows, setrows] = useState([])

    const getpharmacys = async() => {
        const params = {
            start_visit: moment(date, 'YYYY-M-D').format('YYYY-MM-DD'),
            sale_id: user.sales.id,
            limit: 500
        }
        get(Constants.visit.sales, null, params)
        .then((res) => {
            setrows(res.data)
        })
        .catch((err) => {})
        .finally(() => {
            setIsLoading(false)
        })
    }

    useEffect(() => {
        getpharmacys()
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <GoBack text={title} />

                <View style={{ marginVertical: 30 }}>

                    {moment(date, 'YYYY-M-D').format('YYYY-MM-DD') == moment().format('YYYY-MM-DD') ? <TouchableOpacity style={style.newbtn} onPress={() => { setModal(true) }}>
                        <Text style={{ color: '#fff', fontSize: 18 }}>Add Pharmacy</Text>
                    </TouchableOpacity> : null}

                    <View style={style.div}>
                        {rows && rows.map((item, index) => (
                            <TouchableOpacity key={index} style={style.card} onPress={() => { navigation.navigate('Sal_rep_pharm', { item: item, area: area, date: date });
                             }}>
                                <Text style={{ color: "#fff", fontSize: 17, fontWeight: '700' }}>{item?.name}</Text>
                            </TouchableOpacity>

                        ))}
                    </View>

                </View>

            </ScrollView>

            <DailySalesaddModel show={modal} hide={() => { setModal(false) }} submit={() => { getpharmacys() }} date={date} area={area}/>

            {isLoading && <LoadingScreen />}
        </SafeAreaView >
    );
};

export default DailySales;

export const style = StyleSheet.create({
    div: { flexDirection: 'row', flexWrap: 'wrap', width: '90%', justifyContent: 'space-between', alignSelf: 'center', marginTop: 25 },
    card: {
        width: '48%',
        backgroundColor: '#7189FF',
        height: 80,
        marginBottom: 15,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
    },
    newbtn: {
        backgroundColor: '#7189FF',
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginHorizontal: 15
    }
})