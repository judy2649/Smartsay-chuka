import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { paymentService } from '../services/api';

const PaymentScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter your M-Pesa phone number');
      return;
    }

    setLoading(true);
    try {
      await paymentService.initiateMpesaPayment({ phoneNumber });
      Alert.alert(
        'Success',
        'STK push sent to your phone. Enter your M-Pesa PIN to complete payment.',
        [{ text: 'OK', onPress: () => navigation.replace('Home') }]
      );
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subscribe to SMARTSTAY CHUKA</Text>

      <View style={styles.detailsBox}>
        <Text style={styles.detailText}>💰 Amount: KES 253</Text>
        <Text style={styles.detailText}>📅 Duration: 30 days</Text>
        <Text style={styles.detailText}>🔓 Access: Full hostel listings</Text>
      </View>

      <Text style={styles.label}>Enter M-Pesa Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="254712345678"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handlePayment}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Processing...' : 'Pay with M-Pesa'}
        </Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>How it works:</Text>
        <Text style={styles.infoText}>1. Enter your M-Pesa phone number</Text>
        <Text style={styles.infoText}>2. A prompt will appear on your phone</Text>
        <Text style={styles.infoText}>3. Enter your M-Pesa PIN</Text>
        <Text style={styles.infoText}>4. Subscription activated!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 25,
  },
  detailsBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 25,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#667eea',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    lineHeight: 18,
  },
});

export default PaymentScreen;
