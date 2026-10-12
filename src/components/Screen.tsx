import type { ReactNode } from 'react';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../theme/theme-store';
export function Screen({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const { theme, storageNotice } = useThemeStore();
  return <SafeAreaView edges={['top','left','right']} style={{ flex: 1, backgroundColor: theme.tokens.background }}>
    <ScrollView contentContainerStyle={{ padding: 24, gap: 20 }} keyboardShouldPersistTaps="handled">
      <Text style={{ color: theme.tokens.accent, fontSize: 12, letterSpacing: 3 }}>MRE PLAYER</Text>
      <Text accessibilityRole="header" style={{ color: theme.tokens.text, fontSize: 32, fontWeight: '700' }}>{title}</Text>
      <Text style={{ color: theme.tokens.muted, lineHeight: 22 }}>{subtitle}</Text>
      {storageNotice && <Text accessibilityRole="alert" style={{ color: theme.tokens.text }}>{storageNotice}</Text>}
      {children}
    </ScrollView>
  </SafeAreaView>;
}
