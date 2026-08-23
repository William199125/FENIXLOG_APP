import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { CustomButton } from './CustomButton';
import { color, spacing, typography } from '../theme/tokens';

interface Props {
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  onRetry?: () => void;
  emptyMessage?: string;
  children: React.ReactNode;   // contenido delegado: lo que se muestra cuando hay datos
}

export const DataState = ({ loading, error, isEmpty, onRetry, emptyMessage = 'No hay datos disponibles.', children }: Props) => {
  if (loading) {
    return (
      <View style={styles.center} accessibilityRole="progressbar" accessibilityLabel="Cargando información">
        <ActivityIndicator size="large" color={color.action.primary} />
        <Text style={styles.message}>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center} accessibilityRole="alert" accessibilityLabel={`Error: ${error}`}>
        <Text style={[styles.message, { color: color.text.error }]}>{error}</Text>
        {onRetry && <CustomButton title="Reintentar" onPress={onRetry} variant="secondary" />}
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>{emptyMessage}</Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  message: {
    fontSize: typography.size.md,
    color: color.text.secondary,
    textAlign: 'center',
  },
});