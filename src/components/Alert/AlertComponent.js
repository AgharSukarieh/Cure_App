import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const { width, height } = Dimensions.get('window');

const AlertComponent = ({
  visible = false,
  type = 'success', // 'success', 'error', 'warning', 'info', 'confirm'
  title = '',
  message = '',
  duration = 4000,
  onClose,
  showCloseButton = true,
  position = 'top', // 'top', 'center', 'bottom'
  animationType = 'slide', // 'slide', 'fade', 'zoom'
  customIcon,
  titleStyle,
  messageStyle,
  containerStyle,
  buttonText = 'موافق',
  showButton = false,
  onButtonPress,
  onConfirm, // ✅ إضافة onConfirm للـ confirm type
  confirmText = 'تأكيد', // ✅ نص زر التأكيد
  cancelText = 'إلغاء', // ✅ نص زر الإلغاء
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;

  // إعدادات حسب النوع
  const alertConfig = {
    success: {
      icon: 'check-circle',
      backgroundColor: '#10B981',
      iconColor: '#FFFFFF',
      progressColor: '#059669',
    },
    error: {
      icon: 'x-circle',
      backgroundColor: '#EF4444',
      iconColor: '#FFFFFF',
      progressColor: '#DC2626',
    },
    warning: {
      icon: 'alert-circle',
      backgroundColor: '#F59E0B',
      iconColor: '#FFFFFF',
      progressColor: '#D97706',
    },
    info: {
      icon: 'info',
      backgroundColor: '#3B82F6',
      iconColor: '#FFFFFF',
      progressColor: '#2563EB',
    },
    confirm: {
      icon: 'help-circle',
      backgroundColor: 'rgba(135, 206, 235, 0.95)', // ✅ لون سماوي شفاف
      iconColor: '#FFFFFF',
      progressColor: '#87CEEB',
    },
  };

  const config = alertConfig[type] || alertConfig.info;
  const iconName = customIcon || config.icon;

  const getPositionStyle = () => {
    if (type === 'confirm') {
      return { 
        position: 'absolute',
        top: '50%',
        left: '0%',
        width: width - 40,
        maxWidth: 400,
        transform: [
          { translateX: -((width - 40) / 2) }, 
          { translateY: -150 }               
        ],
        zIndex: 1000
      };
    }
    
    switch (position) {
      case 'top':
        return { top: Platform.OS === 'ios' ? 60 : 40 };
      case 'center':
        return { top: height / 2 - 100 };
      case 'bottom':
        return { bottom: 40 };
      default:
        return { top: Platform.OS === 'ios' ? 60 : 40 };
    }
  };

  // تحديد الأنيميشن
  const getAnimationStyle = () => {
    switch (animationType) {
      case 'slide':
        return { transform: [{ translateY: slideAnim }] };
      case 'fade':
        return { opacity: fadeAnim };
      case 'zoom':
        return { transform: [{ scale: scaleAnim }] };
      default:
        return { transform: [{ translateY: slideAnim }] };
    }
  };

  // تشغيل الأنيميشن عند الظهور
  useEffect(() => {
    if (visible) {
      // إعادة تعيين القيم
      slideAnim.setValue(-100);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      progressAnim.setValue(1);

      // تشغيل الأنيميشن الرئيسي
      const animations = [];
      
      if (animationType === 'slide') {
        animations.push(
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          })
        );
      } else if (animationType === 'fade') {
        animations.push(
          Animated.spring(fadeAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          })
        );
      } else if (animationType === 'zoom') {
        animations.push(
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          })
        );
      }

      Animated.parallel(animations).start();

      // ✅ أنيميشن شريط التقدم - إلغاء للـ confirm type
      if (duration > 0 && type !== 'confirm') {
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: duration,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start(() => {
          onClose && onClose();
        });
      }
    }
  }, [visible, animationType, duration]);

  const handleClose = () => {
    // أنيميشن الإخفاء
    const hideAnimations = [];
    
    if (animationType === 'slide') {
      hideAnimations.push(
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        })
      );
    } else if (animationType === 'fade') {
      hideAnimations.push(
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        })
      );
    } else if (animationType === 'zoom') {
      hideAnimations.push(
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(hideAnimations).start(() => {
      onClose && onClose();
    });
  };

  const handleButtonPress = () => {
    if (onButtonPress) {
      onButtonPress();
    }
    handleClose();
  };

  if (!visible) return null;

  return (
    <View style={[
      styles.overlay, 
      Platform.OS === 'web' && styles.webOverlay,
      type === 'confirm' && styles.confirmOverlay // ✅ خلفية شفافة للـ confirm
    ]} pointerEvents="box-none">
      <Animated.View 
        style={[
          styles.alertContainer,
          getPositionStyle(),
          getAnimationStyle(),
          { backgroundColor: config.backgroundColor },
          type === 'confirm' && styles.confirmAlertContainer, // ✅ تطبيق styles خاصة للـ confirm
          containerStyle,
        ]}
      >
        {/* شريط التقدم */}
        {duration > 0 && type !== 'confirm' && (
          <Animated.View 
            style={[
              styles.progressBar,
              { 
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: config.progressColor,
              }
            ]} 
          />
        )}

        {/* المحتوى */}
        <View style={styles.content}>
          {/* الأيقونة والنص */}
          <View style={styles.textContainer}>
            <Feather 
              name={iconName}
              size={24} 
              color={config.iconColor} 
              style={styles.icon} 
            />
            <View style={styles.textContent}>
              {title ? (
                <Text style={[styles.title, titleStyle]}>
                  {title}
                </Text>
              ) : null}
              {message ? (
                <Text style={[styles.message, messageStyle]}>
                  {message}
                </Text>
              ) : null}
            </View>
          </View>

          {/* الأزرار */}
          <View style={styles.buttonsContainer}>
            {showCloseButton && (
              <TouchableOpacity 
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Feather name="x" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* زر الإجراء */}
        {showButton && (
          <TouchableOpacity 
            onPress={handleButtonPress}
            style={styles.actionButton}
          >
            <Text style={styles.buttonText}>
              {buttonText}
            </Text>
          </TouchableOpacity>
        )}

        {/* ✅ أزرار التأكيد والإلغاء للـ confirm type */}
        {type === 'confirm' && (
          <View style={styles.confirmButtonsContainer}>
            <TouchableOpacity 
              onPress={() => {
                if (onConfirm) {
                  onConfirm();
                }
                handleClose();
              }}
              style={[styles.confirmButton, styles.confirmButtonPrimary]}
            >
              <Text style={styles.confirmButtonText}>
                {confirmText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleClose}
              style={[styles.confirmButton, styles.confirmButtonSecondary]}
            >
              <Text style={[styles.confirmButtonText, styles.confirmButtonTextSecondary]}>
                {cancelText}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 9999,
  },
  webOverlay: {
    position: 'fixed',
  },
  alertContainer: {
    position: 'absolute',
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
    marginHorizontal: 20,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#000000',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 16,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'right',
  },
  message: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 20,
    textAlign: 'right',
  },
  buttonsContainer: {
    marginLeft: 12,
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // ✅ Styles للأزرار الجديدة
  confirmButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonPrimary: {
    backgroundColor: '#10B981',
  },
  confirmButtonSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonTextSecondary: {
    color: '#FFFFFF',
  },
  // ✅ Styles إضافية للـ confirm type - تأثير زجاجي
  confirmAlertContainer: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    // ✅ تأثير زجاجي
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)', // ✅ تأثير blur
    backgroundColor: 'rgba(135, 206, 235, 0.9)', // ✅ لون سماوي شفاف
  },
  // ✅ خلفية شفافة للـ confirm
  confirmOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // ✅ خلفية شفافة
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AlertComponent;

