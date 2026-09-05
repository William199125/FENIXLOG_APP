import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { secureAuth } from './src/services/secureAuth';
import { color } from './src/theme/tokens';

export default function App() {
  const [listo, setListo] = useState(false);
  const [sesionActiva, setSesionActiva] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await secureAuth.init();
      setSesionActiva(!!token);
      setListo(true);
    })();
  }, []);

  if (!listo) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: color.background.default }}>
        <ActivityIndicator size="large" color={color.action.primary} />
      </View>
    );
  }

  return <AppNavigator sesionActiva={sesionActiva} />;
}