import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { CustomButton } from '../components/CustomButton';
import {
  solicitarPermisoConExplicacion, mostrarAlertaDenegacionPermanente, EstadoPermiso,
} from '../utils/permisos';
import { encolarOperacion } from '../services/vehiculoLocal.service'; // reutilizamos la misma cola offline
import { procesarCola } from '../services/syncQueue';
import { color, spacing, typography, radius } from '../theme/tokens';

export const RegistrarEvidenciaScreen = ({ route, navigation }: any) => {
  const vehiculoId: number | undefined = route?.params?.vehiculoId;

  const [fotoBase64, setFotoBase64] = useState<string | null>(null);
  const [ubicacion, setUbicacion] = useState<{ latitud: number; longitud: number } | null>(null);
  const [enviando, setEnviando] = useState(false);

  // ── CÁMARA (capacidad esencial) ──────────────────────────
  const tomarFoto = async () => {
    const estado: EstadoPermiso = await solicitarPermisoConExplicacion({
      tituloExplicacion: 'Acceso a la cámara',
      mensajeExplicacion: 'FENIX LOG necesita usar la cámara para registrar evidencia fotográfica del vehículo en esta orden de mantenimiento.',
      obtenerEstadoActual: () => ImagePicker.getCameraPermissionsAsync(),
      solicitar: () => ImagePicker.requestCameraPermissionsAsync(),
    });

    if (estado === 'denegado_permanente') {
      mostrarAlertaDenegacionPermanente('la cámara');
      return;
    }
    if (estado !== 'concedido') {
      return; // denegado (no permanente) o el usuario canceló la explicación: la orden puede continuar sin foto
    }

    const resultado = await ImagePicker.launchCameraAsync({
      quality: 0.5,
      base64: true,
    });

    if (!resultado.canceled && resultado.assets[0].base64) {
      setFotoBase64(resultado.assets[0].base64);
    }
  };

  // ── UBICACIÓN (capacidad opcional) ───────────────────────
  const obtenerUbicacion = async () => {
    const estado: EstadoPermiso = await solicitarPermisoConExplicacion({
      tituloExplicacion: 'Acceso a la ubicación',
      mensajeExplicacion: 'FENIX LOG puede registrar dónde se levantó esta orden. Esto es opcional: la orden se guarda igual si no lo permites.',
      obtenerEstadoActual: () => Location.getForegroundPermissionsAsync(),
      solicitar: () => Location.requestForegroundPermissionsAsync(),
    });

    if (estado === 'denegado_permanente') {
      mostrarAlertaDenegacionPermanente('la ubicación');
      return;
    }
    if (estado !== 'concedido') {
      return; // opcional: la orden sigue siendo válida sin coordenadas
    }

    // El permiso puede estar concedido pero el GPS del dispositivo apagado: son dos condiciones distintas.
    const servicioActivo = await Location.hasServicesEnabledAsync();
    if (!servicioActivo) {
      setUbicacion(null);
      return;
    }

    const posicion = await Location.getCurrentPositionAsync({});
    setUbicacion({ latitud: posicion.coords.latitude, longitud: posicion.coords.longitude });
  };

  // ── Guardar orden (integración con la cola offline de la Semana 12/13) ──
  const guardarOrden = async () => {
    setEnviando(true);
    await encolarOperacion('CREAR_ORDEN', {
      descripcion: 'Inspección con evidencia fotográfica',
      vehiculoId,
      detalles: [],
      fotoBase64: fotoBase64 ?? undefined,
      latitud: ubicacion?.latitud,
      longitud: ubicacion?.longitud,
    });
    await procesarCola();
    setEnviando(false);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title} accessibilityRole="header">Registrar evidencia</Text>

      <CustomButton title="Tomar foto (cámara)" onPress={tomarFoto} />
      {fotoBase64 && (
        <Image
          source={{ uri: `data:image/jpeg;base64,${fotoBase64}` }}
          style={styles.preview}
          accessibilityLabel="Vista previa de la evidencia fotográfica capturada"
        />
      )}

      <CustomButton title="Registrar ubicación (opcional)" onPress={obtenerUbicacion} variant="secondary" />
      {ubicacion && (
        <Text style={styles.coordenadas}>
          Ubicación registrada: {ubicacion.latitud.toFixed(5)}, {ubicacion.longitud.toFixed(5)}
        </Text>
      )}

      <CustomButton title="Guardar orden" onPress={guardarOrden} loading={enviando} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: spacing.md, backgroundColor: color.background.default, flexGrow: 1 },
  title: { fontSize: typography.size.xl, fontWeight: typography.weight.bold, color: color.text.primary, marginBottom: spacing.lg },
  preview: { width: '100%', height: 220, borderRadius: radius.md, marginBottom: spacing.md },
  coordenadas: { color: color.text.secondary, fontSize: typography.size.sm, marginBottom: spacing.md },
});