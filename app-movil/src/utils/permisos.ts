import { Alert, Linking, Platform } from 'react-native';

export type EstadoPermiso = 'no_determinado' | 'concedido' | 'denegado' | 'denegado_permanente';

interface ResultadoPermisoNativo {
  status: 'granted' | 'denied' | 'undetermined';
  canAskAgain: boolean;
}

// Traduce el resultado crudo de Expo (status + canAskAgain) a nuestros 4 estados de dominio
function interpretarResultado(resultado: ResultadoPermisoNativo): EstadoPermiso {
  if (resultado.status === 'granted') return 'concedido';
  if (resultado.status === 'undetermined') return 'no_determinado';
  // status === 'denied'
  return resultado.canAskAgain ? 'denegado' : 'denegado_permanente';
}

/**
 * Flujo estándar de solicitud "en el momento de uso": explica primero, luego solicita.
 * Recibe las funciones de Expo específicas de cada capacidad (cámara, ubicación, etc.)
 * para no acoplar este archivo a una sola librería.
 */
export async function solicitarPermisoConExplicacion(params: {
  tituloExplicacion: string;
  mensajeExplicacion: string;
  obtenerEstadoActual: () => Promise<ResultadoPermisoNativo>;
  solicitar: () => Promise<ResultadoPermisoNativo>;
}): Promise<EstadoPermiso> {
  const actual = interpretarResultado(await params.obtenerEstadoActual());

  if (actual === 'concedido') return 'concedido';
  if (actual === 'denegado_permanente') return 'denegado_permanente';

  // Solo mostramos la explicación previa si es la primera vez o si fue denegado (no permanente)
  const aceptaContinuar = await new Promise<boolean>((resolve) => {
    Alert.alert(params.tituloExplicacion, params.mensajeExplicacion, [
      { text: 'Ahora no', style: 'cancel', onPress: () => resolve(false) },
      { text: 'Continuar', onPress: () => resolve(true) },
    ]);
  });

  if (!aceptaContinuar) return actual; // el usuario canceló la explicación, no llegamos a pedir el permiso del sistema

  const resultado = await params.solicitar();
  return interpretarResultado(resultado);
}

export function abrirAjustesDeLaApp() {
  Linking.openSettings();
}

export function mostrarAlertaDenegacionPermanente(nombreCapacidad: string) {
  Alert.alert(
    'Permiso bloqueado',
    `Has denegado permanentemente el acceso a ${nombreCapacidad}. Para usar esta función, actívalo manualmente desde los ajustes del sistema.`,
    [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Abrir ajustes', onPress: abrirAjustesDeLaApp },
    ]
  );
}