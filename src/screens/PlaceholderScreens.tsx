import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton, Card } from '../components/ui';
import { colors, spacing } from '../theme';

const welcomeArt = require('../../assets/branding/welcome-art.jpg');

type HealthCondition = { label: string; icon: string; background: string };

const conditions: HealthCondition[] = [
  { label: 'Diyabet', icon: '●', background: '#FFF0F0' }, { label: 'Çölyak', icon: '✦', background: '#FFF8E8' },
  { label: 'Hipertansiyon', icon: '♥', background: '#FFF0F2' }, { label: 'Laktoz intoleransı', icon: '▯', background: '#ECF6FF' },
  { label: 'Süt alerjisi', icon: '◆', background: '#FFF8E5' }, { label: 'Fındık/fıstık alerjisi', icon: '●', background: '#F9F0E7' },
  { label: 'Böbrek hastalığı', icon: '◉', background: '#FFF0F2' }, { label: 'Fenilketonüri', icon: '⌘', background: '#EDF6FF' },
  { label: 'İrritabl bağırsak sendromu (IBS)', icon: '◌', background: '#F4F0FF' }, { label: 'Diğer', icon: '•••', background: '#F1F9EA' },
];

export function WelcomeScreen({ onContinue }: { onContinue: () => void }) {
  return <View style={styles.welcome}><Image source={welcomeArt} resizeMode="cover" style={styles.welcomeArt} accessibilityLabel="Beslen Bana Uygun karşılama görseli" /><Pressable accessibilityRole="button" accessibilityLabel="Hemen Başla" onPress={onContinue} style={styles.startHitArea} /></View>;
}

export function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (condition: string) => setSelected((current) => current.includes(condition) ? current.filter((item) => item !== condition) : [...current, condition]);
  return <ScrollView style={styles.onboarding} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <View style={styles.progressRow}><Text style={styles.back}>‹</Text><View style={[styles.progress, styles.progressActive]} /><View style={styles.progress} /><View style={styles.progress} /></View>
    <View style={styles.heroShape}><Text style={styles.heroLeaf}>✦</Text><Text style={styles.heroCheck}>✓</Text></View>
    <Text style={styles.title}>Sağlık durumlarını{'\n'}seç</Text>
    <Text style={styles.copy}>Sana özel değerlendirme yapabilmemiz için geçerli olan sağlık durumlarını seçebilirsin. Birden fazla seçenek işaretleyebilirsin.</Text>
    <View style={styles.conditionGrid}>{conditions.map((condition) => { const isSelected = selected.includes(condition.label); return <Pressable key={condition.label} accessibilityRole="checkbox" accessibilityState={{ checked: isSelected }} onPress={() => toggle(condition.label)} style={[styles.condition, { backgroundColor: condition.background }, isSelected && styles.conditionSelected]}><Text style={styles.conditionIcon}>{condition.icon}</Text><Text style={styles.conditionLabel}>{condition.label}</Text><View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>{isSelected && <Text style={styles.check}>✓</Text>}</View></Pressable>; })}</View>
    <Text style={styles.selectionHint}>{selected.length ? `${selected.length} sağlık durumu seçildi` : 'İstersen daha sonra profilinden değiştirebilirsin.'}</Text>
    <AppButton label="Devam Et  →" onPress={onComplete} />
  </ScrollView>;
}

