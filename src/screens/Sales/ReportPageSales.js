import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Modal, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { styles } from '../../components/styles';
import TopView from '../../components/TopView';
import { useNavigation } from '@react-navigation/native';

const ReportPageSales = () => {

  const [name, setName] = useState('Mahammed Farhan');
  const date = new Date().toLocaleDateString();

  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TopView text={'Report Page'} />

        <View style={styles.nameDateContainer}>
          <Text style={styles.leftText}>{name}</Text>
          <Text style={styles.rightText}>{date}</Text>
        </View>
        <View style={styles.nameDateContainer}>
          <Text style={styles.leftText}>Location : Jabale AlWeibdeh</Text>
        </View>
        <View style={styles.nameDateContainer}>
          <Text style={styles.leftText}>supervisor : Waleed</Text>
        </View>

        <View style={styles.reportPageContainer}>
          <TouchableOpacity style={styles.reportPageButton} onPress={() => navigation.navigate('Sales')}>
            <Text style={styles.reportPageText}>Sales</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportPageButton} onPress={() => navigation.navigate('Monthly')}>
            <Text style={styles.reportPageText}>Monthly Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportPageButton} onPress={() => { navigation.navigate('Clientlist') }}>
            <Text style={styles.reportPageText}>Client List</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportPageButton} onPress={() => { navigation.navigate('Chat') }}>
            <Text style={styles.reportPageText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportPageButton} onPress={() => { }}>
            <Text style={styles.reportPageText}>Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportPageButton} onPress={() => { }}>
            <Text style={styles.reportPageText}>Test</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.reportPageButton} onPress={() => { }}>
            <Text style={styles.reportPageText}>Test</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        coverScreen={false}
        onSwipeComplete={() => setModalVisible(false)}
      >
        <View style={style.ModalContainer}>
          <View style={style.ModalView}>

            <Text style={{ textAlign: 'center', fontWeight: '600', fontSize: 20 }}>your account has been set successfully</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ReportPageSales;


const style = StyleSheet.create({
  ModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0707078c',
  },
  ModalView: {
    backgroundColor: "white",
    borderRadius: 20,
    width: '90%',
    paddingVertical: 40,
    paddingHorizontal: '15%',
    alignItems: "center",
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});
