import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { VehiculosScreen } from '../screens/VehiculosScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { RegistrarEvidenciaScreen } from '../screens/RegistrarEvidenciaScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = ({ sesionActiva }: { sesionActiva: boolean }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={sesionActiva ? 'Home' : 'Login'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Vehiculos" component={VehiculosScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="RegistrarEvidencia" component={RegistrarEvidenciaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};