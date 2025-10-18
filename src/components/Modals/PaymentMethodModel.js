import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Modal,
  ScrollView,
  Animated,
  Alert,
  SafeAreaView,
  Platform,
  TextInput,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import ButtonWithIndicator from '../ButtonWithIndicator'; // Assume this handles loading state
import CustomDatePicker from '../CustomPicker'; // Assume this is a custom date picker

const { width, height } = Dimensions.get('window');


const PaymentMethodModel = ({ show, hide, submit, pharmacyId, loading, visitDate }) => {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [animatedValue] = useState(new Animated.Value(0));
  const [paymentValue, setPaymentValue] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [checkNumber, setCheckNumber] = useState('');
  const [checkNumberError, setCheckNumberError] = useState('');
  const [checkDate, setCheckDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setPaymentValue('');
    setCheckNumber('');
    setSelectedMethod(null);
    setCheckDate(new Date());
    setDueDate(new Date());
    setPaymentError('');
    setCheckNumberError('');
  };

  const validateForm = () => {
    let isValid = true;
    setPaymentError('');
    setCheckNumberError('');

    if (!paymentValue || parseFloat(paymentValue) <= 0) {
      setPaymentError(t('paymentMethod.invalidAmount'));
      isValid = false;
    }

    if (selectedMethod === 2 && !checkNumber) {
      setCheckNumberError(t('paymentMethod.invalidCheckNumber'));
      isValid = false;
    }

    return isValid;
  };

  // ✅ دالة الإرسال الحقيقية
  const handleSubmit = async () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 handleSubmit - التحقق من البيانات:');
    console.log('   - selectedMethod:', selectedMethod);
    console.log('   - paymentValue:', paymentValue);
    console.log('   - pharmacyId:', pharmacyId);
    console.log('   - checkNumber:', checkNumber);
    console.log('   - checkDate:', checkDate);
    console.log('   - dueDate:', dueDate);
    
    if (!validateForm()) {
      console.log('❌ فشل التحقق من النموذج');
      return;
    }

    if (!pharmacyId) {
      Alert.alert('خطأ', 'معرف الصيدلية مفقود');
      console.log('❌ pharmacy_id مفقود');
      return;
    }

    const data = {
      payment: parseFloat(paymentValue),
      payment_method: selectedMethod === 1 ? 'cash' : 'check',
      pharmacy_id: pharmacyId,
    };

    // ✅ إضافة تاريخ للدفعة النقدية
    if (selectedMethod === 1) {
      // إذا كانت cash، أضف received_at من visitDate
      if (visitDate) {
        data.received_at = visitDate;
        console.log('💵 بيانات الدفعة النقدية:');
        console.log('   - received_at (تاريخ الزيارة):', data.received_at);
      }
    }

    // إضافة بيانات الشيك إذا كانت الطريقة شيك
    if (selectedMethod === 2) {
      if (!checkNumber || checkNumber.trim() === '') {
        Alert.alert('خطأ', 'يرجى إدخال رقم الشيك');
        console.log('❌ check_number فارغ');
        return;
      }
      
      if (!checkDate) {
        Alert.alert('خطأ', 'يرجى اختيار تاريخ الشيك');
        console.log('❌ checkDate فارغ');
        return;
      }
      
      if (!dueDate) {
        Alert.alert('خطأ', 'يرجى اختيار تاريخ الاستحقاق');
        console.log('❌ dueDate فارغ');
        return;
      }
      
      data.check_number = checkNumber.trim();
      data.settlement = checkDate.toISOString().split('T')[0];
      data.received_at = dueDate.toISOString().split('T')[0];
      
      console.log('📄 بيانات الشيك:');
      console.log('   - check_number:', data.check_number);
      console.log('   - settlement (Check Date):', data.settlement);
      console.log('   - received_at (Due Date):', data.received_at);
    }

    console.log('📤 البيانات النهائية المُرسلة:', JSON.stringify(data, null, 2));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // استدعاء دالة submit من props
    await submit(data);
    
    // مسح النموذج
    resetForm();
  };

  const handleClose = () => {
    if (paymentValue || checkNumber) {
      Alert.alert(
        t('paymentMethod.confirmCloseTitle') || 'تأكيد الإغلاق',
        t('paymentMethod.confirmCloseMessage') || 'هل تريد إلغاء العملية؟',
        [
          { text: t('paymentMethod.cancel') || 'لا', style: 'cancel' },
          {
            text: t('paymentMethod.discard') || 'نعم',
            style: 'destructive',
            onPress: () => {
              hide();
              resetForm();
            },
          },
        ]
      );
    } else {
      hide();
      resetForm();
    }
  };

  useEffect(() => {
    if (show) {
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80, // Slightly more dynamic
        friction: 10,
        overshootClamping: false,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [show]);

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1], // Slightly more pronounced scale
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const PaymentOption = ({
    icon,
    iconType = 'Feather',
    title,
    onPress,
    method,
    colors,
    iconColor,
  }) => {
    const isSelected = selectedMethod === method;
    const IconComponent = iconType === 'MaterialIcons' ? MaterialIcons : Feather;

    return (
      <TouchableOpacity
        style={[styles.paymentOption, isSelected && styles.selectedPaymentOption]}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityLabel={title}
        accessibilityRole="button"
      >
        <LinearGradient
          colors={isSelected ? ['#3B82F6', '#1E40AF'] : colors}
          style={styles.paymentOptionGradient}
        >
           <View
             style={[
               styles.paymentOptionContent,
             ]}
           >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : colors[0] },
              ]}
            >
              <IconComponent
                name={icon}
                size={28} // Larger icon for better visibility
                color={isSelected ? '#FFFFFF' : iconColor}
              />
            </View>
            <Text
              style={[
                styles.paymentTitle,
                { color: isSelected ? '#FFFFFF' : '#1F2937' },
              ]}
            >
              {title}
            </Text>
            {isSelected && (
              <View style={styles.checkmarkContainer}>
                <Feather name="check" size={18} color="#FFFFFF" />
              </View>
             )}
           </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="none" // Let Animated handle the animation
      transparent={true}
      visible={show}
      onRequestClose={handleClose}
      accessibilityViewIsModal={true}
    >
      <SafeAreaView style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
          accessibilityLabel={t('paymentMethod.closeModal')}
        />
        <Animated.View
            style={[
              styles.modalView,
              {
                transform: [
                  { translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [height, 0],
                  }) },
                  { scale: scale }
                ],
                opacity,
              },
            ]}
        >
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>
                {t('paymentMethod.selectMethod')}
              </Text>
              <Text style={styles.modalSubtitle}>
                {t('paymentMethod.selectMethodDesc')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              accessibilityLabel={t('paymentMethod.closeButton')}
              accessibilityRole="button"
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Feather name="x" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.optionsContainer}>
            {!selectedMethod ? (
              <View style={styles.paymentOptionsRow}>
                <PaymentOption
                  icon="dollar-sign"
                  title={t('paymentMethod.cash')}
                  onPress={() => setSelectedMethod(1)}
                  method={1}
                  colors={['#DCFCE7', '#BBF7D0']}
                  iconColor="#059669"
                />
                <PaymentOption
                  icon="receipt"
                  iconType="MaterialIcons"
                  title={t('paymentMethod.check')}
                  onPress={() => setSelectedMethod(2)}
                  method={2}
                  colors={['#FEF3C7', '#FDE68A']}
                  iconColor="#D97706"
                />
              </View>
            ) : (
              <View style={styles.formContainer}>
                {selectedMethod === 1 && (
                  <View style={styles.formContent}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>{t('accountInfo.modalPaymentValue')}</Text>
                      <TextInput
                        style={[styles.textInput, paymentError && styles.inputError]}
                        value={paymentValue}
                        onChangeText={setPaymentValue}
                        placeholder={t('accountInfo.modalEnterAmount')}
                        placeholderTextColor="#9CA3AF"
                        keyboardType="numeric"
                      />
                      {paymentError && <Text style={styles.errorText}>{paymentError}</Text>}
                    </View>
                    <ButtonWithIndicator
                      text={t('accountInfo.modalSubmit')}
                      clickable={isCashFormValid && !isSubmitting && !loading}
                      isLoading={isSubmitting || loading}
                      onClick={handleSubmit}
                      style={styles.submitButton}
                      accessibilityLabel={t('accountInfo.modalSubmit')}
                    />
                  </View>
                )}
                {selectedMethod === 2 && (
                  <View style={styles.formContent}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>{t('accountInfo.modalPaymentValue')}</Text>
                      <TextInput
                        style={[styles.textInput, paymentError && styles.inputError]}
                        value={paymentValue}
                        onChangeText={setPaymentValue}
                        placeholder={t('accountInfo.modalEnterAmount')}
                        placeholderTextColor="#9CA3AF"
                        keyboardType="numeric"
                      />
                      {paymentError && <Text style={styles.errorText}>{paymentError}</Text>}
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>{t('accountInfo.modalCheckNumber')}</Text>
                      <TextInput
                        style={[styles.textInput, checkNumberError && styles.inputError]}
                        value={checkNumber}
                        onChangeText={setCheckNumber}
                        placeholder={t('accountInfo.modalEnterCheckNumber')}
                        placeholderTextColor="#9CA3AF"
                        keyboardType="default"
                      />
                      {checkNumberError && <Text style={styles.errorText}>{checkNumberError}</Text>}
                    </View>
                    <View style={styles.filterBox}>
                      <Text style={styles.filterLabel}>
                        {t('accountInfo.modalCheckDate')}
                      </Text>
                      <CustomDatePicker
                        value={checkDate}
                        onDateChange={setCheckDate}
                        accessibilityLabel={t('accountInfo.modalCheckDate')}
                      />
                    </View>
                    <View style={styles.filterBox}>
                      <Text style={styles.filterLabel}>
                        {t('accountInfo.modalDueDate')}
                      </Text>
                      <CustomDatePicker
                        value={dueDate}
                        onDateChange={setDueDate}
                        accessibilityLabel={t('accountInfo.modalDueDate')}
                      />
                    </View>
                    <ButtonWithIndicator
                      text={t('accountInfo.modalSubmit')}
                      clickable={isCheckFormValid && !isSubmitting && !loading}
                      isLoading={isSubmitting || loading}
                      onClick={handleSubmit}
                      style={styles.submitButton}
                      accessibilityLabel={t('accountInfo.modalSubmit')}
                    />
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </Modal>
  );
};

const isCashFormValid = (paymentValue) => paymentValue && parseFloat(paymentValue) > 0;
const isCheckFormValid = (paymentValue, checkNumber) =>
  paymentValue && parseFloat(paymentValue) > 0 && checkNumber;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker backdrop for better contrast
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalView: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28, // Softer corners
    borderTopRightRadius: 28,
    width: '100%',
    maxHeight: height * 0.85, // Slightly smaller max height
    minHeight: height * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  modalHandle: {
    width: 48,
    height: 5,
    backgroundColor: '#D1D5DB',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 20, // Slightly larger for emphasis
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  closeButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  paymentOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16, // Increased gap for clarity
  },
  paymentOption: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  selectedPaymentOption: {
    elevation: 8,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    transform: [{ scale: 1.02 }],
  },
  paymentOptionGradient: {
    borderRadius: 16,
  },
  paymentOptionContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24, // Increased padding
    borderRadius: 16,
    minHeight: 140, // Taller cards for better touch targets
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  formContent: {
    flex: 1,
    paddingVertical: 16,
  },
  filterBox: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 10,
  },
  submitButton: {
    marginTop: 24,
    paddingVertical: 14, // Larger button for better touch
    borderRadius: 12,
  },

  // Custom Input Styles
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  textInput: {
    fontSize: 16,
    color: '#111827',
    padding: 0,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
});

export default PaymentMethodModel;