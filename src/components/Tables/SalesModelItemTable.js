import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';

const SalesModelItemTable = ({item}) => {

  return (
    <View style={styles.card}>
      <Text style={styles.item_name}>{item?.name}</Text>
      <View
        style={{
          width: '99%',
          height: 0.5,
          backgroundColor: '#7189FF',
          alignSelf: 'center',
          marginVertical: 10,
          borderRadius: 22,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 15,
        }}>

        <View style={styles.item_info}>
          <Text style={styles.item_itemtitle}>Amount</Text>
          <Text style={styles.item_item}>{item?.units}</Text>
        </View>

        <View style={styles.item_info}>
          <Text style={styles.item_itemtitle}>Bonus</Text>
          <Text style={styles.item_item}>{item?.bonuse}</Text>
        </View>

        <View style={styles.item_info}>
          <Text style={styles.item_itemtitle}>Price</Text>
          <Text style={styles.item_item}>{item?.price}</Text>
        </View>

        <View style={styles.item_info}>
          <Text style={styles.item_itemtitle}>Price Tax</Text>
          <Text style={styles.item_item}>{item?.price_tax}</Text>
        </View>

      </View>
    </View>
  );
};

export default SalesModelItemTable;

const styles = StyleSheet.create({
    card: {
        shadowColor: "#7189FF",
        shadowOffset: { width: 0, height: 1, },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        width: '99%',
        alignSelf: 'center',
        backgroundColor: '#fff',
        padding: 10,
        margin: 5,
        borderRadius: 7
    },
    phname: {
        fontSize: 25,
        textTransform: 'capitalize',
        color: '#7189FF',
        textAlign:'center'
    },
    phlocation: {
        marginHorizontal: 15,
        marginVertical: 5,
        fontSize: 16,
    },
    item_name: {
        fontSize: 20,
        textTransform: 'capitalize',
        color: '#7189FF'
    },
    item_info: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    item_itemtitle: {
        marginBottom: 5,
        textTransform: 'capitalize',
    },
    item_item: {

    }
});
