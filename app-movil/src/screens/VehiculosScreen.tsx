import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VehiculoCard } from '../components/VehiculoCard';
import { DataState } from '../components/DataState';
import { CustomButton } from '../components/CustomButton';
import { obtenerVehiculos, crearVehiculo } from '../data/vehiculo.repository';
import { Vehiculo } from '../models/vehiculo.model';
import { color, spacing, typography } from '../theme/tokens';

function formatoAntiguedad(iso: string | null): string {
  if (!iso) return '';
  const minutos = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutos < 1) return 'Actualizado justo ahora';
  if (minutos < 60) return `Actualizado hace ${minutos} min`;
  return `Actualizado hace ${Math.round(minutos / 60)} h`;
}

export const VehiculosScreen = ({ navigation }: any) => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sinConexion, setSinConexion] = useState(false);
  const [antiguedad, setAntiguedad] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    const resultado = await obtenerVehiculos(); // <- la pantalla NO sabe si vino de red o de SQLite
    setVehiculos(resultado.vehiculos);
    setSinConexion(resultado.sinConexion);
    setAntiguedad(resultado.antiguedad);
    setError(resultado.error?.mensaje ?? null);
    setLoading(false);
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const registrarVehiculoDePrueba = async () => {
    await crearVehiculo({
      unidad: 'BIMOT38',
      tipo: 'VEHÍCULO DE PRUEBA',
      registro: `TEST-${Date.now()}`,
      estado: 'OPERABLE',
      enUnidad: true,
      empleo: 'PRUEBA',
      provincia: 'MACHACHI',
    });
    cargar();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
      <Text style={styles.title} accessibilityRole="header">Vehículos — BIMOT38</Text>
      {sinConexion && (
        <View style={styles.bannerOffline} accessibilityRole="alert">
          <Text style={styles.bannerText}>Sin conexión — mostrando datos guardados</Text>
        </View>
      )}
      {antiguedad && <Text style={styles.antiguedad}>{formatoAntiguedad(antiguedad)}</Text>}
      <DataState loading={loading} error={error} isEmpty={vehiculos.length === 0} onRetry={cargar}>
        <FlatList
          data={vehiculos}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <VehiculoCard
              vehiculo={{ tipo: item.tipo, placa: item.placa, registro: item.registro, provincia: item.provincia, estado: item.estadoOperativo }}
              onPress={() => navigation.navigate('RegistrarEvidencia', { vehiculoId: item.id })}
            />
          )}
          contentContainerStyle={{ paddingBottom: spacing.lg }}
        />
      </DataState>
      <CustomButton title="Registrar vehículo de prueba (offline)" onPress={registrarVehiculoDePrueba} variant="secondary" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.background.default, padding: spacing.md },
  title: { fontSize: typography.size.xl, fontWeight: typography.weight.bold, color: color.text.primary, marginBottom: spacing.sm },
  bannerOffline: { backgroundColor: color.status.errorBg, padding: spacing.sm, borderRadius: 8, marginBottom: spacing.xs },
  bannerText: { color: color.status.errorText, fontSize: typography.size.sm, fontWeight: typography.weight.bold },
  antiguedad: { color: color.text.secondary, fontSize: typography.size.xs, marginBottom: spacing.sm },
});