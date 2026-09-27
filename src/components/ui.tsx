import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../theme';

export function AppButton({ label, onPress, tone = 'brand', icon }: { label: string; onPress: () => void; tone?: 'brand' | 'soft'; icon?: string }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={[styles.button, tone === 'soft' && styles.softButton]}>
    {icon ? <Text style={[styles.buttonIcon, tone === 'soft' && styles.softText]}>{icon}</Text> : null}
    <Text style={[styles.buttonText, tone === 'soft' && styles.softText]}>{label}</Text>
  </Pressable>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionTitle({ children, action }: { children: string; action?: string }) {
  return <View style={styles.sectionTitle}><Text style={styles.sectionText}>{children}</Text>{action ? <Text style={styles.action}>{action}</Text> : null}</View>;
}

const styles = StyleSheet.create({
  button: { minHeight: 54, borderRadius: radius.md, paddingHorizontal: spacing.md, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
  softButton: { backgroundColor: colors.brandSoft }, buttonText: { color: '#fff', fontSize: 16, fontWeight: '800' }, softText: { color: colors.brand }, buttonIcon: { color: '#fff', fontSize: 22, fontWeight: '800' },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.line },
  sectionTitle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }, sectionText: { color: colors.ink, fontSize: 18, fontWeight: '800' }, action: { color: colors.brand, fontWeight: '700' },
});
