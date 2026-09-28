/**
 * Akhyana design tokens.
 * The product intentionally renders as a white-first experience across system appearances.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // 1. Core Backgrounds & Surfaces
    background: '#F8F3E8', // Parchment / Warm Ivory
    surface: '#FFFDF7', // Soft Ivory
    card: '#FFFDF7', // Soft Ivory
    cardBorder: '#E8E1D3', // Subtle warm neutral
    border: '#E8E1D3', // Subtle warm neutral
    borderStrong: '#D2C8B8', // Slightly stronger warm neutral divider/border
    backgroundElement: '#EFE9DC', // Warm ivory element / container
    backgroundSelected: '#E5DCBD', // Subtle gold/parchment selection tint
    backgroundSecondary: '#EFE9DC', // Secondary parchment surface

    // 2. Primary Brand Color — Deep Indigo (Akhyana Identity)
    primary: '#243B64',
    primaryText: '#FFFDF7',
    primaryLight: '#E8EDF5', // Soft indigo tint

    // 3. Secondary / Action Color — Terracotta (Warmth & Energy)
    secondary: '#C96B4B',
    secondaryLight: '#F9EBE6', // Soft terracotta tint

    // 4. Achievement / Reward Color — Muted Gold
    accent: '#D4A84F',
    accentLight: '#FAF3E3', // Soft gold tint
    accentText: '#7D5C1E', // Dark gold readable text

    // 5. Discovery / Knowledge Color — Muted Teal
    discovery: '#3F7C78',
    discoveryLight: '#E6F0EF', // Soft teal tint
    discoveryText: '#265350', // Dark teal readable text

    // 6. Typography & Neutrals
    text: '#252525', // Charcoal (Main Text)
    textSecondary: '#6F6A60', // Warm Gray (Secondary Text)
    textMuted: '#6F6A60', // Warm Gray
    mutedText: '#6F6A60', // Semantic alias

    // 7. Semantic Feedback Colors
    success: '#4F8061',
    successLight: '#E8F1EC',
    error: '#B84C4C',
    errorLight: '#FCECEC',
    warning: '#D4A84F',
    warningLight: '#FAF3E3',

    // 8. Named Color Semantic Shortcuts
    indigo: '#243B64',
    terracotta: '#C96B4B',
    gold: '#D4A84F',
    teal: '#3F7C78',
    charcoal: '#252525',
    warmGray: '#6F6A60',
    parchment: '#F8F3E8',
    ivory: '#FFFDF7',

    // 9. Backward Compatibility Mappings (maps legacy olive keys to new Akhyana identity)
    oliveDeep: '#243B64',
    oliveDark: '#1E3254',
    olive: '#243B64',
    oliveMedium: '#C96B4B',
    sage: '#3F7C78',
    sageLight: '#E8EDF5',
    olivePale: '#EFE9DC',
    oliveMuted: '#6F6A60',
  },
  dark: {
    // Akhyana renders a consistent white/parchment-first experience across appearances
    background: '#F8F3E8',
    surface: '#FFFDF7',
    card: '#FFFDF7',
    cardBorder: '#E8E1D3',
    border: '#E8E1D3',
    borderStrong: '#D2C8B8',
    backgroundElement: '#EFE9DC',
    backgroundSelected: '#E5DCBD',
    backgroundSecondary: '#EFE9DC',
    primary: '#243B64',
    primaryText: '#FFFDF7',
    primaryLight: '#E8EDF5',
    secondary: '#C96B4B',
    secondaryLight: '#F9EBE6',
    accent: '#D4A84F',
    accentLight: '#FAF3E3',
    accentText: '#7D5C1E',
    discovery: '#3F7C78',
    discoveryLight: '#E6F0EF',
    discoveryText: '#265350',
    text: '#252525',
    textSecondary: '#6F6A60',
    textMuted: '#6F6A60',
    mutedText: '#6F6A60',
    success: '#4F8061',
    successLight: '#E8F1EC',
    error: '#B84C4C',
    errorLight: '#FCECEC',
    warning: '#D4A84F',
    warningLight: '#FAF3E3',
    indigo: '#243B64',
    terracotta: '#C96B4B',
    gold: '#D4A84F',
    teal: '#3F7C78',
    charcoal: '#252525',
    warmGray: '#6F6A60',
    parchment: '#F8F3E8',
    ivory: '#FFFDF7',
    oliveDeep: '#243B64',
    oliveDark: '#1E3254',
    olive: '#243B64',
    oliveMedium: '#C96B4B',
    sage: '#3F7C78',
    sageLight: '#E8EDF5',
    olivePale: '#EFE9DC',
    oliveMuted: '#6F6A60',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'Georgia',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'sans-serif-medium',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    serif: '"Georgia", "Times New Roman", serif',
    rounded: 'system-ui, sans-serif',
    mono: 'monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 48,
  seven: 64,
  eight: 80,
  nine: 96,
} as const;

export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
