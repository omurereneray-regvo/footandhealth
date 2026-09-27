import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { OnboardingScreen, ResultScreen, WelcomeScreen } from './src/screens/PlaceholderScreens';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ScannerScreen } from './src/screens/ScannerScreen';
import { colors, safeTop } from './src/theme';

export default function App() {
  const [screen, setScreen] = useState<'login' | 'onboarding' | 'home' | 'scanner' | 'result' | 'profile'>('login');
  const [selected, setSelected] = useState<string[]>([]);
  const [barcode, setBarcode] = useState('');
  const showTabs = screen === 'home' || screen === 'profile';
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {screen === 'login' && <WelcomeScreen onContinue={() => setScreen('onboarding')} />}
        {screen === 'onboarding' && <OnboardingScreen onComplete={(choices) => { setSelected(choices); setScreen('home'); }} />}
        {screen === 'home' && <HomeScreen selected={selected} onProfile={() => setScreen('profile')} onScan={() => setScreen('scanner')} />}
        {screen === 'profile' && <ProfileScreen selected={selected} onChange={setSelected} />}
        {screen === 'scanner' && <ScannerScreen onClose={() => setScreen('home')} onResult={(code) => { setBarcode(code); setScreen('result'); }} />}
        {screen === 'result' && <ResultScreen barcode={barcode} selected={selected} onProfile={() => setScreen('profile')} onClose={() => setScreen('home')} />}
      </View>
      {showTabs && <View style={styles.tabs}><Tab label="Ana Sayfa" icon="⌂" active={screen === 'home'} onPress={() => setScreen('home')}/><Tab label="Tara" icon="▥" onPress={() => setScreen('scanner')}/><Tab label="Profil" icon="◉" active={screen === 'profile'} onPress={() => setScreen('profile')}/></View>}
      <StatusBar style="dark" />
    </View>
  );
}
function Tab({ label, icon, active, onPress }: { label: string; icon: string; active?: boolean; onPress?: () => void }) { return <Pressable accessibilityRole="tab" onPress={onPress} style={styles.tab}><Text style={[styles.tabIcon, active && styles.active]}>{icon}</Text><Text style={[styles.tabLabel, active && styles.active]}>{label}</Text></Pressable>; }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
    paddingTop: safeTop,
  },
  content: { flex: 1 }, tabs: { height: 78, backgroundColor: colors.surface, borderTopWidth: 1, borderColor: colors.line, flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10 }, tab: { minWidth: 72, alignItems: 'center', gap: 3 }, tabIcon: { color: colors.muted, fontSize: 21 }, tabLabel: { color: colors.muted, fontSize: 11, fontWeight: '700' }, active: { color: colors.brand },
});
