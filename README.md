# GeoPaleo Guatemala — Prototipo 0.1

Geoportal educativo experimental sobre el patrimonio paleontológico de Guatemala.

## Publicación en GitHub Pages
1. Crear un repositorio público llamado `geopaleo-guatemala`.
2. Subir `index.html` y las carpetas `css`, `js`, `data` **a la raíz del repositorio**.
3. Abrir **Settings → Pages → Build and deployment**.
4. Elegir **Deploy from a branch**, rama `main` y carpeta `/(root)`; guardar.
5. Visitar `https://TU_USUARIO.github.io/geopaleo-guatemala/` después del despliegue.

No requiere compilación, Node.js ni servidor propio. Leaflet y los mosaicos de OpenStreetMap requieren Internet.

## Importante
- Los seis puntos GeoJSON son **ilustrativos**, situados aproximadamente en cabeceras departamentales. **No** representan yacimientos fósiles ni registros científicos verificados.
- No publicar coordenadas exactas de sitios patrimoniales sensibles.
- Reemplazar referencias de demostración únicamente tras validación documental y científica.
- La opción de contacto está desactivada hasta disponer de un canal oficial.
- Antes de usar imágenes de terceros, verificar derechos de uso y atribución.

## Estructura
- `index.html`: portada y secciones.
- `css/styles.css`: identidad visual y diseño adaptable.
- `js/app.js`: lógica del mapa y filtros.
- `data/ejemplos.geojson`: datos ficticios de presentación geográfica.
