import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBadge } from './StatusBadge';
import { color, spacing, radius, typography, touchTarget } from '../theme/tokens';

interface VehiculoCardData {
  tipo: string;
  placa: string | null;
  registro: string;
  provincia: string;
  estado: string;
}

interface Props {
  vehiculo: VehiculoCardData;
  onPress?: () => void;
}

export const VehiculoCard = ({ vehiculo, onPress }: Props) => {
  const esOperable = vehiculo.estado.toUpperCase().includes('OPERABLE') && !vehiculo.estado.toUpperCase().includes('NO ');

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`Vehículo ${vehiculo.tipo}, placa ${vehiculo.placa ?? 'sin placa'}, estado ${vehiculo.estado}`}
    >
      <View style={styles.header}>
        <Text style={styles.tipo} numberOfLines={1}>{vehiculo.tipo}</Text>
        <StatusBadge label={vehiculo.estado} tone={esOperable ? 'success' : 'error'} />
      </View>
      <Text style={styles.detail}>Placa: {vehiculo.placa ?? 'S/P'}</Text>
      <Text style={styles.detail}>Registro: {vehiculo.registro}</Text>
      <Text style={styles.detail}>Provincia: {vehiculo.provincia}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.background.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.border.default,
    padding: spacing.md,
    marginBottom: spacing.sm,
    minHeight: touchTarget.minSize,
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tipo: {
    flex: 1,
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: color.text.primary,
  },
  detail: {
    fontSize: typography.size.sm,
    color: color.text.secondary,
  },
});