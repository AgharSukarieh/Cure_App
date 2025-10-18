import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { testNetworkConnection, testEndpoint } from '../utils/NetworkTest';

const NetworkTestScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const result = await testNetworkConnection();
      if (result) {
        Alert.alert('Success', 'Network connection is working!');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestLogin = async () => {
    setIsLoading(true);
    try {
      const result = await testEndpoint('login');
      if (result) {
        Alert.alert('Success', 'Login endpoint is accessible!');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Network Test</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleTestConnection}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test Network Connection'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleTestLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test Login Endpoint'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.info}>
        Server: http://10.42.0.1:8002/api/
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  button: {
    backgroundColor: '#183E9F',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 15,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    marginTop: 30,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default NetworkTestScreen;
