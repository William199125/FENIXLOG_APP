import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { CustomButton } from '../components/CustomButton';
import { secureAuth } from '../services/secureAuth';
import { clearAllLocalData } from '../services/db';
import { color, spacing, typography } from '../theme/tokens';

export const SettingsScreen = ({ navigation }: any) => {
  const cerrarSesion = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que deseas cerrar sesión? Se eliminarán los datos guardados localmente.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          await secureAuth.clear();
          await clearAllLocalData();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración</Text>
      <CustomButton title="Cerrar sesión" onPress={cerrarSesion} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: color.background.default, justifyContent: 'center' },
  title: { fontSize: typography.size.xl, fontWeight: typography.weight.bold, color: color.text.primary, marginBottom: spacing.lg, textAlign: 'center' },
});