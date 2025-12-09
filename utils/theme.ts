export interface Theme {
  colors: {
    primary: string;
    onPrimary: string;
    primaryContainer: string;
    onPrimaryContainer: string;
    secondary: string;
    onSecondary: string;
    secondaryContainer: string;
    onSecondaryContainer: string;
    tertiary: string;
    onTertiary: string;
    tertiaryContainer: string;
    onTertiaryContainer: string;
    error: string;
    onError: string;
    errorContainer: string;
    onErrorContainer: string;
    background: string;
    onBackground: string;
    surface: string;
    onSurface: string;
    surfaceVariant: string;
    onSurfaceVariant: string;
    outline: string;
    outlineVariant: string;
    scrim: string;
    inverseSurface: string;
    inverseOnSurface: string;
    inversePrimary: string;
  };
}

export const lightTheme: Theme = {
  colors: {
    primary: '#2563EB',
    onPrimary: '#FFFFFF',
    primaryContainer: '#DBEAFE',
    onPrimaryContainer: '#001966',
    secondary: '#0891B2',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#CFFAFE',
    onSecondaryContainer: '#001F26',
    tertiary: '#7C3AED',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#EDE9FE',
    onTertiaryContainer: '#2E0D5F',
    error: '#DC2626',
    onError: '#FFFFFF',
    errorContainer: '#FEE2E2',
    onErrorContainer: '#5F0F0F',
    background: '#FAFAFA',
    onBackground: '#1A1A1A',
    surface: '#FFFFFF',
    onSurface: '#1A1A1A',
    surfaceVariant: '#F3F4F6',
    onSurfaceVariant: '#4B5563',
    outline: '#79747E',
    outlineVariant: '#C7C7CC',
    scrim: '#000000',
    inverseSurface: '#1A1A1A',
    inverseOnSurface: '#F1F5F9',
    inversePrimary: '#B3D9FF',
  },
};

export const darkTheme: Theme = {
  colors: {
    primary: '#90CAF9',
    onPrimary: '#003D82',
    primaryContainer: '#004DB3',
    onPrimaryContainer: '#D6E3FF',
    secondary: '#80DEEA',
    onSecondary: '#003D47',
    secondaryContainer: '#005A66',
    onSecondaryContainer: '#B3F0FF',
    tertiary: '#E9D5FF',
    onTertiary: '#48006D',
    tertiaryContainer: '#681C9A',
    onTertiaryContainer: '#F3E0FF',
    error: '#FF8A80',
    onError: '#5F0F0F',
    errorContainer: '#B3261E',
    onErrorContainer: '#F9DEDC',
    background: '#0F0F0F',
    onBackground: '#E8E8E8',
    surface: '#1A1A1A',
    onSurface: '#E8E8E8',
    surfaceVariant: '#2D3141',
    onSurfaceVariant: '#C7C7CC',
    outline: '#938F99',
    outlineVariant: '#49454E',
    scrim: '#000000',
    inverseSurface: '#E8E8E8',
    inverseOnSurface: '#1A1A1A',
    inversePrimary: '#2563EB',
  },
};
