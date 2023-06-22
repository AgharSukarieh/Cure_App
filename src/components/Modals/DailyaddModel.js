import { TouchableOpacity, Text, View, StyleSheet, Alert, Modal, ScrollView, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { styles } from '../styles';
import Constants from '../../config/globalConstants';
import { get, post } from '../../WebService/RequestBuilder';
import { useAuth } from '../../contexts/AuthContext';
import {MultiSelect, Dropdown} from 'react-native-element-dropdown';

const DailyaddModel = ({ show, hide, area, submit, date }) => {
    const {user} = useAuth();
    const [selected, setSelected] = useState([]);
    const [productData, setProductData] = useState([])
    const [specialitiesData, setSpecialitiesData] = useState([])
    const [specialitiesValue, setSpecialitiesValue] = useState(null);
    const [doctorsData, setDoctorsData] = useState([])
    const [doctorsValue, setDoctorsValue] = useState(null);
    const [note, setnote] = useState('')
    const [textInputHeight, setTextInputHeight] = useState(40);
    
    const handleContentSizeChange = (event) => {
        const { height } = event.nativeEvent.contentSize;
        setTextInputHeight(height);
    };

    const currentTime = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });

    const getSpecialities = async() => {
        get(Constants.doctor.speciality)
        .then((res) => {
            var count = Object.keys(res.speciality).length
            let specialitiesArray = []
            for (var i = 0; i < count; i++ ){
                specialitiesArray.push({
                 value: res.speciality[i].id,
                 label: res.speciality[i].name
                })
            }
            setSpecialitiesData(specialitiesArray);
        })
        .catch((err) => {})
        .finally(() => {
        })
    }

    const getDoctors = async() => {
        get(Constants.doctor.allDoctors, null, {user_id: user.id, area_id: area.area_id, limit: 1000, seach_term: specialitiesValue})
        .then((res) => {
            var count = Object.keys(res.data).length
            let doctorsArray = []
            for (var i = 0; i < count; i++ ){
                doctorsArray.push({
                 value: res.data[i].id,
                 label: res.data[i].name
                })
            }
            setDoctorsData(doctorsArray);
        })
        .catch((err) => {})
        .finally(() => {
        })
    }

    const getProducts = async() => {
        get(Constants.product.products, null, {limit: 10000})
        .then((res) => { 
            var count = Object.keys(res.data).length
            let productsArray = []
            for (var i = 0; i < count; i++ ){
                productsArray.push({
                 value: res.data[i].id,
                 label: res.data[i].name
                })
            }
            setProductData(productsArray);
        })
        .catch((err) => {})
        .finally(() => {
        })
    }

    const submit2 = () => {
        const data = {
            medical_id: user?.medicals.id,
            doctor_id: doctorsValue,
            notes: note
        }
        post(Constants.visit.medical, data).then((res) => {
          console.log('@@@@@@@@@@@@@@@@@@@@', res);
            if (res.code == 200) {
                console.log('#@#@#', res);
                const sampleProductsData = {
                    visit_id: res.id,
                    'product_ids[]': selected
                }
                post(Constants.product.sample_products, sampleProductsData).then((res) => {
                    
                }).catch((err) => {}).finally(() => {})
            }else {
                Alert.alert(res.message || 'Error');
            } 
        }).catch((err) => {}).finally(() => {
            hide();
        })
    }

    useEffect(() => {
        getSpecialities()
        getProducts();
    }, []);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={show}
            coverScreen={false}
            onSwipeComplete={() => setModalVisible2(false)}
        >
            <View style={style.ModalContainer}>
                <View style={style.ModalView}>

                    <TouchableOpacity onPress={() => { hide() }}>
                        <AntDesign name="close" color='#7189FF' size={35} style={{ alignSelf: 'flex-end' }} />
                    </TouchableOpacity>

                    <Text style={style.maintitle}>Add new</Text>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ marginVertical: 10 }}>                        
                            <View style={style.container}>
            <Dropdown
              style={style.dropdown}
              placeholderStyle={style.placeholderStyle}
              selectedTextStyle={style.selectedTextStyle}
              inputSearchStyle={style.inputSearchStyle}
              iconStyle={style.iconStyle}
              data={specialitiesData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!specialitiesValue ? 'Select speciality' : '...'}
              searchPlaceholder="Search..."
              value={specialitiesValue}
              onBlur={() => {}}
              onChange={item => {
                setSpecialitiesValue(item.value);
                getDoctors();
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color={specialitiesValue ? 'blue' : 'black'}
                  name="Safety"
                  size={20}
                />
              )}
            />
                            </View>

                            <View style={style.container}>
            <Dropdown
              style={style.dropdown}
              placeholderStyle={style.placeholderStyle}
              selectedTextStyle={style.selectedTextStyle}
              inputSearchStyle={style.inputSearchStyle}
              iconStyle={style.iconStyle}
              data={doctorsData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!doctorsValue ? 'Select doctor' : '...'}
              searchPlaceholder="Search..."
              value={doctorsValue}
              onBlur={() => {}}
              onChange={item => {
                setDoctorsValue(item.value);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color={doctorsValue ? 'blue' : 'black'}
                  name="Safety"
                  size={20}
                />
              )}
            />
                            </View>

                            <View style={style.container}>
            <MultiSelect
              style={style.dropdown}
              placeholderStyle={style.placeholderStyle}
              selectedStyle={style.selectedStyle}
              selectedTextStyle={style.selectedTextStyle}
              inputSearchStyle={style.inputSearchStyle}
              iconStyle={style.iconStyle}
              data={productData}
              search
              labelField="label"
              valueField="value"
              placeholder={'Select Products'}
              searchPlaceholder="Search..."
              value={selected}
              onBlur={() => {}}
              onChange={item => {
                // if (selected.length <= 2) {
                    setSelected(item);
                // }
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color={'blue'}
                  name="Safety"
                  size={20}
                />
              )}
            />
                            </View>
                            
                            <View style={style.card}>
                                <Text style={style.lable}>note</Text>
                                <TextInput
                                    onChangeText={(text) => { setnote(text) }}
                                    placeholder='Note'
                                    style={{ ...styles.drop, height: textInputHeight, paddingHorizontal: 10 }}
                                    maxLength={300}
                                    multiline
                                    numberOfLines={10}
                                    textAlignVertical='top'
                                    onContentSizeChange={handleContentSizeChange}
                                />
                            </View>

                            <View style={style.card}>
                                <TouchableOpacity style={styles.btn} onPress={() => { submit2() }}>
                                    <Text style={{ fontSize: 18, fontWeight: '700', textTransform: 'capitalize', color: '#fff' }}>Start Visit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>

                </View>
            </View>
        </Modal>
    );
};

export default DailyaddModel;

const style = StyleSheet.create({
    ModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0707078c',
    },
    ModalView: {
        backgroundColor: "#fff",
        borderRadius: 10,
        width: '95%',
        height: '90%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        padding: 20
    },
    maintitle: {
        fontSize: 25,
        textTransform: 'capitalize',
        color: '#7189FF'
    },
    card: {
        marginVertical: 15,
        width: '100%',
    },
    lable: {
        marginBottom: 5,
        fontSize: 16,
        color: '#000',
        textTransform: 'capitalize'
    },

    container: {
        backgroundColor: 'white',
        width: '100%',
        marginTop: 30
      },
      dropdown: {
        height: 50,
        borderColor: '#7189FF',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
      },
      icon: {
        marginRight: 5,
      },
      label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
      },
      placeholderStyle: {
        fontSize: 16,
      },
      selectedTextStyle: {
        fontSize: 16,
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
      selectedStyle:{
        borderRadius: 7,
        borderWidth:1
      }
})