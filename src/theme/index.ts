import { Platform, StatusBar } from 'react-native';

export const colors = {
  ink: '#13251C', muted: '#627168', canvas: '#F6F8F5', surface: '#FFFFFF',
  brand: '#166D4A', brandSoft: '#DCF4E8', line: '#E5EAE6', orange: '#B85B14',
  orangeSoft: '#FFF0E2', red: '#B93838', redSoft: '#FDEBEC', blue: '#286A8D',
};

export const spacing = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 };
export const radius = { sm: 12, md: 18, lg: 26, pill: 999 };
export const safeTop = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 12 : 20;
