# Theme core

Contrato y presets de temas, sin React ni APIs de plataforma. La fuente canónica está en
`jordyfajardo-17/MRE-Player/packages/theme-core`. Studio contiene una copia controlada,
con origen y hashes en `docs/theme-core-source.json`; no desarrolla un segundo esquema.

Formato inicial: JSON `.mmetheme.json`, máximo 65 536 caracteres. El paquete ZIP
`.mmetheme`, recursos, licencias y nuevas familias de componentes pertenecen a etapas futuras.
El motor 1 acepta campos y componentes conocidos, colores #RRGGBB, radio 0–40 dp,
blur 0–1 y opacidad 0.1–1. Los temas no contienen código ejecutable.

`parseTheme` valida importaciones; `serializeTheme` valida exportaciones.
La selección de componentes es declarativa: el renderizador de cada plataforma implementa
progresivamente las variantes. La vista previa web no garantiza fidelidad nativa de glass.

Evolución: publicar un paquete versionado cuando se configure un registro compartido.
Hasta entonces, no editar esta copia en Studio; sincronizar desde un commit revisado de Player.
