import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VehiculoCard } from '../components/VehiculoCard';
import { DataState } from '../components/DataState';
import { CustomButton } from '../components/CustomButton';
import { obtenerVehiculos, Vehiculo } from '../services/vehiculo.service';
import {
  guardarCacheVehiculos, obtenerCacheVehiculos, obtenerFechaSincronizacion, encolarOperacion,
} from '../services/vehiculoLocal.service';
import { procesarCola } from '../services/syncQueue';
import { color, spacing, typography } from '../theme/tokens';

function formatoAntiguedad(iso: string | null): string {
  if (!iso) return '';
  const minutos = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutos < 1) return 'Actualizado justo ahora';
  if (minutos < 60) return `Actualizado hace ${minutos} min`;
  const horas = Math.round(minutos / 60);
  return `Actualizado hace ${horas} h`;
}

export const VehiculosScreen = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sinConexion, setSinConexion] = useState(false);
  const [antiguedad, setAntiguedad] = useState<string | null>(null);

  const cargarDesdeCache = useCallback(async (mensajeSiVacio?: string) => {
    const cache = await obtenerCacheVehiculos();
    setVehiculos(cache);
    setSinConexion(true);
    setAntiguedad(await obtenerFechaSincronizacion());
    if (cache.length === 0 && mensajeSiVacio) setError(mensajeSiVacio);
  }, []);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);

    const estadoRed = await NetInfo.fetch();
    // Solo confiamos en que hay internet si la librería lo confirmó explícitamente (=== true).
    // null significa "aún no determinado" y false significa "confirmado sin internet";
    // en ambos casos, tratamos como sin conexión por seguridad.
    const hayInternetSegunNetInfo = estadoRed.isConnected === true && estadoRed.isInternetReachable === true;

    if (hayInternetSegunNetInfo) {
      try {
        const data = await obtenerVehiculos();
        await guardarCacheVehiculos(data);
        setVehiculos(data);
        setSinConexion(false);
        setAntiguedad(await obtenerFechaSincronizacion());
        await procesarCola();
      } catch (e: any) {
        // Aunque NetInfo dijo que había internet, la petición real falló
        // (por ejemplo, una interfaz VPN presente pero sin salida real).
        // En vez de mostrar un error duro, caemos a los datos locales.
        await cargarDesdeCache('No se pudo conectar con el servidor y no hay datos guardados localmente.');
      }
    } else {
      await cargarDesdeCache('Sin conexión y sin datos guardados localmente.');
    }

    setLoading(false);
  }, [cargarDesdeCache]);

  useEffect(() => {
    cargar();
    const unsubscribe = NetInfo.addEventListener((estado) => {
      if (estado.isConnected === true && estado.isInternetReachable === true) {
        procesarCola();
      }
    });
    return () => unsubscribe();
  }, [cargar]);

  const registrarVehiculoDePrueba = async () => {
    await encolarOperacion('CREAR', {
      unidad: 'BIMOT38',
      tipo: 'VEHÍCULO DE PRUEBA (offline)',
      registro: `TEST-${Date.now()}`,
      estado: 'OPERABLE',
      enUnidad: true,
      empleo: 'PRUEBA',
      provincia: 'MACHACHI',
    });
    await procesarCola();
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
          renderItem={({ item }) => <VehiculoCard vehiculo={item} />}
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