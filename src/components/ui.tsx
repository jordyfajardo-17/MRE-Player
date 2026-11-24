import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useThemeStore } from '../theme/theme-store';
import type { Track } from '../music/core/types';
import { Surface, useGlassEnvironment } from './glass';
export { Surface } from './glass';
export type IconName = ComponentProps<typeof Ionicons>['name'];

function TouchScale({ children, label, onPress, active, button = false }: { children: ReactNode; label?: string; onPress(): void; active?: boolean; button?: boolean }) {
  const scale = useSharedValue(1); const { reduceMotion } = useGlassEnvironment();
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected: active }} onPress={onPress}
    onPressIn={() => { scale.set(reduceMotion ? 1 : withSpring(0.94, { damping: 20, stiffness: 380 })); }}
    onPressOut={() => { scale.set(withSpring(1, { damping: 18, stiffness: 320 })); }}
    style={{ minHeight: 48, minWidth: 48, justifyContent: 'center', flexShrink: button ? 1 : 0 }}>
    <Animated.View style={animated}>{children}</Animated.View>
  </Pressable>;
}
export function IconButton({ icon, label, onPress, active = false, size = 23 }: { icon: IconName; label: string; onPress(): void; active?: boolean; size?: number }) {
  const { tokens, components } = useThemeStore(s => s.theme);
  const glass = components.surface !== 'flat';
  return <TouchScale label={label} onPress={onPress} active={active}><View style={{ minHeight: 44, minWidth: 44, margin: 2, borderRadius: 24, borderWidth: glass ? 1 : 0, borderColor: active ? `${tokens.accent}60` : '#FFFFFF1C', backgroundColor: glass ? active ? `${tokens.accent}20` : '#FFFFFF06' : 'transparent', alignItems: 'center', justifyContent: 'center' }}><Ionicons name={icon} size={size} color={active ? tokens.accent : tokens.text} /></View></TouchScale>;
}
export function Action({ children, onPress, secondary = false }: { children: ReactNode; onPress(): void; secondary?: boolean }) {
  const { tokens } = useThemeStore(s => s.theme);
  return <TouchScale onPress={onPress} button>{secondary ? <Surface style={{ paddingHorizontal: 18, paddingVertical: 13, minHeight: 48, borderRadius: 30, alignItems: 'center' }}><Text style={{ color: tokens.text, fontWeight: '600', fontSize: 14 }}>{children}</Text></Surface> :
    <View style={{ paddingHorizontal: 20, paddingVertical: 14, minHeight: 48, borderRadius: 30, backgroundColor: tokens.accent, alignItems: 'center' }}><Text style={{ color: '#08120D', fontWeight: '700', fontSize: 14 }}>{children}</Text></View>}</TouchScale>;
}
export function Artwork({ track, size = 56 }: { track?: Track | null; size?: number }) {
  const { tokens } = useThemeStore(s => s.theme); const [failed, setFailed] = useState<string | undefined>();
  const style = { width: size, height: size, borderRadius: Math.min(tokens.radiusDp, size / 7) };
  if (track?.artwork && failed !== track.artwork) return <Image accessibilityLabel={`Carátula de ${track.title}`} source={{ uri: track.artwork }} style={style} onError={() => setFailed(track.artwork)} />;
  return <LinearGradient colors={[tokens.accent, tokens.surface]} style={[style, { alignItems: 'center', justifyContent: 'center' }]}><Ionicons name="musical-notes" size={size * 0.35} color={tokens.text} /></LinearGradient>;
}
export function Label({ children }: { children: ReactNode }) { const { tokens } = useThemeStore(s => s.theme); return <Text accessibilityRole="header" style={{ color: tokens.text, fontSize: 22, fontWeight: '700', letterSpacing: -0.5 }}>{children}</Text>; }
export function Copy({ children }: { children: ReactNode }) { const { tokens } = useThemeStore(s => s.theme); return <Text style={{ color: tokens.muted, lineHeight: 22 }}>{children}</Text>; }
export const time = (seconds: number) => `${Math.floor((Number.isFinite(seconds) ? seconds : 0) / 60)}:${String(Math.floor((Number.isFinite(seconds) ? seconds : 0) % 60)).padStart(2, '0')}`;
