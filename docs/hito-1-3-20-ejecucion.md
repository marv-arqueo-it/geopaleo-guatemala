# Hito 1.3.20 — Ejecución y pendientes

## Prioridad alta
1. **CI:** no hay ejecuciones devueltas por la consulta de workflows del PR anterior. El workflow existe en `main`, pero no se ha confirmado que se ejecute en GitHub. Se requiere revisar configuración de Actions y el resultado de `catalogo` y `navegador`.
2. **Pruebas de navegador:** se corrigió una espera problemática: `#catalogo-contador` está dentro de un `details` inicialmente cerrado. La nueva prueba espera el texto en DOM sin exigir visibilidad. Se añadieron comprobaciones de búsqueda sin tildes, presencia de cuatro tarjetas educativas y desbordamiento horizontal móvil. **No se ha ejecutado Chromium en esta sesión**; la ejecución queda pendiente en Actions.
3. **Duplicados:** `scripts/revisar_localidades.py` identifica fichas agrupadas por municipio. Se debe verificar colección, ejemplar, año, campaña y fuente antes de fusionar. No se ha eliminado ningún registro.

## Prioridad media
4. **Límites ADM1:** se añadió `.github/workflows/preparar-limites.yml`, ejecución manual que descarga GeoJSON mediante `scripts/actualizar_departamentos.py`, comprueba 22 departamentos, nombres únicos y geometrías, y entrega un artefacto. No publica directamente el archivo para evitar incluir datos sin revisar licencia, fuente y geometrías. La capa del atlas conserva su mecanismo local y fallback remoto.
5. **Revisión científica:** el catálogo conserva 78 fichas. Se mantiene la advertencia sobre atribuciones históricas, Chivacabé, Chinautla, Chahal y gliptodontes. La revisión individual con fuentes primarias continúa pendiente.
6. **Correcciones públicas:** se añadió una plantilla de GitHub Issues para proponer cambios con fuentes y código de ficha, sin divulgar coordenadas sensibles. La navegación del sitio enlaza a la sección educativa y a la propuesta de corrección.

## Criterios de cierre
- [ ] Workflow `Validar GeoPaleo` en verde en commit actual (ambos jobs).
- [ ] Pruebas visuales en escritorio y móvil, mapa, modal, filtros, listado, accesibilidad y errores de red.
- [ ] GeoJSON descargado como artefacto, licencia verificada y copia local integrada mediante PR.
- [ ] Revisión taxonómica y de duplicados por responsable científico, con trazabilidad de fuentes.
- [ ] Confirmar que GitHub Issues está habilitado y la plantilla se muestra.
