import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CustomButton } from '../components/CustomButton';
import { color, spacing, typography } from '../theme/tokens';

export const HomeScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de Control</Text>
      <CustomButton title="Ver Vehículos" onPress={() => navigation.navigate('Vehiculos')} />
      <CustomButton title="Ver Perfil" onPress={() => navigation.navigate('Profile')} variant="secondary" />
      <CustomButton title="Configuración" onPress={() => navigation.navigate('Settings')} variant="secondary" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: color.background.default,
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: color.text.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
});