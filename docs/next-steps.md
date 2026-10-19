# Alcance de escucha y pendientes

La guía 1.0 mezcla decisiones acordadas, propuestas y funciones futuras. La petición actual prioriza Player y excluye la tienda. Audius permite probar un catálogo reproducible sin credenciales de Spotify, Apple o Google.

Implementado: catálogo real, búsqueda, reproducción directa, importación local, navegación, mini player, cola, favoritos, historial, playlists y personalización con los tres presets.

Pendientes que impiden llamar a esta rama una aplicación de producción completa:

1. Registrar las apps de Spotify, Google y Apple; implementar y probar OAuth, renovación/revocación y los SDK oficiales. Guardar credenciales privadas en servidor o SecureStore según el caso; nunca en EXPO_PUBLIC.
2. Probar en Android/iOS: segundo plano, pantalla bloqueada, Bluetooth, interrupciones, permisos, importación y almacenamiento, redes lentas y modo avión. La app no solicita micrófono.
3. Extender temas a paquetes con recursos, instalación/versionado y recuperación; revisar contraste de temas importados. El esquema actual sigue siendo JSON v1.
4. Definir sincronización y cuenta MRE, aislamiento de extensiones declarativas y capacidades por proveedor.
5. Más adelante: letras con una fuente autorizada, Android Auto, gestos avanzados, continuidad entre proveedores y el marketplace.

No se implementa un sustituto de los SDK comerciales usando URLs extraídas. YouTube requerirá video visible y no ofrecerá audio separado ni fondo oculto.
