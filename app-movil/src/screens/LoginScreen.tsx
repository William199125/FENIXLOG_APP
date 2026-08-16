import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { login } from '../services/auth.service';

export const LoginScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Datos incompletos', 'Ingresa usuario y contraseña.');
      return;
    }

    setLoading(true);
    try {
      const resultado = await login(username, password);
      console.log('Login exitoso:', resultado);
      Alert.alert('Bienvenido', `Sesión iniciada como ${resultado.usuario.username} (${resultado.usuario.rol})`);
      navigation.navigate('Home');
    } catch (error: any) {
      console.error('Error de login:', error?.response?.data || error.message);
      const mensaje = error?.response?.data?.error || 'No se pudo conectar con el servidor.';
      Alert.alert('Acceso Denegado', mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FENIX LOG</Text>
      <Text style={styles.subtitle}>Sistema de Gestión de Logística</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuario militar"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>INGRESAR</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f0f0f0' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#2e7d32', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', marginBottom: 15 },
  button: { backgroundColor: '#2e7d32', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});