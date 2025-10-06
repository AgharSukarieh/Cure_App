// Doctors List Example Component
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useDoctors } from '../hooks/useDoctors';

/**
 * Doctors List Example Component
 * Demonstrates how to use the doctors management system
 */
const DoctorsListExample = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  
  const {
    doctors,
    loading,
    error,
    pagination,
    refreshing,
    fetchDoctors,
    searchDoctors,
    getSpecialties,
    refresh,
    loadMore,
    clearError
  } = useDoctors({ autoFetch: true });

  const [specialties, setSpecialties] = useState([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(false);

  // Load specialties on mount
  useEffect(() => {
    loadSpecialties();
  }, []);

  /**
   * Load specialties
   */
  const loadSpecialties = async () => {
    try {
      setLoadingSpecialties(true);
      const result = await getSpecialties();
      if (result.success) {
        setSpecialties(result.data);
      }
    } catch (error) {
      console.error('Error loading specialties:', error);
    } finally {
      setLoadingSpecialties(false);
    }
  };

  /**
   * Handle search
   */
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await searchDoctors({ search: searchQuery.trim() });
    } else {
      await fetchDoctors();
    }
  };

  /**
   * Handle specialty filter
   */
  const handleSpecialtyFilter = async (specialtyId) => {
    setSelectedSpecialty(specialtyId);
    await fetchDoctors({ specialty_id: specialtyId });
  };

  /**
   * Handle refresh
   */
  const handleRefresh = async () => {
    await refresh();
  };

  /**
   * Handle load more
   */
  const handleLoadMore = async () => {
    if (pagination && pagination.current_page < pagination.last_page) {
      await loadMore({ page: pagination.current_page + 1 });
    }
  };

  /**
   * Handle doctor press
   */
  const handleDoctorPress = (doctor) => {
    navigation.navigate('DoctorDetails', { doctorId: doctor.id });
  };

  /**
   * Handle add doctor
   */
  const handleAddDoctor = () => {
    navigation.navigate('AddDoctor');
  };

  /**
   * Render doctor item
   */
  const renderDoctorItem = ({ item }) => (
    <TouchableOpacity
      style={styles.doctorItem}
      onPress={() => handleDoctorPress(item)}
    >
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.doctorSpecialty}>{item.specialty?.name}</Text>
        <Text style={styles.doctorLocation}>
          {item.city?.name} - {item.area?.name}
        </Text>
        <Text style={styles.doctorPhone}>{item.phone}</Text>
      </View>
      <View style={styles.doctorActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>تعديل</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  /**
   * Render specialty filter
   */
  const renderSpecialtyFilter = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>التخصصات:</Text>
      <View style={styles.specialtiesList}>
        <TouchableOpacity
          style={[
            styles.specialtyButton,
            !selectedSpecialty && styles.selectedSpecialtyButton
          ]}
          onPress={() => handleSpecialtyFilter(null)}
        >
          <Text style={[
            styles.specialtyButtonText,
            !selectedSpecialty && styles.selectedSpecialtyButtonText
          ]}>
            الكل
          </Text>
        </TouchableOpacity>
        {specialties.map((specialty) => (
          <TouchableOpacity
            key={specialty.id}
            style={[
              styles.specialtyButton,
              selectedSpecialty === specialty.id && styles.selectedSpecialtyButton
            ]}
            onPress={() => handleSpecialtyFilter(specialty.id)}
          >
            <Text style={[
              styles.specialtyButtonText,
              selectedSpecialty === specialty.id && styles.selectedSpecialtyButtonText
            ]}>
              {specialty.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>لا توجد أطباء</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddDoctor}>
        <Text style={styles.addButtonText}>إضافة طبيب جديد</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Render loading state
   */
  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>جاري التحميل...</Text>
    </View>
  );

  if (loading && doctors.length === 0) {
    return renderLoadingState();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>قائمة الأطباء</Text>
        <TouchableOpacity style={styles.addDoctorButton} onPress={handleAddDoctor}>
          <Text style={styles.addDoctorButtonText}>إضافة طبيب</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="البحث عن الأطباء..."
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>بحث</Text>
        </TouchableOpacity>
      </View>

      {renderSpecialtyFilter()}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={clearError}>
            <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={doctors}
        renderItem={renderDoctorItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={
          loading && doctors.length > 0 ? (
            <View style={styles.footerLoading}>
              <ActivityIndicator size="small" color="#007AFF" />
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addDoctorButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addDoctorButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  specialtiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    marginBottom: 10,
  },
  selectedSpecialtyButton: {
    backgroundColor: '#007AFF',
  },
  specialtyButtonText: {
    fontSize: 14,
    color: '#666',
  },
  selectedSpecialtyButtonText: {
    color: '#fff',
  },
  listContainer: {
    padding: 20,
  },
  doctorItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 3,
  },
  doctorLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  doctorPhone: {
    fontSize: 14,
    color: '#666',
  },
  doctorActions: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  footerLoading: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default DoctorsListExample;
