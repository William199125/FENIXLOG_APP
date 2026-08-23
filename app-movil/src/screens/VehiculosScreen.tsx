import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { VehiculoCard } from '../components/VehiculoCard';
import { DataState } from '../components/DataState';
import { obtenerVehiculos, Vehiculo } from '../services/vehiculo.service';
import { color, spacing, typography } from '../theme/tokens';

export const VehiculosScreen = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerVehiculos();
      setVehiculos(data);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">Vehículos — BIMOT38</Text>

      <DataState
        loading={loading}
        error={error}
        isEmpty={vehiculos.length === 0}
        onRetry={cargar}
        emptyMessage="No hay vehículos registrados."
      >
        <FlatList
          data={vehiculos}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <VehiculoCard vehiculo={item} />}
          contentContainerStyle={{ paddingBottom: spacing.lg }}
        />
      </DataState>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background.default,
    padding: spacing.md,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: color.text.primary,
    marginBottom: spacing.md,
  },
});