import { Platform } from 'react-native';

const tintColorLight = '#050505';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FFFFFF',
    background: '#050505', // Твій фірмовий глибокий чорний
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#444444',
    tabIconSelected: tintColorDark,
    
    // Твоя Glassmorphism палітра з TWA
    glass: 'rgba(255, 255, 255, 0.05)',  // white/5
    border: 'rgba(255, 255, 255, 0.1)', // white/10
    textSecondary: 'rgba(255, 255, 255, 0.4)', // white/40
    textMuted: 'rgba(255, 255, 255, 0.2)', // white/20
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    mono: 'Courier New',
  },
  default: {
    sans: 'normal',
    mono: 'monospace',
  },
});

export const STOIC_STYLE = {
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 2,
    ultra: 6, // Для лоадера та заголовків
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32, // Твої великі картки
  }
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};