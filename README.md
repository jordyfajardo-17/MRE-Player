# MRE Player

Base inicial de MusicMultiExperience, separada de [MRE Theme Studio](https://github.com/jordyfajardo-17/MRE-Them-Studio).
React Native + TypeScript + Expo SDK 57. La guía 1.0 define la visión; esta entrega prepara el desarrollo.

## Instalar y ejecutar

Requisitos: Node 24 LTS y npm. Clona este repositorio y ejecuta desde su raíz:

```bash
npm ci
npm run web
```

Para un teléfono con development build instalado:

```bash
npm start
```

Para crear el development build local: `npm run android` con Android Studio/SDK,
o `npm run ios` en macOS con Xcode. El código nativo se genera con Expo; no se confirma en Git.
`eas.json` prepara perfiles development/preview/production. Para EAS, configura tu propia cuenta
con `npx eas-cli@latest build:configure` y después `npx eas-cli@latest build --profile development --platform android`.
No se ha creado ningún proyecto EAS, firmado ni publicado una aplicación.

## Qué funciona en esta base

- Navegación Inicio, Buscar, Biblioteca y Temas, con detalle de pistas.
- Búsqueda de metadata de demostración con TanStack Query.
- Aplicación de tres presets, colores, radios, densidad y navegación.
- Persistencia local de tema e importación de JSON validado desde Studio.
- Contratos de fuentes y reproducción, con capacidades explícitas.

No hay música reproducible ni conexiones OAuth todavía. Las pistas son metadata ficticia.
Blur, Liquid Glass, transiciones avanzadas y variantes de player tienen dependencias preparadas,
pero sus renderizadores nativos están pendientes. La tienda, el backend y los pagos también.

## Comprobaciones

```bash
npm run check
npm run doctor
npm run export:web
```

`check` ejecuta TypeScript, ESLint y pruebas del contrato y las fuentes.
La exportación web no reemplaza una prueba en Android e iOS.

## Organización

- `src/app`: rutas de Expo Router.
- `src/features`: pantallas por función.
- `src/music/core`, `sources`, `playback`: contratos y adaptadores.
- `src/theme`: estado y aplicación de temas.
- `src/storage`: preferencias y límite de almacenamiento seguro para futuros tokens.
- `packages/theme-core`: fuente canónica de contrato y presets.
- `docs`: arquitectura, siguientes pasos y un tema de ejemplo.

Mantén los tokens OAuth fuera de AsyncStorage y de variables EXPO_PUBLIC.
El ID nativo `com.jordyfajardo.mreplayer` es inicial y debe revisarse antes de registrar la app en tiendas.
