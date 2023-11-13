import {TouchableOpacity,Text,View,StyleSheet,Modal,ScrollView,FlatList,Image, Alert, Platform} from 'react-native';
import React, {useState, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Dropdown} from 'react-native-element-dropdown';
import Input from '../Input';
import GetLocation from 'react-native-get-location';
import {openPicker} from '@baronha/react-native-multiple-image-picker';
import { uploadFiles, post } from '../../WebService/RequestBuilder';
import Constants from '../../config/globalConstants';
import {launchImageLibrary} from 'react-native-image-picker';
import LoadingScreen from '../LoadingScreen';
import RNFetchBlob from 'rn-fetch-blob';

const AddNewPharmacyModel = ({showM, hideM, submit, data}) => {
  const [pharmacyName, setPharmacyName] = useState(null);
  const [classification, setClassification] = useState('');

  const [citiesData, setCitiesData] = useState([]);
  const [cityValue, setCityValue] = useState(null);
  const [areasData, setAreasData] = useState([]);
  const [areaValue, setAreaValue] = useState(null);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [images, setImages] = useState([]);
  const [imagesBase64, setImagesBase64] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const submitData = async () => {
    if (pharmacyName && cityValue && areaValue) {
      setIsLoading(true);
      const bodyData = {
        name: pharmacyName,
        activate_status: 1,
        city_id: cityValue,
        area_id: areaValue,
        classification: classification,
        latitude: latitude,
        longitude: longitude,
        images: imagesBase64
      };
      post(Constants.sales.pharmacy, bodyData).then((res) => {  
        setPharmacyName(null)
        setClassification(null)
        setCityValue(null)
        setAreaValue(null)
        setLatitude(null)
        setLongitude(null)
        setImages([])
        setImagesBase64([])
        hideM()
      }).catch((err) => {
        console.log('....',err);
      }).finally(() => {
        setIsLoading(false);
      })
    } else{
      Alert.alert('pharmacy Name, City and Area is required');
    }
  }

  const getCities = () => {
   if (data) { 
    var count = Object.keys(data?.cities).length
      let cityArray = []
      for (var i = 0; i < count; i++ ){
          cityArray.push({
              value: data.cities[i].id,
              label: data.cities[i].name
          })
        }  
      setCitiesData(cityArray)
      }
  }
 
  const getArea = (id) => {
    const arr = [];
    data.areas.forEach((area) => {
        if (area.city_id == id) {
            arr.push(area);
        }
    });
      var count = Object.keys(arr).length
        let areaArray = []
        for (var i = 0; i < count; i++ ){
          areaArray.push({
                value: arr[i].id,
                label: arr[i].name
            })
        }
        setAreasData(areaArray)
}
 
  const getCurrentLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        setLatitude(location.latitude);
        setLongitude(location.longitude);
      })
      .catch(error => {
        console.warn(code, message);
      });
  };


  // const onPicker = async () => {
  //   try {
  //     const singleSelectedMode = false;
  //     const response = await openPicker({
  //       useCameraButton: true,
  //       selectedAssets: images,
  //       isExportThumbnail: true,
  //       maxVideo: 0,
  //       doneTitle: 'Done',
  //       singleSelectedMode,
  //       isCrop: true,
  //     });
  //     const crop = response.crop;
  //     if (crop) {
  //       response.path = crop.path;
  //       response.width = crop.width;
  //       response.height = crop.height;
  //     }
  //     setImages(response);

  //     const baseArray = await Promise.all(response.map(async (img) => {
  //       const data = await fetch(img.path);
  //       const blob = await data.blob();
  //       return new Promise((resolve) => {
  //         const reader = new FileReader();
  //         reader.readAsDataURL(blob);
  //         reader.onloadend = () => {
  //           const base64data = reader.result;
  //           resolve(base64data);
  //         };
  //       });
  //     }));

  //     setImagesBase64(baseArray);
  //     console.log('....', baseArray.length);
  //   } catch (e) {}
  // };

  const onPicker = async () => {
    try {
      const singleSelectedMode = true;
      const response = await openPicker({
        selectedAssets: images,
        isExportThumbnail: true,
        maxVideo: 1,
        doneTitle: 'Done',
        singleSelectedMode,
        isCrop: false,
      });
      const crop = response.crop;
      if (crop) {
        response.path = crop.path;
        response.width = crop.width;
        response.height = crop.height;
      }

      setImages([response])
      let arr = [response]

      if (Platform.OS === 'ios') {
        const base = await Promise.all(arr.map(async (img) => {
          console.log(arr[0].path);
          const data = await fetch(arr[0].path);
          const blob = await data.blob();
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              const base64data = reader.result;
              resolve(base64data);
            };
          });
        }));
        setImagesBase64([base])
      } else {
        getImageBaser64ToAndroid(arr[0].realPath)
        .then((base64Image) => {
          if (base64Image) {
            setImagesBase64([base64Image])
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      }
     
    } catch (e) {
      console.log('e', e);
     }
  };

  const getImageBaser64ToAndroid = async (imagePath) => {
    try {
      const base64Data = await RNFetchBlob.fs.readFile(imagePath, 'base64');
      return base64Data;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  };

  useEffect(() => {
    getCities()
  }, [])

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showM}
      coverScreen={false}
      >
      <View style={styles.ModalContainer}>
        <View style={styles.ModalView}>

          <TouchableOpacity
            onPress={() => {
              submit(null);
              hideM();
            }}>
            <AntDesign
              name="close"
              color="#7189FF"
              size={35}
              style={{alignSelf: 'flex-end'}}
            />
          </TouchableOpacity>

          <View style={{marginVertical: 10}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>

                <View style={styles.container}>
                 <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={citiesData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!cityValue ? 'Select City' : '...'}
              searchPlaceholder="Search..."
              value={cityValue}
              onBlur={() => {}}
              onChange={item => {
                setCityValue(item.value);
                getArea(item.value);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color={cityValue ? 'blue' : 'black'}
                  name="Safety"
                  size={20}
                />
              )}
            />
                </View>

                <View style={{...styles.container, marginTop: 40}}>
                <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={areasData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!areaValue ? 'Select Area' : '...'}
              searchPlaceholder="Search..."
              value={areaValue}
              onBlur={() => {}}
              onChange={item => {
                setAreaValue(item.value);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color={areaValue ? 'blue' : 'black'}
                  name="Safety"
                  size={20}
                />
              )}
            />
                </View>

                <Input
                  lable={'Pharmacy Name'}
                  setData={setPharmacyName}
                  style={{...styles.inputModel, backgroundColor: 'white'}}
                  value={pharmacyName}
                  viewStyle={{width: '90%'}}
                />

                <Input
                  lable={'Classification'}
                  setData={setClassification}
                  style={{...styles.inputModel, backgroundColor: 'white'}}
                  value={classification}
                  viewStyle={{width: '90%'}}
                />

                <TouchableOpacity style={{marginTop: 40, width: '90%',height: 50, backgroundColor: latitude ? '#7189FF' : '#fff', borderWidth:2,borderColor: '#7189FF',borderRadius:5, justifyContent:'center'}} onPress={() => {getCurrentLocation()}}>
                  <Text style={{marginBottom: 5, color: latitude ? '#fff' : '#7189FF', textAlign:'center', fontSize:17, fontWeight:'bold'}}>
                    Location
                  </Text>
                </TouchableOpacity>

                <View
                  style={{
                    ...styles.container,
                    justifyContent: 'center',
                    marginTop: 30,
                  }}>
                  <TouchableOpacity
                    style={{
                      ...styles.newbtn,
                      backgroundColor: 'white',
                      borderColor: '#7189FF',
                      borderWidth: 2,
                    }}
                    onPress={() => {
                      onPicker();
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          color: '#7189FF',
                          fontSize: 18,
                          paddingHorizontal: 50,
                          textAlign: 'center',
                          fontWeight: 'bold',
                        }}>
                        Attachments
                      </Text>
                      <AntDesign
                        style={styles.icon}
                        color={images.length > 0 ? 'blue' : 'black'}
                        name="pluscircle"
                        size={25}
                      />
                    </View>
                  </TouchableOpacity>

                  <FlatList
                    horizontal={true}
                    data={images}
                    renderItem={({item}) => (
                      <View key={item.position}>
                        <Image
                        key={item.position}
                          style={{
                            height: 80,
                            width: 80,
                            marginRight: 5,
                            borderRadius: 7,
                          }}
                          source={{ uri: Platform.OS === 'ios' ? images[0].path : `file://${images[0].realPath}` }}
                        />

                        <TouchableOpacity
                          key={item.position}
                            style={{position: 'absolute', top: 5, right: 5}}
                            onPress={async () => {
                              // const arr = images.filter(
                              //   items =>
                              //     items.localIdentifier !== item.localIdentifier,
                              // );
                              // setImages(arr);
                              setImages([]);
                            //   const baseArray = await Promise.all(arr.map(async (img) => {
                            //   const data = await fetch(img.path);
                            //   const blob = await data.blob();
                            //   return new Promise((resolve) => {
                            //     const reader = new FileReader();
                            //     reader.readAsDataURL(blob);
                            //     reader.onloadend = () => {
                            //       const base64data = reader.result;
                            //       resolve(base64data);
                            //     };
                            //   });
                            // }));

                            // setImagesBase64(baseArray.length > 0 ? baseArray : []);
                            setImagesBase64([]);
                            // console.log('....', baseArray);
                          }}>
                          <AntDesign
                            style={styles.icon}
                            color={'red'}
                            name="minuscircle"
                            size={25}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                    // keyExtractor={item => item.position}
                  />
                </View>

                <View
                  style={{
                    ...styles.container,
                    justifyContent: 'center',
                    marginTop: 30,
                    marginBottom: 70,
                  }}>
                  <TouchableOpacity
                    style={styles.newbtn}
                    onPress={() => {
                      submitData();
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 18,
                        paddingHorizontal: 50,
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>

              </View>
            </ScrollView>
          </View>
        </View>
      </View>
      {isLoading && <LoadingScreen />}
    </Modal>
  );
};

export default AddNewPharmacyModel;

const styles = StyleSheet.create({
  iconPassword: {
    position: 'absolute',
    right: '3%',
    height: 35,
    width: 35,
  },
  container: {
    backgroundColor: 'white',
    width: '90%',
    marginTop: 15,
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
  ModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0707078c',
    
  },
  ModalView: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '95%',
    height: '75%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 20,
    overflow: 'hidden'
  },
  card: {
    shadowColor: '#7189FF',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    width: '99%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
    borderRadius: 7,
  },
  phname: {
    fontSize: 25,
    textTransform: 'capitalize',
    color: '#7189FF',
  },
  phlocation: {
    marginHorizontal: 15,
    marginVertical: 5,
    fontSize: 16,
  },
  item_name: {
    fontSize: 20,
    textTransform: 'capitalize',
    color: '#7189FF',
  },
  item_info: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  item_itemtitle: {
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  newbtn: {
    backgroundColor: '#7189FF',
    height: 50,
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderRadius: 7,
    justifyContent: 'center',
    marginVertical: 20,
  },
  inputModel: {
    height: 40,
    borderColor: '#7189FF',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
  },
});
