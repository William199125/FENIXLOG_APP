import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CustomButton } from '../components/CustomButton';
import { colors } from '../theme/colors';

export const HomeScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de Control</Text>
      <CustomButton title="Ver Perfil" onPress={() => navigation.navigate('Profile')} />
      <CustomButton title="Configuración" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.primary, marginBottom: 20, textAlign: 'center' }
});