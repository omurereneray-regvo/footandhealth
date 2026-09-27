import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { LoginScreen, OnboardingScreen, ResultScreen, ScannerScreen } from './src/screens/PlaceholderScreens';
import { colors, safeTop } from './src/theme';

export default function App() {
  const [screen, setScreen] = useState<'login' | 'onboarding' | 'home' | 'scanner' | 'result'>('login');
  const showTabs = screen === 'home';
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {screen === 'login' && <LoginScreen onContinue={() => setScreen('onboarding')} />}
        {screen === 'onboarding' && <OnboardingScreen onComplete={() => setScreen('home')} />}
        {screen === 'home' && <HomeScreen onScan={() => setScreen('scanner')} />}
        {screen === 'scanner' && <ScannerScreen onResult={() => setScreen('result')} />}
        {screen === 'result' && <ResultScreen onClose={() => setScreen('home')} />}
      </View>
      {showTabs && <View style={styles.tabs}><Tab label="Ana Sayfa" icon="⌂" active/><Tab label="Tara" icon="▥" onPress={() => setScreen('scanner')}/><Tab label="Profil" icon="◉"/></View>}
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
