import React from "react"
import { styles } from "../components/styles";
import { View, Image, StyleSheet, Text, SafeAreaView, ImageBackground, TouchableOpacity } from "react-native";


const FirstScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={style.container}>
                <View style={{ height: '70%', width: '100%', }}>
                    <ImageBackground source={require('../../assets/fback.png')} style={{ width: '100%', height: '100%', }} resizeMode="stretch" >
                        <View style={{ width: '100%', height: '50%', justifyContent:"center", alignItems: 'center'}}>
                            <Image source={require('../../assets/logo2.png')} style={{ width: 150, height: 150}} resizeMode="contain" />
                        </View>
                        <Text style={style.header}>Best Medical Reps App</Text>
                        <Text style={style.textbody}>Are you a medical representative looking to revolutionize your sales and stay ahead in the highly competitive pharmaceutical and healthcare industry? Look no further! MedRep Connect is the all-in-one app designed exclusively for medical representatives like you, bringing efficiency, convenience, and success right to your fingertips.</Text>
                    </ImageBackground>
                </View>
                <View style={{ height: '30%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity style={style.btn} onPress={() => { navigation.navigate('SignIn') }}>
                        <Text style={style.btnText}>GET STARTED</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container: { flex: 1, height: '100%', width: '100%', },
    header: { textAlign: 'center', color: '#fff', fontSize: 20, marginBottom: 16 },
    textbody: { textAlign: 'center', color: '#fff', fontSize: 16, },
    btn: { width: '70%', paddingVertical: 15, backgroundColor: '#3A97D6', alignItems: 'center', borderRadius: 10 },
    btnText: { color: '#fff', fontSize: 18 },
});

export default FirstScreen