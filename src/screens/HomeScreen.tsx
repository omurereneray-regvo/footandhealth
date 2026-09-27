import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton, Card, SectionTitle } from '../components/ui';
import { colors, spacing } from '../theme';

export function HomeScreen({ onScan }: { onScan: () => void }) {
  return <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
    <View style={styles.header}><View><Text style={styles.eyebrow}>FOOT & HEALTH</Text><Text style={styles.greeting}>Merhaba, Eren</Text></View><View style={styles.avatar}><Text style={styles.avatarText}>E</Text></View></View>
    <Card style={styles.hero}><Text style={styles.heroIcon}>▥</Text><Text style={styles.heroTitle}>Ürünü tarayın</Text><Text style={styles.heroCopy}>İçerik ve besin verilerini tercihlerinize göre tek ekranda görün.</Text><AppButton label="Barkod Tara" icon="▥" onPress={onScan} /></Card>
    <SectionTitle action="Tümünü gör">Sağlık özeti</SectionTitle>
    <Card style={styles.summary}><View style={styles.dot}/><View style={styles.summaryText}><Text style={styles.summaryTitle}>Tercihlerinizi ekleyin</Text><Text style={styles.summaryCopy}>Size uygun içerik uyarıları için profilinizi tamamlayın.</Text></View></Card>
    <SectionTitle action="Geçmiş">Son taramalar</SectionTitle>
    <Card style={styles.empty}><Text style={styles.emptyIcon}>⌁</Text><Text style={styles.emptyTitle}>Henüz tarama yok</Text><Text style={styles.emptyCopy}>İlk ürününüzü tarayarak başlayın.</Text></Card>
    <Text style={styles.disclaimer}>Bu uygulama tıbbi tavsiye yerine geçmez.</Text>
  </ScrollView>;
}
const styles = StyleSheet.create({ page: { padding: spacing.md, gap: spacing.md, paddingBottom: 120 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }, eyebrow: { color: colors.brand, fontSize: 12, fontWeight: '900', letterSpacing: 1.1 }, greeting: { color: colors.ink, fontSize: 26, fontWeight: '800', marginTop: 4 }, avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.brandSoft, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: colors.brand, fontWeight: '900', fontSize: 18 }, hero: { backgroundColor: '#ECF8F1', padding: spacing.lg, borderColor: '#D4EEDC' }, heroIcon: { color: colors.brand, fontSize: 42, fontWeight: '900' }, heroTitle: { color: colors.ink, fontSize: 24, fontWeight: '900', marginTop: 14 }, heroCopy: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 8, marginBottom: 20 }, summary: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' }, dot: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.orange, marginTop: 5 }, summaryText: { flex: 1 }, summaryTitle: { color: colors.ink, fontSize: 16, fontWeight: '800' }, summaryCopy: { color: colors.muted, lineHeight: 20, marginTop: 4 }, empty: { alignItems: 'center', paddingVertical: 26 }, emptyIcon: { fontSize: 28, color: colors.muted }, emptyTitle: { color: colors.ink, fontSize: 16, fontWeight: '800', marginTop: 8 }, emptyCopy: { color: colors.muted, marginTop: 4 }, disclaimer: { color: colors.muted, textAlign: 'center', fontSize: 12, marginTop: 4 } });
