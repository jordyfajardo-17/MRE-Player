# Arquitectura inicial

MRE Player escucha y consume temas; MRE Theme Studio crea temas. MRE Platform será
un backend compartido posterior para identidad, distribución, licencias, moderación y pagos.
La separación en dos repositorios sigue la decisión actual del proyecto.

La única fuente de contrato es `packages/theme-core` en Player. Studio consume un snapshot
de sus mismos archivos, fijado a un commit y comprobado por hashes. Esta distribución
transitoria evita depender de un registro npm todavía inexistente. La publicación versionada
del paquete compartido es el siguiente paso cuando se decida su alojamiento.

Los tokens y componentes son datos. Validar un manifiesto no carga código remoto ni integra
fuentes de música. La aplicación decide cómo renderizar cada variante y mantiene fallbacks.
El formato inicial no permite assets, scripts o claves desconocidas. Evolucionarlo exige
nuevas pruebas, compatibilidad y migraciones explícitas.

Las integraciones musicales conservarán proveedor e identificador original. Cada adaptador
declara capacidades. No se promete audio en segundo plano para todas las fuentes;
por ejemplo, el reproductor oficial visible de YouTube tiene condiciones particulares.
SDK del proveedor, audio autorizado, video visible y control remoto son destinos distintos.

Zustand gestiona estado local de UI. TanStack Query organiza consultas asíncronas.
Player guarda apariencia en AsyncStorage y reserva SecureStore para credenciales nativas.
Studio guarda un borrador en localStorage. Ninguna app almacena canciones en esta entrega.

La biblioteca, el marketplace y los módulos de cuentas/ganancias se desarrollarán después.
La vista previa web sirve para composición; la fidelidad nativa se comprueba en teléfonos.
