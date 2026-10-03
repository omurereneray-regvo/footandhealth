import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { AuthScreen } from './src/screens/AuthScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { OnboardingScreen } from './src/screens/PlaceholderScreens';
import { ProductResultScreen } from './src/screens/ProductResultScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ScannerScreen } from './src/screens/ScannerScreen';
import { ThreatScreen } from './src/screens/ThreatScreen';
import { emptyNutritionProfile, NutritionProfile } from './src/data/profile';
import { colors, safeTop } from './src/theme';

const appIcon = require('./assets/branding/footandhealth-app-icon.png');
type Screen = 'login' | 'onboarding' | 'home' | 'scanner' | 'result' | 'profile' | 'history' | 'threats' | 'allergens';
type User = { id: string; email: string; displayName: string; avatarUrl: string | null };
type StoredProfile = NutritionProfile & { healthConditions?: string[] };

export default function App() {
  const [screen, setScreen] = useState<Screen>('login'); const [user, setUser] = useState<User | null>(null);
  const [selected, setSelected] = useState<string[]>([]); const [profile, setProfile] = useState<NutritionProfile>(emptyNutritionProfile);
  const [barcode, setBarcode] = useState(''); const [scans, setScans] = useState<string[]>([]);
  const loadAccount = async (signedUser?: User, newUser = false) => {
    const account = signedUser ?? await fetch('/api/auth/me').then(r => r.json()).then(d => d.user as User | null).catch(() => null);
    if (!account) return; setUser(account);
    const data = await fetch('/api/profile').then(r => r.ok ? r.json() : null).catch(() => null); const saved = data?.profile as StoredProfile | null;
    if (saved) { setSelected(saved.healthConditions ?? []); setProfile({ age: saved.age ?? '', gender: saved.gender ?? '', height: saved.height ?? '', weight: saved.weight ?? '', activity: saved.activity ?? '', goal: saved.goal ?? '', targetWeight: saved.targetWeight ?? '', dietaryPreference: saved.dietaryPreference ?? '', dislikes: saved.dislikes ?? '' }); }
    const history = await fetch('/api/scans').then(r => r.ok ? r.json() : null).catch(() => null); if (history?.scans) setScans(history.scans.map((item: { barcode: string }) => item.barcode));
    setScreen(newUser || !saved?.age ? 'onboarding' : 'home');
  };
  useEffect(() => { void loadAccount(); }, []);
  const saveProfile = async (next: NutritionProfile, conditions = selected) => { setProfile(next); const response = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...next, healthConditions: conditions }) }); if (!response.ok) throw new Error('Profil kaydedilemedi.'); };
  const scan = (code: string) => { setBarcode(code); setScans(old => [code, ...old.filter(item => item !== code)].slice(0, 100)); void fetch('/api/scans', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ barcode: code }) }); setScreen('result'); };
  const signedInTabs = user && ['home', 'profile', 'history', 'allergens'].includes(screen);
  return <View style={s.container}>
    {user && screen !== 'scanner' ? <Header user={user} onHome={() => setScreen('home')} onProfile={() => setScreen('profile')} /> : null}
    <View style={s.content}>
      {screen === 'login' && <AuthScreen onAuthenticated={loadAccount} />}
      {screen === 'onboarding' && <ProfileScreen selected={selected} onChange={setSelected} value={profile} onSave={saveProfile} onFinished={() => setScreen('home')} />}
      {screen === 'home' && <HomeScreen selected={selected} scans={scans} onProfile={() => setScreen('profile')} onScan={() => setScreen('scanner')} />}
      {screen === 'profile' && <ProfileScreen selected={selected} onChange={setSelected} value={profile} onSave={saveProfile} />}
      {screen === 'history' && <HistoryScreen scans={scans} onOpen={code => { setBarcode(code); setScreen('result'); }} />}
      {screen === 'scanner' && <ScannerScreen onClose={() => setScreen('home')} onResult={scan} />}
      {screen === 'result' && <ProductResultScreen barcode={barcode} onThreat={() => setScreen('threats')} onProfile={() => setScreen('profile')} onClose={() => setScreen('home')} />}
      {screen === 'threats' && <ThreatScreen barcode={barcode} selected={selected} onBack={() => setScreen('result')} />}
      {screen === 'allergens' && <View style={s.placeholder}><Ionicons name="nutrition-outline" size={38} color={colors.brand}/><Text style={s.placeholderTitle}>Alerjenler</Text><Text style={s.placeholderCopy}>Alerjen değerlendirme ekranını bir sonraki aşamada ekleyeceğiz.</Text></View>}
    </View>
    {signedInTabs ? <View style={s.tabShell}><Tab label="Ana Sayfa" icon="home-outline" active={screen === 'home'} onPress={() => setScreen('home')} /><Tab label="Alerjen" icon="nutrition-outline" active={screen === 'allergens'} onPress={() => setScreen('allergens')} /><Pressable onPress={() => setScreen('scanner')} style={s.scanTab}><Ionicons name="barcode-outline" size={26} color="#fff" /><Text style={s.scanText}>Tara</Text></Pressable><Tab label="Geçmiş" icon="time-outline" active={screen === 'history'} onPress={() => setScreen('history')} /><Tab label="Profil" icon="person-outline" active={screen === 'profile'} onPress={() => setScreen('profile')} /></View> : null}
    <StatusBar style="dark" />
  </View>;
}
function Header({ user, onHome, onProfile }: { user: User; onHome: () => void; onProfile: () => void }) { return <View style={s.header}><Pressable onPress={onHome} style={s.brandWrap}><Image source={appIcon} style={s.logoIcon} /><View><Text style={s.brandName}>FOOT & HEALTH</Text><Text style={s.brandSub}>Beslen bana uygun</Text></View></Pressable><Pressable onPress={onProfile} style={s.account}>{user.avatarUrl ? <Image source={{ uri: user.avatarUrl }} style={s.avatar} /> : <View style={s.avatarFallback}><Text style={s.avatarText}>{user.displayName.slice(0, 1).toUpperCase()}</Text></View>}<View style={s.accountCopy}><Text style={s.accountHint}>Profilim</Text><Text numberOfLines={1} style={s.accountName}>{user.displayName}</Text></View></Pressable></View>; }
function Tab({ label, icon, active, onPress }: { label: string; icon: React.ComponentProps<typeof Ionicons>['name']; active?: boolean; onPress: () => void }) { return <Pressable onPress={onPress} style={s.tab}><Ionicons name={icon} size={21} color={active ? colors.brand : '#829087'} /><Text style={[s.tabLabel, active && s.active]}>{label}</Text></Pressable>; }
const s = StyleSheet.create({ container: { flex: 1, paddingTop: safeTop, backgroundColor: '#FFFDF7' }, content: { flex: 1 }, placeholder:{flex:1,alignItems:'center',justifyContent:'center',padding:30,backgroundColor:'#FFFDF7'},placeholderTitle:{fontSize:25,fontWeight:'900',color:colors.ink,marginTop:12},placeholderCopy:{fontSize:13,lineHeight:20,textAlign:'center',color:colors.muted,marginTop:6}, header: { height: 68, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,253,247,0.97)', borderBottomWidth: 1, borderColor: '#E9E6D9' }, brandWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 }, logoIcon: { width: 37, height: 37, borderRadius: 12 }, brandName: { color: colors.ink, fontWeight: '900', fontSize: 11, letterSpacing: .45 }, brandSub: { color: colors.brand, fontSize: 9, fontWeight: '800', marginTop: 1 }, account: { flexDirection: 'row', alignItems: 'center', gap: 7, maxWidth: 145 }, avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#DDF1CC' }, avatarFallback: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: '#DDF1CC', borderWidth: 2, borderColor: '#fff' }, avatarText: { color: colors.brand, fontWeight: '900' }, accountCopy: { flexShrink: 1 }, accountHint: { color: '#829087', fontWeight: '800', fontSize: 9 }, accountName: { color: colors.ink, fontWeight: '900', fontSize: 12 }, tabShell: { height: 82, backgroundColor: '#fff', paddingHorizontal: 4, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderTopWidth: 1, borderColor: '#E9EDE8', shadowColor: '#143726', shadowOpacity: .09, shadowRadius: 12, elevation: 8 }, tab: { minWidth: 48, alignItems: 'center', gap: 3, paddingTop: 6 }, tabLabel: { color: '#829087', fontSize: 9, fontWeight: '800' }, active: { color: colors.brand }, scanTab: { width:68,height:68,marginTop:-30,alignItems:'center',justifyContent:'center',borderRadius:24,backgroundColor:colors.brand,borderWidth:5,borderColor:'#FFFDF7',shadowColor:colors.brand,shadowOpacity:.28,shadowRadius:10,elevation:8 }, scanText: { color: '#fff', fontSize: 10, fontWeight: '900', marginTop: 1 } });
