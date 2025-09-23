import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  I18nManager,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import GoBack from '../components/GoBack';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import ButtonWithIndicator from '../components/ButtonWithIndicator';

const { width, height } = Dimensions.get('window');

const ContactUsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  const [formData, setFormData] = useState({
    email: '',
    title: '',
    message: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = t('contactUs.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('contactUs.errors.emailInvalid');
    }
    
    if (!formData.title.trim()) {
      newErrors.title = t('contactUs.errors.titleRequired');
    } else if (formData.title.trim().length < 5) {
      newErrors.title = t('contactUs.errors.titleTooShort');
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t('contactUs.errors.messageRequired');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('contactUs.errors.messageTooShort');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // محاكاة إرسال الرسالة
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        t('contactUs.success.title'),
        t('contactUs.success.message'),
        [
          {
            text: t('contactUs.success.button'),
            onPress: () => {
              setFormData({ email: '', title: '', message: '' });
              setErrors({});
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        t('contactUs.error.title'),
        t('contactUs.error.message')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const contactMethods = [
    {
      id: 1,
      icon: 'mail',
      title: t('contactUs.methods.email'),
      subtitle: t('contactUs.methods.emailSubtitle'),
      color: '#3B82F6',
      action: () => {
        // يمكن إضافة فتح تطبيق البريد
        Alert.alert(t('contactUs.methods.email'), 'support@pharmacy.com');
      }
    },
    {
      id: 2,
      icon: 'phone',
      title: t('contactUs.methods.phone'),
      subtitle: t('contactUs.methods.phoneSubtitle'),
      color: '#10B981',
      action: () => {
        // يمكن إضافة فتح تطبيق الهاتف
        Alert.alert(t('contactUs.methods.phone'), '+1 234 567 8900');
      }
    },
    {
      id: 3,
      icon: 'message-circle',
      title: t('contactUs.methods.whatsapp'),
      subtitle: t('contactUs.methods.whatsappSubtitle'),
      color: '#25D366',
      action: () => {
        // يمكن إضافة فتح WhatsApp
        Alert.alert(t('contactUs.methods.whatsapp'), 'WhatsApp: +1 234 567 8900');
      }
    }
  ];

//   const ContactMethod = ({ method }) => (
//     <TouchableOpacity
//       style={[styles.contactMethod, isRTL && styles.contactMethodRTL]}
//       onPress={method.action}
//       activeOpacity={0.7}
//     >
//       <LinearGradient
//         colors={[method.color + '20', method.color + '10']}
//         style={styles.contactMethodGradient}
//       >
//         <View style={[styles.contactMethodContent, isRTL && styles.contactMethodContentRTL]}>
//           <View style={[styles.contactMethodIcon, { backgroundColor: method.color + '20' }]}>
//             <Feather name={method.icon} size={24} color={method.color} />
//           </View>
//           <View style={[styles.contactMethodText, isRTL && styles.contactMethodTextRTL]}>
//             <Text style={[styles.contactMethodTitle, isRTL && styles.contactMethodTitleRTL]}>
//               {method.title}
//             </Text>
//             <Text style={[styles.contactMethodSubtitle, isRTL && styles.contactMethodSubtitleRTL]}>
//               {method.subtitle}
//             </Text>
//           </View>
//           <Feather name="chevron-right" size={20} color="#6B7280" />
//         </View>
//       </LinearGradient>
//     </TouchableOpacity>
//   );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <GoBack text={t('contactUs.title')} />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Section */}
          <View style={[styles.headerSection, isRTL && styles.headerSectionRTL]}>
            <LinearGradient
              colors={['#059669', '#10B981']}
              style={styles.headerGradient}
            >
              <View style={[styles.headerContent, isRTL && styles.headerContentRTL]}>
                <View style={[styles.headerIconContainer, isRTL && styles.headerIconContainerRTL]}>
                  <Feather name="message-circle" size={32} color="#FFFFFF" />
                </View>
                <View style={[styles.headerTextContainer, isRTL && styles.headerTextContainerRTL]}>
                  <Text style={[styles.headerTitle, isRTL && styles.headerTitleRTL]}>
                    {t('contactUs.welcomeTitle')}
                  </Text>
                  <Text style={[styles.headerSubtitle, isRTL && styles.headerSubtitleRTL]}>
                    {t('contactUs.welcomeSubtitle')}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Contact Methods */}
          {/* <View style={[styles.contactMethodsSection, isRTL && styles.contactMethodsSectionRTL]}>
            <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>
              {t('contactUs.contactMethodsTitle')}
            </Text>
            {contactMethods.map((method) => (
              <ContactMethod key={method.id} method={method} />
            ))}
          </View> */}

          {/* Contact Form */}
          <View style={[styles.formSection, isRTL && styles.formSectionRTL]}>
            <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>
              {t('contactUs.formTitle')}
            </Text>
            
            <View style={styles.formContainer}>
              {/* Email Input */}
              <View style={[styles.inputContainer, isRTL && styles.inputContainerRTL]}>
                <Text style={[styles.inputLabel, isRTL && styles.inputLabelRTL]}>
                  {t('contactUs.form.email')} *
                </Text>
                <View style={[styles.inputWrapper, errors.email && styles.inputError, isRTL && styles.inputWrapperRTL]}>
                  <Feather name="mail" size={20} color="#6B7280" style={[styles.inputIcon, isRTL && styles.inputIconRTL]} />
                  <TextInput
                    style={[styles.textInput, isRTL && styles.textInputRTL]}
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    placeholder={t('contactUs.form.emailPlaceholder')}
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {errors.email && (
                  <Text style={[styles.errorText, isRTL && styles.errorTextRTL]}>
                    {errors.email}
                  </Text>
                )}
              </View>

              {/* Title Input */}
              <View style={[styles.inputContainer, isRTL && styles.inputContainerRTL]}>
                <Text style={[styles.inputLabel, isRTL && styles.inputLabelRTL]}>
                  {t('contactUs.form.title')} *
                </Text>
                <View style={[styles.inputWrapper, errors.title && styles.inputError, isRTL && styles.inputWrapperRTL]}>
                  <Feather name="edit-3" size={20} color="#6B7280" style={[styles.inputIcon, isRTL && styles.inputIconRTL]} />
                  <TextInput
                    style={[styles.textInput, isRTL && styles.textInputRTL]}
                    value={formData.title}
                    onChangeText={(value) => handleInputChange('title', value)}
                    placeholder={t('contactUs.form.titlePlaceholder')}
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                  />
                </View>
                {errors.title && (
                  <Text style={[styles.errorText, isRTL && styles.errorTextRTL]}>
                    {errors.title}
                  </Text>
                )}
              </View>

              {/* Message Input */}
              <View style={[styles.inputContainer, isRTL && styles.inputContainerRTL]}>
                <Text style={[styles.inputLabel, isRTL && styles.inputLabelRTL]}>
                  {t('contactUs.form.message')} *
                </Text>
                <View style={[styles.inputWrapper, styles.messageInputWrapper, errors.message && styles.inputError, isRTL && styles.inputWrapperRTL]}>
                  <Feather name="message-square" size={20} color="#6B7280" style={[styles.inputIcon, styles.messageIcon, isRTL && styles.inputIconRTL]} />
                  <TextInput
                    style={[styles.textInput, styles.messageInput, isRTL && styles.textInputRTL]}
                    value={formData.message}
                    onChangeText={(value) => handleInputChange('message', value)}
                    placeholder={t('contactUs.form.messagePlaceholder')}
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                  />
                </View>
                {errors.message && (
                  <Text style={[styles.errorText, isRTL && styles.errorTextRTL]}>
                    {errors.message}
                  </Text>
                )}
              </View>

              {/* Submit Button */}
              <ButtonWithIndicator
                text={t('contactUs.form.submit')}
                clickable={!isSubmitting}
                isLoading={isSubmitting}
                onClick={handleSubmit}
                style={styles.submitButton}
                accessibilityLabel={t('contactUs.form.submit')}
              />
            </View>
          </View>

          {/* Response Time */}
          <View style={[styles.responseTimeSection, isRTL && styles.responseTimeSectionRTL]}>
            <View style={[styles.responseTimeContent, isRTL && styles.responseTimeContentRTL]}>
              <Feather name="clock" size={20} color="#10B981" style={[isRTL && styles.responseTimeIconRTL]} />
              <Text style={[styles.responseTimeText, isRTL && styles.responseTimeTextRTL]}>
                {t('contactUs.responseTime')}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  
  // Header Section
  headerSection: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  headerSectionRTL: {
    // RTL styles if needed
  },
  headerGradient: {
    borderRadius: 20,
    padding: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContentRTL: {
    flexDirection: 'row',
  },
  headerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerIconContainerRTL: {
    marginRight: 16,
    marginLeft: 0,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTextContainerRTL: {
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerTitleRTL: {
    textAlign: 'right',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
  headerSubtitleRTL: {
    textAlign: 'right',
  },

  // Contact Methods Section
  contactMethodsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  contactMethodsSectionRTL: {
    // RTL styles if needed
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  sectionTitleRTL: {
    textAlign:  I18nManager.isRTL ? 'left' : 'right',
  },
  contactMethod: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  contactMethodRTL: {
    // RTL styles if needed
  },
  contactMethodGradient: {
    borderRadius: 16,
  },
  contactMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  contactMethodContentRTL: {
    flexDirection: 'row-reverse',
  },
  contactMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactMethodText: {
    flex: 1,
  },
  contactMethodTextRTL: {
    alignItems: 'flex-end',
  },
  contactMethodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  contactMethodTitleRTL: {
    textAlign: 'right',
  },
  contactMethodSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  contactMethodSubtitleRTL: {
    textAlign: 'right',
  },

  // Form Section
  formSection: {
    marginHorizontal: 10,
    marginBottom: 4,
  },
  formSectionRTL: {
    // RTL styles if needed
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputContainerRTL: {
    // RTL styles if needed
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputLabelRTL: {
    textAlign:  I18nManager.isRTL ? 'left' : 'right',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  inputIcon: {
    marginRight: 12,
  },
  inputIconRTL: {
    marginRight: 12,
    marginLeft: 0,
  },
  inputWrapperRTL: {
    flexDirection: 'row',
  },
  messageIcon: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    padding: 0,
  },
  textInputRTL: {
    textAlign: 'right',
  },
  messageInputWrapper: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  messageInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  errorTextRTL: {
    textAlign: 'right',
  },
  submitButton: {
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },

  // Response Time Section
  responseTimeSection: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  responseTimeSectionRTL: {
    // RTL styles if needed
  },
  responseTimeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  responseTimeContentRTL: {
    flexDirection: 'row',
  },
  responseTimeText: {
    fontSize: 14,
    color: '#059669',
    marginLeft: 8,
    fontWeight: '500',
  },
  responseTimeTextRTL: {
    marginLeft: 8,
    marginRight: 0,
    textAlign: 'right',
  },
  responseTimeIconRTL: {
    marginLeft: 0,
    marginRight: 8,
  },
});

export default ContactUsScreen;
