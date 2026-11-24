import { BottomTabBar } from 'expo-router/js-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect, useMemo, useState, type ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { clamp, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '../theme/theme-store';
import { Surface, useGlassEnvironment } from './glass';
import type { IconName } from './ui';
type Props = ComponentProps<typeof BottomTabBar>;
const icons: Record<string, IconName> = { index: 'home-outline', search: 'search-outline', library: 'library-outline', themes: 'color-palette-outline', sources: 'options-outline' };

export function LiquidTabBar({ state, descriptors, navigation }: Props) {
  const { tokens, components } = useThemeStore(s => s.theme);
  const { reduceMotion } = useGlassEnvironment(); const insets = useSafeAreaInsets();
  const [width, setWidth] = useState(0); const x = useSharedValue(0); const start = useSharedValue(0);
  const step = width > 12 ? (width - 12) / state.routes.length : 0;
  const choose = useCallback((index: number) => {
    const route = state.routes[index]; if (!route) return;
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!event.defaultPrevented) navigation.navigate(route.name, route.params);
    else x.set(withSpring(state.index * step, { damping: 24, stiffness: 280 }));
  }, [navigation, state, step, x]);
  useEffect(() => { x.set(reduceMotion ? withTiming(state.index * step, { duration: 0 }) : withSpring(state.index * step, { damping: 24, stiffness: 280 })); }, [state.index, step, reduceMotion, x]);
  const pill = useAnimatedStyle(() => ({ width: step, transform: [{ translateX: x.get() }] }));
  const gesture = useMemo(() => Gesture.Pan().activeOffsetX([-12, 12]).failOffsetY([-16, 16])
    .onStart(() => { start.set(x.get()); })
    .onUpdate(event => { x.set(clamp(start.get() + event.translationX, 0, step * (state.routes.length - 1))); })
    .onEnd(() => { if (step) { const next = Math.round(x.get() / step); x.set(withSpring(next * step)); runOnJS(choose)(next); } })
    .onFinalize((_event, success) => { if (!success) x.set(withSpring(state.index * step)); }), [choose, start, state.index, state.routes.length, step, x]);
  const floating = components.navigation === 'floating-pill';
  return <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: floating ? 12 : 0, paddingBottom: Math.max(insets.bottom, 12), paddingTop: 8 }}>
    <GestureDetector gesture={gesture}><View onLayout={event => setWidth(event.nativeEvent.layout.width)}>
      <Surface strong style={{ borderRadius: floating ? 36 : 0, height: 64, padding: 6 }}>
        <Animated.View pointerEvents="none" style={[{ position: 'absolute', top: 6, bottom: 6, left: 6, borderRadius: 28, backgroundColor: `${tokens.accent}23`, borderWidth: 1, borderColor: `${tokens.accent}35` }, pill]} />
        <View style={{ flexDirection: 'row', height: 52 }}>
          {state.routes.map((route, index) => {
            const selected = index === state.index; const label = descriptors[route.key].options.title ?? route.name;
            return <Pressable key={route.key} accessibilityRole="tab" accessibilityLabel={label} accessibilityState={{ selected }} onPress={() => choose(index)}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
              style={{ flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <Ionicons name={icons[route.name] ?? 'ellipse-outline'} size={21} color={selected ? tokens.accent : tokens.muted} />
              <Text numberOfLines={1} style={{ color: selected ? tokens.text : tokens.muted, fontSize: 10, fontWeight: selected ? '700' : '500' }}>{label}</Text>
            </Pressable>;
          })}
        </View>
      </Surface>
    </View></GestureDetector>
  </View>;
}
