import { BlurTargetView, BlurView } from 'expo-blur';
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';
import { LinearGradient } from 'expo-linear-gradient';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { AccessibilityInfo, Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useThemeStore } from '../theme/theme-store';

interface GlassEnvironment { target: RefObject<View | null> | null; reduceTransparency: boolean; reduceMotion: boolean; }
const Environment = createContext<GlassEnvironment>({ target: null, reduceTransparency: true, reduceMotion: true });
export const useGlassEnvironment = () => useContext(Environment);

/** A separate backdrop target prevents recursive capture of glass views on Android. */
export function GlassEnvironmentProvider({ children }: { children: ReactNode }) {
  const target = useRef<View>(null);
  const { tokens, components } = useThemeStore(s => s.theme);
  const [reduceTransparency, setTransparency] = useState(true);
  const [reduceMotion, setMotion] = useState(true);
  useEffect(() => {
    if (Platform.OS === 'web') {
      const transparency = window.matchMedia('(prefers-reduced-transparency: reduce)');
      const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const update = () => { setTransparency(transparency.matches); setMotion(motion.matches); };
      update(); transparency.addEventListener('change', update); motion.addEventListener('change', update);
      return () => { transparency.removeEventListener('change', update); motion.removeEventListener('change', update); };
    }
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then(value => { if (active) setMotion(value); }).catch(() => {});
    void AccessibilityInfo.isReduceTransparencyEnabled().then(value => { if (active) setTransparency(value); }).catch(() => {});
    const a = AccessibilityInfo.addEventListener('reduceMotionChanged', setMotion);
    const b = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setTransparency);
    return () => { active = false; a.remove(); b.remove(); };
  }, []);
  return <Environment.Provider value={{ target, reduceTransparency, reduceMotion }}>
    <View style={{ flex: 1, backgroundColor: tokens.background, overflow: 'hidden' }}>
      <BlurTargetView ref={target} pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: tokens.background }]} />
        {components.surface !== 'flat' && <>
          <LinearGradient colors={[`${tokens.accent}65`, `${tokens.accent}00`]} style={{ position: 'absolute', width: 520, height: 600, borderRadius: 280, left: -240, top: -60 }} />
          <LinearGradient colors={['#B36DCA45', '#B36DCA00']} style={{ position: 'absolute', width: 520, height: 660, right: -300, top: 240, borderRadius: 300 }} />
          <LinearGradient colors={['#448A9A00', '#448A9A44']} style={{ position: 'absolute', width: 800, height: 500, bottom: -200, left: -100, borderRadius: 400 }} />
        </>}
      </BlurTargetView>
      {children}
    </View>
  </Environment.Provider>;
}

export function Surface({ children, style, strong = false }: { children: ReactNode; style?: StyleProp<ViewStyle>; strong?: boolean }) {
  const { tokens, components } = useThemeStore(s => s.theme);
  const { target, reduceTransparency } = useGlassEnvironment();
  const glass = components.surface !== 'flat' && !reduceTransparency;
  const alpha = Math.round((strong ? Math.max(0.9, tokens.surfaceOpacity) : tokens.surfaceOpacity * 0.65) * 255).toString(16).padStart(2, '0');
  const shell: StyleProp<ViewStyle> = [{ borderRadius: tokens.radiusDp, overflow: 'hidden', borderWidth: glass ? 1 : 0,
    borderColor: '#F3F7FF30', backgroundColor: glass ? `${tokens.surface}${alpha}` : tokens.surface }, style];
  const content = <>
    {glass && <LinearGradient pointerEvents="none" colors={['#FFFFFF16', '#FFFFFF02', '#FFFFFF08']} locations={[0, 0.55, 1]} style={StyleSheet.absoluteFill} />}
    {children}
  </>;
  const native = glass && components.surface === 'liquid-glass' && Platform.OS === 'ios' && isGlassEffectAPIAvailable() && isLiquidGlassAvailable();
  if (native) return <GlassView glassEffectStyle={{ style: 'regular', animate: true, animationDuration: 0.25 }} colorScheme="dark" style={shell}>{content}</GlassView>;
  return <View style={shell}>
    {glass && <BlurView pointerEvents="none" tint={Platform.OS === 'web' ? 'dark' : 'systemUltraThinMaterialDark'} intensity={Math.min(90, Math.max(20, tokens.blurIntensity * 100))}
      blurTarget={target ?? undefined} blurMethod={Platform.OS === 'android' && target ? 'dimezisBlurViewSdk31Plus' : 'none'} style={StyleSheet.absoluteFill} />}
    {content}
  </View>;
}
