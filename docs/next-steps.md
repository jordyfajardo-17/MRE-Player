# Alcance de escucha y pendientes

La guía 1.0 mezcla decisiones acordadas, propuestas y funciones futuras. La petición actual prioriza Player y excluye la tienda. Audius y Archivo abierto permiten probar catálogos reproducibles sin conectar Spotify, Apple o Google.

Implementado: dos catálogos reales, búsqueda con filtros/paginación, reproducción directa, importación local, navegación con cápsula animada, mini player expansible por gesto, superficies de cristal, cola, favoritos, historial, playlists y personalización con los tres presets.

Pendientes que impiden llamar a esta rama una aplicación de producción completa:

1. Probar en Android/iOS: segundo plano, pantalla bloqueada, Bluetooth, interrupciones, permisos, importación y almacenamiento, redes lentas y modo avión. La app no solicita micrófono.
2. Extender temas a paquetes con recursos, instalación/versionado y recuperación; revisar contraste de temas importados. El esquema actual sigue siendo JSON v1.
3. Definir sincronización y cuenta MRE, aislamiento de extensiones declarativas y capacidades por proveedor.
4. Más adelante: letras con una fuente autorizada, Android Auto, continuidad entre proveedores y el marketplace. Las conexiones de Spotify, Google y Apple quedan aplazadas expresamente; se revisarán sus SDK y credenciales cuando se retomen.

No se implementa un sustituto de los SDK comerciales usando URLs extraídas. YouTube requerirá video visible y no ofrecerá audio separado ni fondo oculto.
