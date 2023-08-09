import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import { styles } from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const date = new Date().toLocaleDateString();

const HomeHeader = ({ username, supervisorname }) => {
    return (
        <View style={style.container}>
            <View style={style.imagediv}>
                <Image source={require('../../assets/logo2.png')} style={{ height: '100%', width: '100%', }} resizeMode='contain' />
            </View>
            <View style={style.viewdiv}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <FontAwesome name="user-circle-o" size={26} color="#ffff" />
                    <Text style={style.textName}>{username}</Text>
                </View>
                <View style={{}}>
                    <Text style={style.textName}>{date}</Text>
                </View>
            </View>
            <View style={style.viewdiv}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <FontAwesome name="user-circle-o" size={26} color="#ffff" />
                    <Text style={style.textName}>Supervisor: {supervisorname}</Text>
                </View>
            </View>
        </View>
    );
};


const style = StyleSheet.create({
    container: { width: '100%', height: 200, paddingTop: 10, backgroundColor: '#27374A', borderBottomStartRadius: 80, borderBottomEndRadius: 80 },
    imagediv: {
        height: '40%',
        width: '100%',
    },
    viewdiv: {
        width: '80%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    textName: { color: '#fff', marginHorizontal: 10, fontSize: 16, fontWeight: '500' }
})
export default HomeHeader;
