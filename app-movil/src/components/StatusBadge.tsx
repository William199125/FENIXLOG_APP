import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { color, spacing, radius, typography } from '../theme/tokens';

type StatusTone = 'success' | 'error';

interface Props {
  label: string;              // texto a mostrar (ej. "OPERABLE")
  tone: StatusTone;           // qué paleta semántica usar
}

const ICONS: Record<StatusTone, string> = {
  success: '●',
  error: '✕',
};

export const StatusBadge = ({ label, tone }: Props) => {
  const isSuccess = tone === 'success';
  return (
    <View
      style={[styles.badge, { backgroundColor: isSuccess ? color.status.successBg : color.status.errorBg }]}
      accessibilityRole="text"
      accessibilityLabel={`Estado: ${label}`}
    >
      {/* El ícono acompaña al color: la información NO depende solo del color */}
      <Text style={[styles.icon, { color: isSuccess ? color.status.successText : color.status.errorText }]}>
        {ICONS[tone]}
      </Text>
      <Text style={[styles.text, { color: isSuccess ? color.status.successText : color.status.errorText }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    gap: spacing.xs,
  },
  icon: {
    fontSize: typography.size.xs,
  },
  text: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
  },
});