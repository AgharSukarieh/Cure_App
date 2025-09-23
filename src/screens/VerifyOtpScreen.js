import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import OtpTextInput from 'react-native-otp-textinput';

const VerifyOtpScreen = ({ navigation }) => {
  const [otp, setOtp] = useState('');
  const otpInput = useRef(null);
  const [timer, setTimer] = useState(30); // مؤقت لإعادة الإرسال
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // تأثير لبدء المؤقت عند تحميل الشاشة
  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          clearInterval(interval);
          setIsResendDisabled(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    // تنظيف المؤقت عند مغادرة الشاشة
    return () => clearInterval(interval);
  }, [isResendDisabled]); // إعادة تشغيل المؤقت عند الضغط على إعادة الإرسال

  // دالة للتحقق من الرمز
  const handleVerify = () => {
    // تحقق من أن الرمز المدخل هو 4 أرقام
    if (otp.length !== 4) {
      Alert.alert('Error', 'Please enter a valid 4-digit OTP code.');
      return;
    }

    // منطق التحقق من الرمز (هنا مثال بسيط)
    console.log('Verifying OTP:', otp);
    Alert.alert('Success', 'OTP Verified Successfully!', [
      // يمكنك الانتقال إلى شاشة إعادة تعيين كلمة المرور الفعلية هنا
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  // دالة لإعادة إرسال الرمز
  const handleResend = () => {
    if (!isResendDisabled) {
      // منطق إعادة إرسال الرمز
      Alert.alert('Code Sent', 'A new OTP code has been sent to you.');
      setIsResendDisabled(true);
      setTimer(30); // إعادة ضبط المؤقت
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Change Password</Text>
        <Text style={styles.subtitle}>Enter your OTP code</Text>

        {/* OTP Input */}
        <OtpTextInput
          ref={otpInput}
          handleTextChange={setOtp}
          containerStyle={styles.otpContainer}
          textInputStyle={styles.otpInput}
          tintColor="#2d5accff" // لون الحدود عند التركيز
          offTintColor="#E0E0E0" // لون الحدود الافتراضي
          inputCount={4}
          keyboardType="numeric"
        />

        {/* Resend Code */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive code? </Text>
          <TouchableOpacity onPress={handleResend} disabled={isResendDisabled}>
            <Text style={[styles.resendLink, isResendDisabled && styles.resendDisabled]}>
              {isResendDisabled ? `Resend again in ${timer}s` : 'Resend again'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Verify Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  backButton: {
    backgroundColor: '#F0F0F0',
    padding: 8,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 40,
  },
  otpContainer: {
    marginBottom: 30,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#888',
  },
  resendLink: {
    fontSize: 14,
    color: '#2d5accff', // لون الرابط
    fontWeight: 'bold',
  },
  resendDisabled: {
    color: '#BDBDBD', // لون الرابط عند تعطيله
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  verifyButton: {
    backgroundColor: '#2d5accff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2d5accff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VerifyOtpScreen;
