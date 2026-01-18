import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootNavigator } from './src/navigation/RootNavigator';

const App = () => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setUserToken(token);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // Splash screen
  }

  return <RootNavigator userToken={userToken} />;
};

export default App;
