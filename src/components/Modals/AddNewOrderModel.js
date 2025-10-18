import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  Animated,
  Easing,
  I18nManager,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { styles } from '../styles';
import moment from 'moment';
import Input from '../Input';
import { Dropdown } from 'react-native-element-dropdown';
import OrdersAfterAddTable from '../../components/Tables/OrdersAfterAddTable';
import Constants from '../../config/globalConstants';
import { get, post } from '../../WebService/RequestBuilder';

const AddNewOrderModel = ({ show, hide, submit, item, func }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  const [productsData, setProductsData] = useState([])
  const [productValue, setProductValue] = useState(null)
  const [productLabel, setProductLabel] = useState(null)
  const [productsArray, setProductsArray] = useState([])

  const [amount, setAmount] = useState(0);
  const [bouns, setBouns] = useState(0);
  const [total_price, set_total_price] = useState(0);
  const [total_price_product, set_total_price_product] = useState(0);
  const [orderData, setOrderData] = useState([]);
  
  // Animation values
  const [slideAnim] = useState(new Animated.Value(300));
  const [fadeAnim] = useState(new Animated.Value(0));

  const getProducts = async () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📦 جلب المنتجات...');
    
    get('all-products', null, null)
      .then((res) => {
        console.log('✅ استجابة API:');
        console.log('   - عدد المنتجات:', res?.length || res.data?.length || 0);
        
        const products = Array.isArray(res) ? res : res.data;
        
        if (products && products.length > 0) {
          setProductsArray(products);
          
          const productsArray = products.map((product) => ({
            value: product.id,
            label: product.name
          }));
          
          setProductsData(productsArray);
          console.log('   - تم تحويل:', productsArray.length, 'منتج');
          console.log('   - أول 3 منتجات:', productsArray.slice(0, 3).map(p => p.label));
        } else {
          console.log('⚠️ لا توجد منتجات');
        }
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      })
      .catch((err) => {
        console.error('❌ خطأ في جلب المنتجات:', err);
      })
  }

  const afterAddAmount = () => {
    setBouns(0.0);
    const product = productsArray.find(product => product?.id === productValue);

    if (product?.bonuse != null && product?.bonuse?.quantity_required && parseFloat(amount) >= product?.bonuse?.quantity_required) {
      var bonuse = 0.0;
      var price = 0.0;

      switch (product?.bonuse?.type) {
        case 'Fix':
          bonuse = (parseFloat(amount) / product?.bonuse?.quantity_required) * product?.bonuse?.bonuse
          setBouns(bonuse.toFixed(3));
          price = parseFloat(product?.price_tax) * parseFloat(amount);
          set_total_price_product(price)
          break;
        case 'Percentage':
          bonuse = parseFloat(amount) * (product?.bonuse?.bonuse / 100)
          setBouns(bonuse.toFixed(3));
          price = parseFloat(product?.price_tax) * parseFloat(amount);
          set_total_price_product(price)
          break;
        case 'Discount':
          const beforeDiscountPrice = parseFloat(amount) * product?.price_tax
          const afterDiscountPrice = beforeDiscountPrice - (product?.bonuse?.bonuse)
          const priceOfBouns = beforeDiscountPrice - afterDiscountPrice
          setBouns(priceOfBouns);
          price = parseFloat(product?.price_tax) * parseFloat(amount);
          set_total_price_product(price)
          break;
        default:
        // code block
      }
    } else {
      var price = 0.0;
      price = parseFloat(product?.price_tax) * parseFloat(amount);
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

  const submitBtn = () => {
    if (orderData.length > 0) {
      const data = {
        pharmacy_id: item.pharmacy_id,
        payment_method: 0,
        products: orderData
      }
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📤 Sending Order...');
      console.log('Data:', data);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      post(Constants.orders.add_order, data).then((res) => {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ API Response:');
        console.log('Message:', res?.message);
        console.log('Order Data:', res?.data);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Alert.alert(res?.message ?? '');
        
        if (submit && res?.data) {
          submit(res.data);
        }
        
        func();
      }).catch((err) => {
        console.error('❌ Error submitting order:', err);
        
        // ✅ معالجة مخصصة لخطأ سقف السعر
        if (err.message && err.message.includes('ceiling price being less than the order amount')) {
          Alert.alert(
            'سقف السعر غير كافي',
            'عذراً، لا يمكن تنفيذ الطلب لأن سقف السعر أقل من مبلغ الطلب.\n\nيرجى التواصل مع المسؤول لزيادة سقف الدين لهذه الصيدلية.',
            [
              {
                text: 'موافق',
                style: 'default'
              }
            ]
          );
        } else {
          // معالجة الأخطاء الأخرى
          Alert.alert(
            'خطأ في إرسال الطلب',
            err.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
            [
              {
                text: 'موافق',
                style: 'default'
              }
            ]
          );
        }
      });
      
      hide();
      setOrderData([]);
      set_total_price(0);
    }
  };

  // Animation effects
  useEffect(() => {
    if (show) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [show]);

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={show}
      onRequestClose={hide}
      statusBarTranslucent={true}>
      <Animated.View 
        style={[
          style.modalContainer,
          { opacity: fadeAnim }
        ]}>
        <Animated.View 
          style={[
            style.modalView,
            { 
              transform: [{ translateY: slideAnim }],
              shadowOpacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.3]
              })
            }
          ]}>
          
          {/* Header */}
          <View style={style.header}>
            <Text style={[style.mainTitle, isRTL && style.rtlText]}>
              {t('order.title')}
            </Text>
            <TouchableOpacity
              onPress={hide}
              style={style.closeButton}>
              <AntDesign
                name="close"
                color="#183E9F"
                size={24}
              />
            </TouchableOpacity>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            style={style.scrollView}>
            
            {/* Product Selection Card */}
            <View style={style.card}>
              <Text style={[style.cardTitle, isRTL && style.rtlText]}>
                {t('order.productDetails')}
              </Text>
              
              <Dropdown
                itemTextStyle={style.dropdownItemText}
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
                placeholder={!productValue ? t('order.selectProduct') : '...'}
                searchPlaceholder={t('order.search')}
                value={productValue}
                onBlur={() => { }}
                onChange={item => {
                  setProductValue(item.value);
                  setProductLabel(item.label)
                }}
                renderLeftIcon={() => (
                  <AntDesign
                    style={styles.icon}
                    color={productValue ? '#183E9F' : '#666'}
                    name="Safety"
                    size={20}
                  />
                )}
              />

              <Input
                lable={t('order.quantity')}
                setData={setAmount}
                onEndEditing={afterAddAmount}
                style={styles.inputModel}
                value={amount}
                isNumeric
              />

              <View style={style.bonusContainer}>
                <Text style={[style.bonusLabel, isRTL && style.rtlText]}>
                  {t('order.bonus')}
                </Text>
                <View style={style.bonusDisplay}>
                  <Text style={style.bonusText}>{bouns}</Text>
                </View>
              </View>

            </View>

            {/* Action Buttons */}
            <View style={style.btnContainer}>
              <TouchableOpacity
                style={style.primaryButton}
                onPress={submitBtn}>
                <Text style={[style.buttonText, isRTL && style.rtlText]}>
                  {t('order.submitOrder')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={style.secondaryButton}
                onPress={addBtn}>
                <Text style={[style.buttonText, isRTL && style.rtlText]}>
                  {t('order.add')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Orders Table */}
            <View style={style.tableContainer}>
              <OrdersAfterAddTable data={orderData} />
            </View>

          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default AddNewOrderModel;

const style = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 7, 7, 0.7)',
    padding: 20,
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f9fa',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#183E9F',
    textAlign: 'right',
  },
  closeButton: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  scrollView: {
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#183E9F',
    marginBottom: 15,
    textAlign: 'right',
  },
  dropdown: {
    height: 50,
    borderColor: '#e0e0e0',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  dropdownItemText: {
    color: '#183E9F',
    textAlign: 'right',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#9e9e9e',
    textAlign: 'right',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#183E9F',
    fontWeight: '500',
    textAlign: 'right',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: '#183E9F',
    textAlign: 'right',
  },
  bonusContainer: {
    marginTop: 15,
  },
  bonusLabel: {
    marginBottom: 8,
    color: '#183E9F',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  bonusDisplay: {
    height: 50,
    borderWidth: 1.5,
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  bonusText: {
    color: '#183E9F',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'right',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 20,
  },
  primaryButton: {
    backgroundColor: '#183E9F',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.48,
    shadowColor: '#183E9F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: '#183E9F',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.48,
    shadowColor: '#183E9E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  tableContainer: {
    marginBottom: 20,
  },
});