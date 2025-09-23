import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

const CustomDatePicker = ({ 
  value, 
  onDateChange, 
  placeholder = "اختر التاريخ",
  style,
  textStyle 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || new Date());

  // الحصول على الشهور بالعربية
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  // تنسيق التاريخ للعرض
  const formatDate = (date) => {
    if (!date) return placeholder;
    return date.toISOString().split('T')[0].replace(/-/g, '/');
  };

  // الحصول على أيام الشهر
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // الحصول على اليوم الأول من الشهر
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // إنشاء مصفوفة الأيام للعرض
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // إضافة أيام فارغة في البداية
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // إضافة أيام الشهر
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  // تغيير الشهر
  const changeMonth = (direction) => {
    const newDate = new Date(selectedDate);
    if (direction === 'next') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setSelectedDate(newDate);
  };

  // تغيير السنة
  const changeYear = (direction) => {
    const newDate = new Date(selectedDate);
    if (direction === 'next') {
      newDate.setFullYear(newDate.getFullYear() + 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() - 1);
    }
    setSelectedDate(newDate);
  };

  // اختيار يوم
  const selectDay = (day) => {
    if (!day) return;
    
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    setSelectedDate(newDate);
  };

  // تأكيد الاختيار
  const confirmSelection = () => {
    onDateChange(selectedDate);
    setIsVisible(false);
  };

  // إلغاء الاختيار
  const cancelSelection = () => {
    setSelectedDate(value || new Date());
    setIsVisible(false);
  };

  const calendarDays = generateCalendarDays();

  return (
    <>
      <TouchableOpacity 
        style={[styles.datePickerButton, style]}
        onPress={() => setIsVisible(true)}
      >
        <Text style={[styles.dateText, textStyle]}>
          {formatDate(value)}
        </Text>
        <Icon name="calendar" size={18} color="#555" />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* رأس التقويم */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => changeYear('prev')}>
                <Icon name="chevrons-left" size={20} color="#183E9F" />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => changeMonth('prev')}>
                <Icon name="chevron-left" size={20} color="#183E9F" />
              </TouchableOpacity>
              
              <Text style={styles.monthYearText}>
                {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </Text>
              
              <TouchableOpacity onPress={() => changeMonth('next')}>
                <Icon name="chevron-right" size={20} color="#183E9F" />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => changeYear('next')}>
                <Icon name="chevrons-right" size={20} color="#183E9F" />
              </TouchableOpacity>
            </View>

            {/* أيام الأسبوع */}
            <View style={styles.weekDaysRow}>
              {['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map((day, index) => (
                <Text key={index} style={styles.weekDayText}>{day}</Text>
              ))}
            </View>

            {/* شبكة الأيام */}
            <View style={styles.daysGrid}>
              {calendarDays.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayButton,
                    day === selectedDate.getDate() && styles.selectedDay,
                    !day && styles.emptyDay
                  ]}
                  onPress={() => selectDay(day)}
                  disabled={!day}
                >
                  <Text style={[
                    styles.dayText,
                    day === selectedDate.getDate() && styles.selectedDayText,
                    !day && styles.emptyDayText
                  ]}>
                    {day || ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* أزرار التحكم */}
            <View style={styles.buttonsRow}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={cancelSelection}
              >
                <Text style={styles.cancelButtonText}>إلغاء</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={confirmSelection}
              >
                <Text style={styles.confirmButtonText}>تأكيد</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: width * 0.9,
    maxWidth: 400,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#183E9F',
    flex: 1,
    textAlign: 'center',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    width: width * 0.1,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  dayButton: {
    width: width * 0.1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    borderRadius: 20,
  },
  selectedDay: {
    backgroundColor: '#183E9F',
  },
  emptyDay: {
    backgroundColor: 'transparent',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyDayText: {
    color: 'transparent',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    borderRadius: 8,
    backgroundColor: '#183E9F',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default CustomDatePicker;

