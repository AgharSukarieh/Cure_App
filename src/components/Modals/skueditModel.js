import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SelectDropdown from 'react-native-select-dropdown';
import Feather from 'react-native-vector-icons/Feather';
import { styles } from '../styles';
import moment from 'moment';
import Constants from '../../config/globalConstants';
import { put } from '../../WebService/RequestBuilder';
import GetLocation from 'react-native-get-location';

const SkueditModel = ({ show, hide, submit, data }) => {

  console.log('====================================');
  console.log('sdsd', data?.id);
  console.log('====================================');
  const [location, setlocation] = useState([]);
  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        setlocation(location);
      })
      .catch(error => {
        console.log(error);
      });
  }, [])

  const endVisit = async () => {
    const data = {
      "longitude": location.longitude,
      "latitude": location.latitude
    }
    await put(Constants.visit.medical + `/${data?.id}`, data, data)
      .then((res) => {
        console.log('====================================');
        console.log('res', res);
        console.log('====================================');
        hide();
      })
      .catch((err) => { })
      .finally(() => { })


  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      coverScreen={false}
      onSwipeComplete={() => setModalVisible2(false)}>
      <View style={style.ModalContainer}>
        <View style={style.ModalView}>
          <TouchableOpacity
            onPress={() => {
              hide();
            }}>
            <AntDesign
              name="close"
              color="#469ED8"
              size={35}
              style={{ alignSelf: 'flex-end' }}
            />
          </TouchableOpacity>

          <View style={{ marginVertical: 20, width: '65%', alignSelf: 'center' }}>
            <Text style={{ textAlign: 'center', fontSize: 22, color: '#000', fontWeight: '600' }}>Are you sure you want to end this visit?</Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ marginVertical: 10, alignItems: 'center' }}>
              {
                !data?.end_visit ?
                  <TouchableOpacity
                    style={style.endVisitBtn}
                    onPress={() => {
                      endVisit()
                    }}>
                    <Text style={styles.reportPageText}>End Visit</Text>
                  </TouchableOpacity>
                  :
                  null
              }
              <TouchableOpacity style={style.cancelBtn} onPress={() => { hide(); }}>
                <Text style={styles.reportPageText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default SkueditModel;

const style = StyleSheet.create({
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
    height: '40%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 20,
  },
  maintitle: {
    fontSize: 25,
    textTransform: 'capitalize',
    color: '#469ED8',
  },
  card: {
    marginVertical: 15,
    width: '100%',
  },
  lable: {
    marginBottom: 5,
    fontSize: 16,
    color: '#000',
    textTransform: 'capitalize',
  },
  endVisitBtn: {
    backgroundColor: '#D63A69',
    paddingVertical: 13,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 20
  },
  cancelBtn: {
    backgroundColor: '#3A97D6',
    paddingVertical: 6,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 20
  }
});
