import { usePathname } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';
import { BackHandler, Platform, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { clamp, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlayer } from '../music/playback/player-store';
import { useThemeStore } from '../theme/theme-store';
import { PlayerContent } from '../features/player/TrackScreen';
import { usePlayerPresentation } from '../features/player/presentation-store';
import { shouldExpandPlayer } from '../features/player/gestures';
import { Artwork, IconButton } from './ui';
import { Surface, useGlassEnvironment } from './glass';

const SPRING = { damping: 30, stiffness: 260, mass: 0.85, overshootClamping: true };
export function MiniPlayer() {
  const track = usePlayer(s => s.track); const path = usePathname();
  return track && !path.startsWith('/player/') ? <PlayerDock /> : null;
}
function CompactPlayer() {
  const p = usePlayer(); const { tokens } = useThemeStore(s => s.theme);
  const open = usePlayerPresentation(s => s.open);
  return <View style={{ padding: 10, gap: 4, height: 78 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Abrir reproductor" onPress={open} style={{ flex: 1, flexDirection: 'row', gap: 12, alignItems: 'center', minHeight: 48 }}>
        <Artwork track={p.track} size={44} /><View style={{ flex: 1, gap: 4 }}><Text numberOfLines={1} style={{ color: tokens.text, fontWeight: '700' }}>{p.track?.title}</Text><Text numberOfLines={1} style={{ color: tokens.muted, fontSize: 11 }}>{p.error ? 'Toca para reintentar' : p.loading ? 'Cargando audio…' : p.track?.artist}</Text></View>
      </Pressable>
      <IconButton icon={p.playing ? 'pause' : 'play'} label={p.playing ? 'Pausar' : 'Reproducir'} onPress={p.toggle} />
      <IconButton icon="play-skip-forward" label="Siguiente pista" onPress={() => p.next()} />
    </View>
    <View style={{ height: 2, borderRadius: 2, backgroundColor: '#FFFFFF15' }}><View style={{ height: 2, borderRadius: 2, backgroundColor: tokens.accent, width: `${Math.min(100, p.duration ? p.position / p.duration * 100 : 0)}%` }} /></View>
  </View>;
}
function PlayerDock() {
  const { height } = useWindowDimensions(); const insets = useSafeAreaInsets();
  const { tokens } = useThemeStore(s => s.theme); const { reduceMotion } = useGlassEnvironment();
  const { expanded, present, open, collapse, preview, dismiss } = usePlayerPresentation();
  const progress = useSharedValue(0); const start = useSharedValue(0);
  const collapsedBottom = 64 + Math.max(insets.bottom, 12) + 20;
  const travel = Math.max(1, height - 78 - collapsedBottom);
  useEffect(() => {
    const finish = (done?: boolean) => { 'worklet'; if (done && !expanded) runOnJS(dismiss)(); };
    progress.set(reduceMotion ? withTiming(expanded ? 1 : 0, { duration: 0 }, finish) : withSpring(expanded ? 1 : 0, SPRING, finish));
  }, [expanded, reduceMotion, progress, dismiss]);
  useEffect(() => {
    if (!expanded) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => { collapse(); return true; });
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') collapse(); };
    if (Platform.OS === 'web') window.addEventListener('keydown', escape);
    return () => { sub.remove(); if (Platform.OS === 'web') window.removeEventListener('keydown', escape); };
  }, [expanded, collapse]);
  const settle = useCallback((next: boolean) => next ? open() : collapse(), [open, collapse]);
  const gestures = useMemo(() => { const create = () => Gesture.Pan().activeOffsetY([-10, 10]).failOffsetX([-24, 24])
    .onStart(() => { start.set(progress.get()); runOnJS(preview)(); })
    .onUpdate(event => { progress.set(clamp(start.get() - event.translationY / travel, 0, 1)); })
    .onEnd(event => {
      const next = shouldExpandPlayer(start.get(), event.translationY, event.velocityY, travel);
      runOnJS(settle)(next);
      const finish = (done?: boolean) => { 'worklet'; if (done && !next) runOnJS(dismiss)(); };
      progress.set(reduceMotion ? withTiming(next ? 1 : 0, { duration: 0 }, finish) : withSpring(next ? 1 : 0, SPRING, finish));
    }).onFinalize((_event, success) => { if (!success) progress.set(withSpring(expanded ? 1 : 0, SPRING, (done) => { if (done && !expanded) runOnJS(dismiss)(); })); });
  return { mini: create(), handle: create() };
  }, [expanded, reduceMotion, travel, progress, start, preview, dismiss, settle]);
  const shell = useAnimatedStyle(() => ({
    left: interpolate(progress.get(), [0, 1], [12, 0]), right: interpolate(progress.get(), [0, 1], [12, 0]),
    bottom: interpolate(progress.get(), [0, 1], [collapsedBottom, 0]), height: interpolate(progress.get(), [0, 1], [78, height]),
    borderRadius: interpolate(progress.get(), [0, 1], [26, 0]),
  }));
  const mini = useAnimatedStyle(() => ({ opacity: interpolate(progress.get(), [0, 0.18, 1], [1, 0, 0]) }));
  // Native GlassView must never have an ancestor with opacity exactly zero.
  const full = useAnimatedStyle(() => ({ opacity: interpolate(progress.get(), [0, 0.2, 1], [0.001, 0.5, 1]), transform: [{ translateY: interpolate(progress.get(), [0, 1], [35, 0]) }] }));
  return <Animated.View accessibilityViewIsModal={expanded} style={[{ position: 'absolute', zIndex: 100, overflow: 'hidden' }, shell]}>
    <Surface strong={present} style={{ flex: 1, borderRadius: 0 }}>
      <GestureDetector gesture={gestures.mini}><Animated.View aria-hidden={expanded} pointerEvents={expanded ? 'none' : 'auto'} accessibilityElementsHidden={expanded} importantForAccessibility={expanded ? 'no-hide-descendants' : 'auto'} style={mini}><CompactPlayer /></Animated.View></GestureDetector>
      {present && <Animated.View aria-hidden={!expanded} pointerEvents={expanded ? 'auto' : 'none'} accessibilityElementsHidden={!expanded} importantForAccessibility={expanded ? 'auto' : 'no-hide-descendants'} style={[{ position: 'absolute', left: 0, right: 0, top: 0, height }, full]}>
        <GestureDetector gesture={gestures.handle}><View style={{ paddingTop: insets.top + 8, paddingHorizontal: 18, paddingBottom: 8 }}>
          <View style={{ alignSelf: 'center', width: 36, height: 5, borderRadius: 3, backgroundColor: '#FFFFFF50' }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <IconButton icon="chevron-down" label="Recoger reproductor" onPress={collapse} />
            <Text accessibilityRole="header" style={{ color: tokens.text, fontSize: 11, fontWeight: '700', letterSpacing: 2 }}>AHORA SUENA</Text>
            <View style={{ width: 48 }} />
          </View>
        </View></GestureDetector>
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 4, paddingBottom: Math.max(insets.bottom, 24) + 28, gap: 20, width: '100%', maxWidth: 620, alignSelf: 'center' }} style={{ flex: 1 }}>
          <PlayerContent />
        </ScrollView>
      </Animated.View>}
    </Surface>
  </Animated.View>;
}
