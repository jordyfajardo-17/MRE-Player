# Referencias visuales de Player

Revisión: 18 de octubre de 2026. Los presets tienen nombre e identidad propios. No son temas oficiales ni réplicas exactas.

- Apple Music: la guía oficial de iPhone para iOS 27 ofrece la referencia del producto. Se priorizan carátula, jerarquía clara y navegación compacta. Liquid Glass usa detección de disponibilidad, no una afirmación de que el mismo efecto exista en todos los dispositivos.
  https://support.apple.com/guide/iphone/get-started-with-music-iph850be8527/27/ios/27
  https://www.apple.com/apple-music/
- Spotify: ficha oficial para iPhone. Emerald interpreta listas densas, fondo oscuro y acento verde. La ficha no garantiza que sus capturas correspondan específicamente a iOS 27.
  https://apps.apple.com/us/app/spotify-music-and-podcasts/id324684580
- YouTube Music: ficha oficial para iPhone. Material Wave interpreta descubrimiento por carátulas, superficies coloreadas y foco inmersivo. Las capturas no constituyen una especificación exclusiva de iOS 27.
  https://apps.apple.com/us/app/youtube-music/id1017492454

## Decisiones técnicas verificadas

- Audio y controles del sistema: https://docs.expo.dev/versions/v57.0.0/sdk/audio/
- Material nativo: https://docs.expo.dev/versions/v57.0.0/sdk/glass-effect/
- Blur y fallback: https://docs.expo.dev/versions/v57.0.0/sdk/blur-view/
- API del catálogo y streaming: https://docs.audius.co/api/

La API de iTunes se evaluó y no se utilizó como fuente de entretenimiento: sus previews tienen finalidad promocional. El catálogo reproducible elegido es Audius.

## Segunda iteración de cristal

Revisión 22 de octubre de 2026. El material se aplica a listas, controles, paneles y navegación, con una cápsula de selección deslizante y un reproductor expansible por gesto. La reproducción permanece en su propio store; la presentación solo altera dimensiones, posición y contenido visual.

Android usa BlurTargetView sobre el fondo ambiental, separado de las superficies que lo consumen para evitar captura recursiva. Se usa dimezisBlurViewSdk31Plus para reservar blur eficiente a Android 12 o superior. En iOS compatible se utiliza GlassView; el fallback emplea BlurView y capas translúcidas. Reducir transparencia fuerza superficies sólidas. Reducir movimiento elimina las transiciones programadas; los botones siguen disponibles sin gestos.

Se evita opacidad cero en ancestros de GlassView por la limitación documentada de Expo. Los controles de desplazamiento y volumen no comparten el detector vertical: solo el mini player y el asa de expansión reconocen ese gesto.

- Gestos y valores compartidos: https://docs.swmansion.com/react-native-reanimated/docs/core/useSharedValue/
- Spring: https://docs.swmansion.com/react-native-reanimated/docs/animations/withSpring/
