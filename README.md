# MRE Player

Reproductor de MusicMultiExperience para Android, iOS y web con React Native, TypeScript y Expo SDK 57. Esta rama desarrolla la experiencia de escucha; Studio y la tienda quedan fuera de esta entrega.

## Ejecutar

Requisitos: Node 24 y npm.

```sh
npm ci
npm run web
```

Para Android/iOS usa una development build nueva, porque se incorporó expo-audio. `npm start` conecta esa build al servidor. Puedes generarla con EAS después de configurar tu cuenta y el proyecto:

```sh
npx eas-cli@latest build:configure
npx eas-cli@latest build --profile development --platform android
```

La configuración habilita audio de fondo y no solicita micrófono. No se ha firmado, publicado ni probado una APK/IPA en dispositivos físicos.

## Experiencia disponible

- Inicio con tendencias y carátulas reales de Audius; búsqueda por artista y canción con cancelación de consultas y estados de error.
- Reproducción de pistas públicas habilitadas en Audius e importación de archivos de audio propios.
- Reproductor y minirreproductor con posición, pausa, anterior/siguiente, volumen, aleatorio, repetición y temporizador.
- Cola con selección, reordenación y eliminación; favoritos, historial y playlists locales.
- Archivos copiados a almacenamiento permanente de la app en Android/iOS. En web, los archivos seleccionados duran la sesión y no se guardan como enlaces caducados.
- Emerald, Liquid Glass y Material Wave: estructura, paleta, navegación y reproductor distintos. Combinación de componentes, acento, vista previa, guardar/cancelar e importación de JSON validado.
- Liquid Glass nativo cuando está disponible; blur en iOS/web y superficie simplificada en Android. Se respeta reducir transparencia. No se usan animaciones automáticas.
- Compartir enlace de una canción y abrir su página original.

## Límites explícitos

Audius no representa el catálogo de Spotify, Apple Music o YouTube Music. Solo se reproducen pistas públicas con streaming habilitado; se excluyen las bloqueadas o sujetas a acceso especial. No se descargan pistas de Audius para escucha offline.

Spotify, Apple Music y YouTube se muestran como pendientes de configurar: todavía no existen credenciales del proyecto ni adaptadores de OAuth/SDK terminados. No hay conexiones simuladas. Los favoritos/playlists de MRE son locales y no alteran los de esos servicios.

El audio de fondo, pantalla bloqueada, auriculares e interrupciones usan expo-audio y requieren validación en teléfonos. En web, el inicio automático está sujeto a la política del navegador. No se ofrecen letras inventadas, Android Auto, crossfade, cuenta MRE, sincronización remota, extensiones descargables ni tienda.

El formato actual es JSON declarativo v1, no un ZIP con recursos. Studio conserva su contrato compatible; los presets canónicos de Player cambiaron y deberán sincronizarse allí cuando se trabaje en Studio.

## Validación

```sh
npm run check
npm run doctor
npm run export:web
```

Las pruebas cubren validación del tema, fuentes, normalización y restricciones de Audius, errores, cola, cambios de pista, liberación del motor y temporizador. La exportación web y los bundles móviles no sustituyen pruebas físicas.

Consulta [alcance y pendientes](docs/next-steps.md) y [referencias visuales](docs/design-references.md).
