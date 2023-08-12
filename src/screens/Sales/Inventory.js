import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../../components/styles';
import GoBack from '../../components/GoBack';
import InventoryTable from '../../components/Tables/InventoryTable';
import Feather from 'react-native-vector-icons/Feather';
import AddNewInventoryModel from '../../components/Modals/AddNewInventoryModel';
import { get } from '../../WebService/RequestBuilder';
import Constants from '../../config/globalConstants';
// import {Dropdown} from 'react-native-element-dropdown';
// import AntDesign from 'react-native-vector-icons/AntDesign';
import ScanBarcodeAndQRModel from '../../components/Modals/ScanBarcodeAndQRModel';

Feather.loadFont();

const Inventory = ({ navigation, item }) => {

  // const area = route.params.area;
  // const [barcode, setBarcode] = useState(); 
  const [modal, setModal] = useState(false);
  const [qrmodal, setqrModal] = useState(false);
  const [rows, setRows] = useState(null);
  // const [productFromBarcode, setProductFromBarcode] = useState(null);
  const [showTable, setShowTable] = useState(false)
  // const [productsData, setProductsData] = useState([])
  // const [productValue, setProductValue] = useState(null)

  // const getProducts = async() => {
  //   get(Constants.product.products, null, {limit: 10000})
  //   .then((res) => { 
  //       var count = Object.keys(res.data).length
  //       let productsArray = []
  //       for (var i = 0; i < count; i++ ){
  //           productsArray.push({
  //            value: res.data[i].id,
  //            label: res.data[i].name
  //           })
  //       }
  //       setProductsData(productsArray);
  //   })
  //   .catch((err) => {})
  //   .finally(() => {
  //   })
  // }

  const getInventory = () => {
    const parms = {
      pharmacy_id: item?.pharmacy_id,
    }
    get(Constants.inventory.get_inventory, null, parms).then((res) => {
      setRows(res.pharamcy_last_order)
    }).catch(() => {

    }).finally(() => {

    });
  }

  useEffect(() => {
    if (item) getInventory();
  }, [item])

  const submit2 = data => {
    // let dataFromModel = {
    //   pharm_id: route.params.item.pharm_id.ph_id,
    //   user_id: route.params.item.user_id,
    //   item_id: data.productValue,
    //   availability: data.availability,
    //   expired_date: data.date,
    //   batch_number: data.batchNumber,
    //   time_of_visit: new Date(),
    // };
    // axios({
    //   method: 'POST',
    //   url: SAL_ADD_IINVENTORY,
    //   data: dataFromModel,
    // })
    //   .then(response => {
    //     getRows();
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   });
  };

  const endEditing = (value) => {
    const parms = {
      seach_term: value,
    }
    if (parms.seach_term != null) {
      get(Constants.product.products, null, parms).then((res) => {
        let status = false;
        rows?.order_details?.forEach(element => {
          if (element.product_id === res.data[0]?.id) {
            status = true
          }
        });
        if (status) {
          setShowTable(true)
        } else {
          setShowTable(false)
          Alert.alert('Not Match')
        }
      }).catch(() => { }).finally(() => { });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <GoBack text={'Inventory'} /> */}

      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
          {/* <Dropdown
          style={style.dropdown}
                  placeholderStyle={style.placeholderStyle}
                  selectedTextStyle={style.selectedTextStyle}
                  inputSearchStyle={style.inputSearchStyle}
                  iconStyle={style.iconStyle}
                  data={productsData}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!productValue ? 'Select Product' : '...'}
                  searchPlaceholder="Search..."
                  value={productValue}
                  onBlur={() => {}}
                  onChange={item => {
                    setProductValue(item.label);
                    endEditing(item.label)
                  }}
                  renderLeftIcon={() => (
                    <AntDesign
                      style={styles.icon}
                      color={productValue ? 'blue' : 'black'}
                      name="Safety"
                      size={20}
                    />
          )}
        /> */}
          <TouchableOpacity
            style={style.newbtn}
            onPress={() => {
              setqrModal(true);
            }}>
            <Text style={{ color: '#fff', fontSize: 18, paddingHorizontal: 5 }}>
              Scan
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: '90%', height: 1, backgroundColor: '#000', alignSelf: 'center', marginVertical: 10, borderRadius: 22 }} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginVertical: 10 }}>
            {showTable ? <InventoryTable data={rows} /> : null}
          </View>
        </ScrollView>

      </View>

      <AddNewInventoryModel
        show={modal}
        hide={() => {
          setModal(false);
        }}
        submit={e => {
          submit2(e);
        }}
      />

      <ScanBarcodeAndQRModel
        show={qrmodal}
        hide={() => {
          setqrModal(false);
        }}
        submit={e => {
          endEditing(e);
        }}
      />
    </SafeAreaView>
  );
};

export default Inventory;

export const style = StyleSheet.create({
  newbtn: {
    backgroundColor: '#7189FF',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginHorizontal: 15,
    height: 40,
  },
  dropdown: {
    height: 42,
    borderColor: '#7189FF',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    width: '50%'
  },
  icon: {
    marginRight: 5,
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
  textinput: {
    height: 60,
    borderColor: 'rgba(37, 50, 116, 0.28)',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
  }
});
