/** Canonical theme contract v1. No platform APIs or executable theme content. */
export const THEME_FORMAT_VERSION = 1 as const;
export const THEME_ENGINE_VERSION = '1.0.0';
export const MAX_THEME_CHARACTERS = 65_536;
export const layouts = ['compact', 'dense', 'artwork'] as const;
export const surfaces = ['flat', 'glass', 'liquid-glass'] as const;
export const navigations = ['bottom-bar', 'floating-pill'] as const;
export const players = ['minimal', 'artwork-focus', 'immersive'] as const;

export interface MusicTheme {
  formatVersion: 1;
  id: string;
  name: string;
  version: string;
  authorId: string;
  engineCompatibility: '>=1.0.0 <2.0.0';
  components: {
    layout: (typeof layouts)[number];
    surface: (typeof surfaces)[number];
    navigation: (typeof navigations)[number];
    player: (typeof players)[number];
  };
  tokens: {
    background: string;
    surface: string;
    accent: string;
    text: string;
    muted: string;
    radiusDp: number;
    blurIntensity: number;
    surfaceOpacity: number;
  };
}

export class ThemeValidationError extends Error {
  constructor(message: string) { super(message); this.name = 'ThemeValidationError'; }
}
function fail(message: string): never { throw new ThemeValidationError(message); }
function record(value: unknown, keys: string[], label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${label} debe ser un objeto.`);
  const data = value as Record<string, unknown>;
  if (Object.keys(data).some((key) => !keys.includes(key))) fail(`${label} contiene campos no permitidos.`);
  if (keys.some((key) => !Object.hasOwn(data, key))) fail(`${label} está incompleto.`);
  return data;
}
function text(value: unknown, label: string, max = 80): string {
  if (typeof value !== 'string' || !value.trim() || value.length > max) fail(`${label} no es válido.`);
  return value.trim();
}
function choice<T extends string>(value: unknown, options: readonly T[], label: string): T {
  if (typeof value !== 'string' || !options.includes(value as T)) fail(`${label} no es compatible.`);
  return value as T;
}
function color(value: unknown, label: string): string {
  if (typeof value !== 'string' || !/^#[0-9a-f]{6}$/i.test(value)) fail(`${label} requiere un color hexadecimal de seis dígitos.`);
  return value;
}
function number(value: unknown, min: number, max: number, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) fail(`${label} está fuera de rango.`);
  return value;
}
export function validateTheme(input: unknown): MusicTheme {
  const d = record(input, ['formatVersion','id','name','version','authorId','engineCompatibility','components','tokens'], 'Tema');
  if (d.formatVersion !== 1 || d.engineCompatibility !== '>=1.0.0 <2.0.0') fail('Versión de tema o motor no compatible.');
  const id = text(d.id, 'ID', 128);
  if (!/^[a-z0-9][a-z0-9.-]*$/.test(id)) fail('ID no válido.');
  const version = text(d.version, 'Versión', 24);
  if (!/^\d+\.\d+\.\d+$/.test(version)) fail('La versión debe tener formato 1.0.0.');
  const c = record(d.components, ['layout','surface','navigation','player'], 'Componentes');
  const t = record(d.tokens, ['background','surface','accent','text','muted','radiusDp','blurIntensity','surfaceOpacity'], 'Tokens');
  return {
    formatVersion: 1, id, name: text(d.name, 'Nombre'), version,
    authorId: text(d.authorId, 'Autor', 128), engineCompatibility: '>=1.0.0 <2.0.0',
    components: {
      layout: choice(c.layout, layouts, 'Layout'), surface: choice(c.surface, surfaces, 'Superficie'),
      navigation: choice(c.navigation, navigations, 'Navegación'), player: choice(c.player, players, 'Player'),
    },
    tokens: {
      background: color(t.background, 'Fondo'), surface: color(t.surface, 'Superficie'),
      accent: color(t.accent, 'Acento'), text: color(t.text, 'Texto'), muted: color(t.muted, 'Texto secundario'),
      radiusDp: number(t.radiusDp, 0, 40, 'Radio'), blurIntensity: number(t.blurIntensity, 0, 1, 'Blur'),
      surfaceOpacity: number(t.surfaceOpacity, 0.1, 1, 'Opacidad'),
    },
  };
}
export function parseTheme(serialized: string): MusicTheme {
  if (serialized.length > MAX_THEME_CHARACTERS) fail('El tema supera el límite del formato inicial.');
  let value: unknown;
  try { value = JSON.parse(serialized); } catch { fail('El archivo no contiene JSON válido.'); }
  return validateTheme(value);
}
export function serializeTheme(theme: MusicTheme): string { return JSON.stringify(validateTheme(theme), null, 2); }

function preset(id: string, name: string, accent: string, surface: MusicTheme['components']['surface'], layout: MusicTheme['components']['layout']): MusicTheme {
  return validateTheme({
    formatVersion: 1, id: `mre.${id}`, name, version: '1.0.0', authorId: 'mre.builtin',
    engineCompatibility: '>=1.0.0 <2.0.0',
    components: { layout, surface, navigation: surface === 'flat' ? 'bottom-bar' : 'floating-pill', player: 'artwork-focus' },
    tokens: { background: '#080D13', surface: '#15212D', accent, text: '#F5F8FC', muted: '#AAB9C8', radiusDp: 24, blurIntensity: 0.6, surfaceOpacity: 0.8 },
  });
}
export const themePresets: readonly MusicTheme[] = [
  preset('emerald', 'Emerald', '#6AE4AC', 'flat', 'dense'),
  preset('liquid', 'Liquid Glass', '#ADC8FF', 'liquid-glass', 'artwork'),
  preset('wave', 'Material Wave', '#FDBD91', 'flat', 'compact'),
];
export function defaultTheme(): MusicTheme { return validateTheme(themePresets[0]); }
