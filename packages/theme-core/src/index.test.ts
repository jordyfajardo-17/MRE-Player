import { describe, expect, it } from 'vitest';
import { defaultTheme, parseTheme, serializeTheme, themePresets, validateTheme } from './index';

describe('theme contract v1', () => {
  it('round trips every built-in preset without changing tokens', () => {
    for (const preset of themePresets) expect(parseTheme(serializeTheme(preset))).toEqual(preset);
  });
  it('rejects scripts and unknown nested fields', () => {
    const theme = defaultTheme();
    expect(() => validateTheme({ ...theme, script: 'alert(1)' })).toThrow(/no permitidos/);
    expect(() => validateTheme({ ...theme, components: { ...theme.components, url: 'https://example.com' } })).toThrow();
  });
  it('rejects future formats and unsupported components', () => {
    expect(() => validateTheme({ ...defaultTheme(), formatVersion: 2 })).toThrow(/no compatible/);
    const theme = defaultTheme();
    expect(() => validateTheme({ ...theme, components: { ...theme.components, player: 'remote-code' } })).toThrow();
  });
  it('rejects malformed, oversized and prototype-injection data', () => {
    expect(() => parseTheme('{')).toThrow(/JSON/);
    expect(() => parseTheme(' '.repeat(65_537))).toThrow(/límite/);
    expect(() => parseTheme(serializeTheme(defaultTheme()).replace('"formatVersion": 1', '"__proto__": {}, "formatVersion": 1'))).toThrow();
  });
  it('checks numeric bounds and color syntax', () => {
    const theme = defaultTheme();
    for (const radius of [-1, 41, Infinity, NaN]) {
      expect(() => validateTheme({ ...theme, tokens: { ...theme.tokens, radiusDp: radius } })).toThrow();
    }
    expect(() => validateTheme({ ...theme, tokens: { ...theme.tokens, accent: 'url(example.com)' } })).toThrow();
    expect(validateTheme({ ...theme, tokens: { ...theme.tokens, radiusDp: 0 } }).tokens.radiusDp).toBe(0);
    expect(validateTheme({ ...theme, tokens: { ...theme.tokens, radiusDp: 40 } }).tokens.radiusDp).toBe(40);
  });
  it('returns isolated values so drafts cannot mutate presets', () => {
    const draft = defaultTheme(); draft.tokens.accent = '#000000';
    expect(defaultTheme().tokens.accent).toBe('#6AE4AC');
  });
});
