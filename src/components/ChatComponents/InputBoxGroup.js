import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, FlatList } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { openPicker } from '@baronha/react-native-multiple-image-picker';
import GetLocation from 'react-native-get-location';
import { useNavigation } from '@react-navigation/native';
import MapMH from './Map';
import axios from 'axios';
import { POST_ADD_MESSAGE, POST_GROUP_MESSAGE } from '../../Provider/ApiRequest';
import { useAuth } from '../../contexts/AuthContext';
import { post } from '../../WebService/RequestBuilder';
import globalConstants from '../../config/globalConstants';

const InputBox = ({ receiverID, submit }) => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [newMessage, setNewMessage] = useState('');
  const [images, setImages] = useState('');
  const [baseimages, setbaseimages] = useState([]);

  // console.log('baseimages', baseimages);
  const currentTimeStamp = () => {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    return timestamp;
  };
  const timestamp = currentTimeStamp();
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const uploadImages = async (baseimages) => {
    try {
      let data = {
        text: '',
        receiver_id: receiverID,
        attachmentUrl: baseimages,
        attachmentName: timestamp + '.png'

      };
      axios({
        method: 'POST',
        url: POST_GROUP_MESSAGE,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        data: data,
      })
        .then(response => {
          console.log('DONE', response?.data.message);
          submit(response?.data.message)
          setImages('')
          setbaseimages('')
        })
        .catch(error => {
          console.log(
            '🚀 ~ file: ChatScreen.js ~~ InputBox.js ~~ line 49 ~ uploadImages ~ error',
            error,
          );
        });
    } catch (error) {
      console.error(error);
    }
  };

  const onSend = () => {
    if (newMessage.length > 0 || baseimages.length > 0 || longitude) {
      if (baseimages.length > 0) {
        console.log('-----');
        uploadImages(baseimages);
      } else {
        let data = {
          receiver_id: receiverID,
          latitude: latitude,
          longitude: longitude,
          text: newMessage,
        };
        post(globalConstants.group_chat.send_mess, data, null).then((res) => {
          submit(res.message)
          setNewMessage('');
          setImages('');
          setLatitude('');
          setLongitude('');
        }).catch((err) => {
          console.log(err);
        })
      }
    }
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


      setImages(response[0]);
      const baseArray = await Promise.all(response.map(async (img) => {
        const data = await fetch('file://' + img.path);
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
      setbaseimages(baseArray[0])

    } catch (e) { }

  };

  return (
    <>
      {latitude !== '' && longitude !== '' && (
        <View style={{ ...styles.attachmentsContainer, marginBottom: 0 }}>
          <MapMH lat={latitude} long={longitude} style={styles.selectedImage} />
          <MaterialIcons
            name="highlight-remove"
            onPress={() => {
              setLatitude('');
              setLongitude('');
            }}
            size={35}
            color="gray"
            style={{ ...styles.removeSelectedImage }}
          />
        </View>
      )}

      {baseimages.length > 0 && (

        <View style={styles.attachmentsContainer}>
          <Image
            source={{ uri: baseimages }}
            style={styles.selectedImage}
            resizeMode="contain"
          />
          <MaterialIcons
            name="highlight-remove"
            onPress={async () => {
              setLatitude('');
              setLongitude('');
            }}
            size={20}
            color="gray"
            style={styles.removeSelectedImage}
          />
        </View>
      )}
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <AntDesign
          onPress={onPicker}
          name="plus"
          size={24}
          color="royalblue"
          style={{ marginRight: 10 }}
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