export function ScannerScreen({ onResult }: { onResult: () => void }) { return <View style={[styles.center, styles.scanner]}><Text style={styles.logo}>BARKOD TARA</Text><View style={styles.camera}><Text style={styles.scanMark}>▥</Text><Text style={styles.cameraCopy}>Kamerayı ürün barkoduna tutun</Text></View><AppButton label="Demo sonucu göster" onPress={onResult} tone="soft"/><Text style={styles.legal}>Kamera izni ve EAN/UPC tarama Phase 4’te eklenecek.</Text></View>; }
export function ResultScreen({ onClose }: { onClose: () => void }) { return <ScrollView contentContainerStyle={styles.scroll}><Text style={styles.kicker}>ÜRÜN SONUCU</Text><Card><View style={styles.productImage}><Text style={styles.productImageText}>Ürün görseli</Text></View><Text style={styles.cardTitle}>Ürün adı</Text><Text style={styles.cardCopy}>Marka · Gramaj</Text></Card><Card style={{ backgroundColor: '#FFF7E9', borderColor: '#F3D8AB' }}><Text style={styles.warning}>● Dikkat</Text><Text style={styles.cardTitle}>Sağlık özeti hazırlanıyor</Text><Text style={styles.cardCopy}>Değerlendirme, seçilen tercihler ve doğrulanmış ürün verileriyle gösterilecek.</Text></Card><Text style={styles.legal}>Bu uygulama tıbbi tavsiye yerine geçmez.</Text><AppButton label="Ana sayfaya dön" onPress={onClose}/></ScrollView>; }

const styles = StyleSheet.create({
  welcome: { flex: 1, backgroundColor: '#FFFDF7' }, welcomeArt: { width: '100%', height: '100%' }, startHitArea: { position: 'absolute', bottom: '3.5%', left: '8%', right: '8%', height: '9%' },
  onboarding: { flex: 1, backgroundColor: '#FFFDF7' }, scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: 40, minHeight: '100%' }, progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10 }, back: { color: colors.brand, fontSize: 42, lineHeight: 36, marginRight: 4 }, progress: { width: 68, height: 8, backgroundColor: '#DCE1DC', borderRadius: 8 }, progressActive: { backgroundColor: colors.brand }, heroShape: { position: 'absolute', right: -23, top: 50, width: 148, height: 148, borderRadius: 74, backgroundColor: '#E4F4C9', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '14deg' }] }, heroLeaf: { color: '#397B29', fontSize: 90 }, heroCheck: { position: 'absolute', color: '#FFFFFF', fontSize: 42, fontWeight: '900' },
  title: { color: '#07583D', fontSize: 37, lineHeight: 42, fontWeight: '900', letterSpacing: -1, marginTop: 12 }, copy: { color: '#5F6970', fontSize: 16, lineHeight: 23, maxWidth: '77%' }, conditionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, condition: { width: '48.5%', minHeight: 87, borderRadius: 18, padding: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(7,88,61,0.04)' }, conditionSelected: { borderColor: colors.brand, borderWidth: 2 }, conditionIcon: { color: colors.brand, fontSize: 25, fontWeight: '900', marginRight: 8 }, conditionLabel: { color: '#172C35', fontSize: 14, fontWeight: '800', lineHeight: 18, flex: 1 }, checkbox: { width: 21, height: 21, borderRadius: 6, borderWidth: 2, borderColor: '#B4B7B1', alignItems: 'center', justifyContent: 'center', marginLeft: 5 }, checkboxSelected: { backgroundColor: colors.brand, borderColor: colors.brand }, check: { color: '#fff', fontSize: 14, fontWeight: '900' }, selectionHint: { color: colors.muted, textAlign: 'center', fontSize: 12 },
  center: { flex: 1, padding: spacing.lg, backgroundColor: colors.canvas }, logo: { color: colors.brand, fontSize: 13, letterSpacing: 1.5, fontWeight: '900' }, kicker: { color: colors.brand, fontSize: 12, fontWeight: '900', letterSpacing: 1.1 }, legal: { color: colors.muted, textAlign: 'center', fontSize: 12, marginTop: 14 }, cardTitle: { color: colors.ink, fontSize: 18, fontWeight: '800', marginTop: 12 }, cardCopy: { color: colors.muted, lineHeight: 21, marginTop: 7 }, scanner: { gap: spacing.md }, camera: { flex: 1, width: '100%', backgroundColor: '#16221C', borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.brand }, scanMark: { color: '#D5F7E1', fontSize: 72, fontWeight: '900' }, cameraCopy: { color: '#fff', marginTop: 18, fontWeight: '700' }, productImage: { height: 152, borderRadius: 12, backgroundColor: colors.canvas, alignItems: 'center', justifyContent: 'center' }, productImageText: { color: colors.muted }, warning: { color: colors.orange, fontWeight: '900' },
});
