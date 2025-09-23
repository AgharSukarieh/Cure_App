// components/CustomDropdown.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const { height } = Dimensions.get('window');

const CustomDropdown = ({ options, selectedValue, onSelect, placeholder = 'Select an option' }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (item) => {
    onSelect(item);
    setModalVisible(false);
  };

  return (
    <View>
      {/* الزر الذي يفتح القائمة */}
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dropdownButtonText}>{selectedValue || placeholder}</Text>
        <Icon name="chevron-down" size={20} color="#555" />
      </TouchableOpacity>

      {/* الـ Modal الذي يحتوي على قائمة الخيارات */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // زر القائمة المنسدلة الرئيسي
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFF',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  // خلفية الـ Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // حاوية الخيارات
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '80%',
    maxHeight: height * 0.4, // تحديد أقصى ارتفاع للقائمة
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  // كل خيار في القائمة
  optionItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  // الخط الفاصل بين الخيارات
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
});

export default CustomDropdown;
