import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hostelService } from '../services/api';

const HomeScreen = ({ navigation }) => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUserAndHostels();
  }, []);

  const loadUserAndHostels = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      setUser(JSON.parse(userData));

      if (JSON.parse(userData)?.isSubscribed) {
        const response = await hostelService.getAllHostels();
        setHostels(response.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.isSubscribed) {
    return (
      <View style={styles.subscriptionContainer}>
        <Text style={styles.title}>Unlock SMARTSTAY CHUKA</Text>
        <Text style={styles.subtitle}>Subscribe to view all hostels</Text>
        <Text style={styles.price}>KES 253 for 30 days</Text>
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={() => navigation.navigate('Payment')}
        >
          <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Your Perfect Hostel</Text>
      <FlatList
        data={hostels}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.hostelCard}
            onPress={() => navigation.navigate('HostelDetail', { id: item._id })}
          >
            <Text style={styles.hostelName}>{item.name}</Text>
            <Text style={styles.hostelText}>📍 {item.location}</Text>
            <Text style={styles.hostelText}>📞 {item.phoneNumber}</Text>
            <Text style={styles.hostelDescription}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscriptionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 30,
  },
  subscribeButton: {
    backgroundColor: '#667eea',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  hostelCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hostelName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  hostelText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  hostelDescription: {
    fontSize: 13,
    color: '#777',
    marginTop: 8,
    lineHeight: 18,
  },
});

export default HomeScreen;
