import Ionicons from '@expo/vector-icons/Ionicons';
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState, type ComponentProps, type ReactNode } from 'react';
import { AccessibilityInfo, Image, Platform, Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useThemeStore } from '../theme/theme-store';
import type { Track } from '../music/core/types';
export type IconName = ComponentProps<typeof Ionicons>['name'];
export function IconButton({ icon, label, onPress, active = false, size = 23 }: { icon: IconName; label: string; onPress(): void; active?: boolean; size?: number }) {
  const { tokens } = useThemeStore(s => s.theme);
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected: active }} onPress={onPress} style={({ pressed }) => ({ minHeight: 48, minWidth: 48, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.5 : 1 })}><Ionicons name={icon} size={size} color={active ? tokens.accent : tokens.text} /></Pressable>;
}
export function Action({ children, onPress, secondary = false }: { children: ReactNode; onPress(): void; secondary?: boolean }) {
  const { tokens } = useThemeStore(s => s.theme);
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ paddingHorizontal: 20, paddingVertical: 14, minHeight: 48, borderRadius: 30, backgroundColor: secondary ? tokens.surface : tokens.accent, opacity: pressed ? 0.7 : 1, alignItems: 'center' })}><Text style={{ color: secondary ? tokens.text : '#08120D', fontWeight: '700', fontSize: 14 }}>{children}</Text></Pressable>;
}
export function Surface({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { tokens, components } = useThemeStore(s => s.theme);
  const [reduced, setReduced] = useState(() => Platform.OS === 'web' && typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-transparency: reduce)').matches : true);
  useEffect(() => {
    if (Platform.OS === 'web') {
      const query = window.matchMedia('(prefers-reduced-transparency: reduce)');
      const update = () => setReduced(query.matches);
      query.addEventListener('change', update);
      return () => query.removeEventListener('change', update);
    }
    if (typeof AccessibilityInfo.isReduceTransparencyEnabled !== 'function') return;
    void AccessibilityInfo.isReduceTransparencyEnabled().then(setReduced).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setReduced);
    return () => sub.remove();
  }, []);
  const base: StyleProp<ViewStyle> = [{ borderRadius: tokens.radiusDp, overflow: 'hidden', borderWidth: components.surface === 'flat' ? 0 : 1, borderColor: '#FFFFFF20' }, style];
  if (!reduced && components.surface === 'liquid-glass' && Platform.OS === 'ios' && isGlassEffectAPIAvailable() && isLiquidGlassAvailable()) return <GlassView glassEffectStyle="regular" style={base}>{children}</GlassView>;
  if (!reduced && components.surface !== 'flat' && Platform.OS !== 'android') return <BlurView tint="dark" intensity={tokens.blurIntensity * 100} style={[base, { backgroundColor: tokens.surface + Math.round(tokens.surfaceOpacity * 255).toString(16).padStart(2, '0') }]}>{children}</BlurView>;
  return <View style={[base, { backgroundColor: tokens.surface }]}>{children}</View>;
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



