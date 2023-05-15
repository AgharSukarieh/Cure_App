import React from 'react';
import {styles} from '../../components/styles';
import {
    View,
    Text,
    SafeAreaView,
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
  } from 'react-native';
  import GoBack from '../../components/GoBack';
  
const AllGroups = () => {

  return (
    <SafeAreaView style={styles.container}>
      <GoBack text={'Groups'} />
      <Text>All Groups</Text>
    </SafeAreaView>
  );
};

export default AllGroups;