import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { testConnection } from '../config/apiConfig';
import { fetchAllLocationData } from '../services/locationService';

const APITestScreen = () => {
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const runTests = async () => {
    setIsLoading(true);
    const results = {};

    try {
      // Test 1: Basic API Connection
      console.log('🔍 Testing basic API connection...');
      const connectionTest = await testConnection();
      results.connection = connectionTest;
      console.log('✅ Connection test result:', connectionTest);

      // Test 2: Location Service
      console.log('🔍 Testing location service...');
      const locationData = await fetchAllLocationData();
      results.locationService = {
        success: true,
        cities: locationData.cities?.length || 0,
        areas: locationData.areas?.length || 0,
        specialties: locationData.specialties?.length || 0
      };
      console.log('✅ Location service result:', results.locationService);

    } catch (error) {
      console.error('❌ Test error:', error);
      results.error = error.message;
    }

    setTestResults(results);
    setIsLoading(false);
  };

  const renderTestResult = (title, result) => (
    <View style={styles.testResult}>
      <Text style={styles.testTitle}>{title}</Text>
      {result.success ? (
        <Text style={styles.successText}>✅ Success</Text>
      ) : (
        <Text style={styles.errorText}>❌ Failed</Text>
      )}
      {result.data && (
        <Text style={styles.dataText}>Data: {JSON.stringify(result.data, null, 2)}</Text>
      )}
      {result.error && (
        <Text style={styles.errorText}>Error: {result.error}</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🚀 API Test Screen</Text>
      <Text style={styles.subtitle}>Testing API Configuration - 100% Compatible with Laravel Backend</Text>
      
      <TouchableOpacity style={styles.testButton} onPress={runTests} disabled={isLoading}>
        <Text style={styles.buttonText}>
          {isLoading ? '🔄 Testing...' : '🧪 Run API Tests'}
        </Text>
      </TouchableOpacity>

      {Object.keys(testResults).length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>📊 Test Results:</Text>
          
          {testResults.connection && renderTestResult(
            '🔗 Basic API Connection',
            testResults.connection
          )}
          
          {testResults.locationService && renderTestResult(
            '🗺️ Location Service',
            testResults.locationService
          )}
          
          {testResults.error && (
            <View style={styles.testResult}>
              <Text style={styles.testTitle}>❌ General Error</Text>
              <Text style={styles.errorText}>{testResults.error}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>ℹ️ API Configuration Info:</Text>
        <Text style={styles.infoText}>• Base URL: http://10.42.0.1:8002/api/</Text>
        <Text style={styles.infoText}>• Timeout: 30 seconds</Text>
        <Text style={styles.infoText}>• Authentication: Bearer Token</Text>
        <Text style={styles.infoText}>• Content-Type: application/json</Text>
        <Text style={styles.infoText}>• Retry Logic: 3 attempts</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  testButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultsContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  testResult: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  successText: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  dataText: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    color: '#666',
    marginBottom: 5,
  },
});

export default APITestScreen;