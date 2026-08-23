import { colors as primitiveColors } from './colors';

// ── NIVEL PRIMITIVO ──────────────────────────────────────
// Valores crudos, sin significado de uso. Ya existían en colors.ts;
// aquí solo agregamos los primitivos que faltaban (texto secundario y error de texto).
const primitives = {
  ...primitiveColors,
  errorText: '#B71C1C',      // contraste ~5.9:1 sobre background/surface
  textSecondary: '#5A6B5C',  // contraste ~5.1:1 sobre background/surface
  successBg: '#E6F0E8',
  successText: '#1B4332',
  errorBg: '#FBE9E9',
};

// ── NIVEL SEMÁNTICO ──────────────────────────────────────
// Le da un ROL a cada primitivo. Los componentes SOLO deben leer de aquí,
// nunca de `primitives` ni de valores hexadecimales sueltos.
export const color = {
  background: {
    default: primitives.background,
    surface: primitives.surface,
  },
  text: {
    primary: primitives.text,
    secondary: primitives.textSecondary,
    onPrimary: primitives.textLight,
    error: primitives.errorText,
  },
  border: {
    default: primitives.border,
  },
  action: {
    primary: primitives.primary,
    primaryPressed: '#1D3629', // variante ~15% más oscura para :pressed
  },
  status: {
    successBg: primitives.successBg,
    successText: primitives.successText,
    errorBg: primitives.errorBg,
    errorText: primitives.errorText,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 4,
  md: 8,
  lg: 16,
  full: 999,
};

export const typography = {
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 28,
  },
  weight: {
    regular: '400' as const,
    bold: '700' as const,
  },
};

// Área táctil mínima recomendada por WCAG 2.5.5 (AAA) y guías de Android/iOS
export const touchTarget = {
  minSize: 44,
};