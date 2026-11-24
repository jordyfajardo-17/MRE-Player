import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../theme/theme-store';
import { usePlayer } from '../music/playback/player-store';
export function Screen({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const { theme, storageNotice } = useThemeStore();
  const hasTrack = usePlayer(s => !!s.track);
  return <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: theme.components.surface === 'flat' ? theme.tokens.background : 'transparent' }}>
    <LinearGradient colors={[`${theme.tokens.accent}18`, theme.tokens.background]} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 320 }} />
    <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: hasTrack ? 210 : 120, gap: 22, width: '100%', maxWidth: 1000, alignSelf: 'center' }} keyboardShouldPersistTaps="handled">
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}><View style={{ width: 26, height: 26, backgroundColor: theme.tokens.accent, borderRadius: 9, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#08120D', fontWeight: '900' }}>m</Text></View><Text style={{ color: theme.tokens.text, fontSize: 12, fontWeight: '700', letterSpacing: 3 }}>MULTI EXPERIENCE</Text></View>
      <View style={{ gap: 9 }}><Text accessibilityRole="header" style={{ color: theme.tokens.text, fontSize: 36, fontWeight: '800', letterSpacing: -1.4 }}>{title}</Text><Text style={{ color: theme.tokens.muted, lineHeight: 22 }}>{subtitle}</Text></View>
      {storageNotice && <Text accessibilityRole="alert" style={{ color: theme.tokens.text }}>{storageNotice}</Text>}
      {children}
    </ScrollView>
  </SafeAreaView>;
}
