import React, {useState} from 'react';
import {View, TextInput, StyleSheet, Image, FlatList} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {openPicker} from '@baronha/react-native-multiple-image-picker';
import GetLocation from 'react-native-get-location';
import {useNavigation} from '@react-navigation/native';
import MapMH from './Map'

const InputBox = () => {
  const navigation = useNavigation();
  const [newMessage, setNewMessage] = useState('');
  const [images, setImages] = useState([]);

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const onSend = () => {
    console.warn('Sending a new message: ', newMessage);
    setNewMessage('');
    setImages([]);
    setLatitude('');
    setLongitude('');
  };

  const onLocation = () => {
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

  const onPicker = async () => {
    try {
      const singleSelectedMode = false;
      const response = await openPicker({
        useCameraButton: true,
        selectedAssets: images,
        isExportThumbnail: true,
        maxVideo: 0,
        doneTitle: 'Done',
        singleSelectedMode,
        isCrop: true,
      });
      const crop = response.crop;
      if (crop) {
        response.path = crop.path;
        response.width = crop.width;
        response.height = crop.height;
      }
      setImages(response);
      console.log(response);
    } catch (e) {}
  };

  return (
    <>
    {latitude !== '' && longitude !== '' && (
      <View style={{...styles.attachmentsContainer, marginBottom:5}}>
        <MapMH lat={latitude} longitude={longitude} style={styles.selectedImage}/>
        <MaterialIcons
                name="highlight-remove"
                onPress={() => {
                  setLatitude('');
                  setLongitude('');
                }}
                size={35}
                color="gray"
                style={{...styles.removeSelectedImage}}
        />
      </View>
    )} 

      {images.length > 0 && (
        <FlatList
          horizontal={true}
          data={images}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.attachmentsContainer}>
              <Image
                source={{uri: item.path}}
                style={styles.selectedImage}
                resizeMode="contain"
              />
              <MaterialIcons
                name="highlight-remove"
                onPress={() => {
                  const arr = images.filter(
                    items => items.localIdentifier !== item.localIdentifier,
                  );
                  setImages(arr);
                }}
                size={20}
                color="gray"
                style={styles.removeSelectedImage}
              />
            </View>
          )}
        />
      )}
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <AntDesign
          onPress={onPicker}
          name="plus"
          size={24}
          color="royalblue"
          style={{marginRight: 10}}
        />
        <AntDesign
          onPress={onLocation}
          name="enviromento"
          size={24}
          color="royalblue"
        />
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          style={styles.input}
          // multiline
          placeholder="Enter your message..."
        />
        <MaterialIcons
          onPress={onSend}
          style={styles.send}
          name="send"
          size={16}
          color="white"
        />
      </SafeAreaView>
    </>
  );
};

export default InputBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'whitesmoke',
    padding: 5,
    alignItems: 'center',
  },
  input: {
    fontSize: 18,

    flex: 1,
    backgroundColor: 'white',
    padding: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,

    borderRadius: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'lightgray',
  },
  send: {
    backgroundColor: 'royalblue',
    padding: 7,
    borderRadius: 15,
    overflow: 'hidden',
  },
  attachmentsContainer: {
    alignItems: 'flex-end',
  },
  selectedImage: {
    height: 100,
    width: 200,
    margin: 5,
    borderRadius: 10,
  },
  removeSelectedImage: {
    position: 'absolute',
    right: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
});
