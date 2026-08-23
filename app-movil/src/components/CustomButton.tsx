import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { color, spacing, radius, typography, touchTarget } from '../theme/tokens';

// ── INTERFAZ PÚBLICA ─────────────────────────────────────
interface Props {
  title: string;                       // datos de entrada
  onPress: () => void;                 // devolución de llamada
  variant?: 'primary' | 'secondary';   // configuración de presentación
  loading?: boolean;                   // estado de carga
  disabled?: boolean;
  style?: ViewStyle;                   // permite ajustes puntuales sin romper el token
  accessibilityLabel?: string;         // etiqueta semántica explícita (opcional; usa title por defecto)
}

export const CustomButton = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  accessibilityLabel,
}: Props) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.button, variant === 'secondary' && styles.secondary, isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? color.action.primary : color.text.onPrimary} />
      ) : (
        <Text style={[styles.text, variant === 'secondary' && styles.textSecondary]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: color.action.primary,
    paddingVertical: spacing.md - 1,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
    width: '100%',
    minHeight: touchTarget.minSize,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: color.action.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: color.text.onPrimary,
    fontWeight: typography.weight.bold,
    fontSize: typography.size.md,
  },
  textSecondary: {
    color: color.action.primary,
  },
});