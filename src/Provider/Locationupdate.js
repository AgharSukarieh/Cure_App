import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { UPDATE_LOCATION } from './ApiRequest';
import axios from 'axios';


const Locationupdate = async () => {

    const [location, setLocation] = useState(false);

    const a = await AsyncStorage.getItem('userInfo')
    let user = (JSON.parse(a))
    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Geolocation Permission',
                    message: 'Can we access your location?',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === 'granted') {
                return true;
            } else {
                console.log('You cannot use Geolocation');
                return false;
            }
        } catch (err) {
            return false;
        }
    };


    const watchPosition = async () => {
        const result = requestLocationPermission();
        result.then(res => {
            if (res) {
                Geolocation.getCurrentPosition(
                    position => {
                        updatelocation(position)
                    },
                    error => {
                        // See error code charts below.
                        console.log(error.code, error.message);
                        setLocation(false);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                );
            } else {
                console.log('----------------------');
            }
        });
    }

    const updatelocation = async (position) => {

        let data = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            userid: user.id
        }
        axios({
            method: "POST",
            url: UPDATE_LOCATION,
            data: data
        }).then((response) => {
            // console.log('response', response.data)
        }).catch((error) => { console.log("🚀 ~ file: Locationupdate.js ~ line 72 ~ updatelocation ~ error", error) })

    }

    setInterval(() => {
        if (user) {
            watchPosition()
        } else {
            console.log('no user');
        }
    }, 20000);
}

export default Locationupdate