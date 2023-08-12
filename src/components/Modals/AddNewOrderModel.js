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
import { styles } from '../styles';
import moment from 'moment';
import Input from '../Input';
import { Dropdown } from 'react-native-element-dropdown';
import OrdersAfterAddTable from '../../components/Tables/OrdersAfterAddTable';
import Constants from '../../config/globalConstants';
import { get, post } from '../../WebService/RequestBuilder';
import { useAuth } from '../../contexts/AuthContext';

const AddNewOrderModel = ({ show, hide, submit, item }) => {
  const { user } = useAuth();
  const [productsData, setProductsData] = useState([])
  const [productValue, setProductValue] = useState(null)
  const [productLabel, setProductLabel] = useState(null)
  const [productsArray, setProductsArray] = useState([])

  const [amount, setAmount] = useState(0);
  const [bouns, setBouns] = useState(0);
  const [total_price, set_total_price] = useState(0);
  const [total_price_product, set_total_price_product] = useState(0);
  const [orderData, setOrderData] = useState([]);

  const submitBtn = () => {
    console.log('QQQ', total_price);
    if (orderData.length > 0) {
      // submit(data);
      const data = {
        user_id: user.id,
        pharmacy_id: item.pharmacy_id,
        payment_method: 0,
        total_price: total_price,
        products: orderData
      }
      post(Constants.orders.add_order, data).then((res) => {
        // console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrr', res);
      }).catch((err) => {

      }).finally(() => { })
      hide();
      setOrderData([])
      set_total_price(0)
    }
  };

  const getProducts = async () => {
    get(Constants.product.products, null, { limit: 10000 })
      .then((res) => {
        setProductsArray(res.data);
        var count = Object.keys(res.data).length
        let productsArray = []
        for (var i = 0; i < count; i++) {
          productsArray.push({
            value: res.data[i].id,
            label: res.data[i].name
          })
        }
        setProductsData(productsArray);
      })
      .catch((err) => { })
      .finally(() => {
      })
  }

  const afterAddAmount = () => {
    setBouns(0.0);
    const product = productsArray.find(product => product.id === productValue);

    if (product.bonuse != null && product.bonuse?.quantity_required && parseFloat(amount) >= product.bonuse?.quantity_required) {
      var bonuse = 0.0;
      var price = 0.0;

      switch (product.bonuse?.type) {
        case 'Fix':
          bonuse = (parseFloat(amount) / product.bonuse?.quantity_required) * product.bonuse?.bonuse
          setBouns(bonuse.toFixed(3));
          price = parseFloat(product.price_tax) * parseFloat(amount);
          console.log(price);
          set_total_price_product(price)
          break;
        case 'Percentage':
          bonuse = parseFloat(amount) * (product.bonuse?.bonuse / 100)
          setBouns(bonuse.toFixed(3));
          price = parseFloat(product.price_tax) * parseFloat(amount);
          set_total_price_product(price)
          break;
        case 'Discount':
          const beforeDiscountPrice = parseFloat(amount) * product.price_tax
          const afterDiscountPrice = beforeDiscountPrice - (product.bonuse?.bonuse)
          const priceOfBouns = beforeDiscountPrice - afterDiscountPrice
          setBouns(priceOfBouns);
          price = parseFloat(product.price_tax) * parseFloat(amount);
          set_total_price_product(price)
          break;
        default:
        // code block
      }
    } else {
      var price = 0.0;
      price = parseFloat(product.price_tax) * parseFloat(amount);
      console.log(price);
      set_total_price_product(price)
    }

  }

  const addBtn = () => {
    if (productValue != null && amount != 0) {
      const data = {
        product_id: productValue,
        product_name: productLabel,
        units: amount,
        bonus: bouns
      }
      const dd = [...orderData, data]
      setOrderData(dd)
      const total_p = total_price + total_price_product
      set_total_price(total_p);
      set_total_price_product(0)
      setProductValue(null);
      setProductLabel(null);
      setAmount(0);
      setBouns(0);
    }
  }

  useEffect(() => {
    getProducts();
  }, []);

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
              color="#7189FF"
              size={35}
              style={{ alignSelf: 'flex-end' }}
            />
          </TouchableOpacity>
          <Text style={{ ...style.maintitle, paddingHorizontal: 10 }}>Add new </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ marginVertical: 0, paddingHorizontal: 10 }}>
              <View style={style.card}>

                <Dropdown
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
                  onBlur={() => { }}
                  onChange={item => {
                    setProductValue(item.value);
                    setProductLabel(item.label)
                  }}
                  renderLeftIcon={() => (
                    <AntDesign
                      style={styles.icon}
                      color={productValue ? 'blue' : 'black'}
                      name="Safety"
                      size={20}
                    />
                  )}
                />

                <Input
                  lable={'Amount'}
                  setData={setAmount}
                  onEndEditing={afterAddAmount}
                  style={styles.inputModel}
                  value={amount}
                />


                <View style={{ marginHorizontal: 10, marginTop: 20 }}>
                  <Text style={{
                    marginBottom: 5,
                    color: '#253274',
                    fontSize: 11,
                  }}>Bouns
                  </Text>
                  <View style={{ height: 40, borderWidth: 1, justifyContent: 'center', padding: 10, borderRadius: 5, borderColor: '#000' }}>
                    <Text style={{ color: 'black' }}>{bouns}</Text>
                  </View>
                </View>

              </View>

              <View style={style.btnContainer}>

                <TouchableOpacity
                  style={{
                    ...style.btn,
                    backgroundColor: '#7189FF',
                    height: 45,
                    marginRight: 40,
                  }}
                  onPress={() => {
                    submitBtn();
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      textTransform: 'capitalize',
                      color: '#fff',
                    }}>
                    submit
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    ...style.btn,
                    backgroundColor: '#7189FF',
                    height: 45,
                    paddingHorizontal: 25,
                  }}
                  onPress={() => {
                    addBtn();
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      textTransform: 'capitalize',
                      color: '#fff',
                    }}>
                    Add
                  </Text>
                </TouchableOpacity>

              </View>

            </View>

            <View>
              <OrdersAfterAddTable data={orderData} />
            </View>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AddNewOrderModel;

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
    height: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  btn: {
    backgroundColor: '#7189FF',
    alignSelf: 'center',
    borderRadius: 7,
    padding: 7,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    // width:'47%'
  },
  maintitle: {
    fontSize: 25,
    textTransform: 'capitalize',
    color: '#7189FF',
  },
  newbtn: {
    backgroundColor: '#7189FF',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  card: {
    // marginVertical: 10,
    width: '100%',
  },
  lable: {
    marginBottom: 5,
    fontSize: 16,
    color: '#000',
    textTransform: 'capitalize',
  },
  dropdown: {
    height: 42,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
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
