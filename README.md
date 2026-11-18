# GeoPaleo Guatemala — Atlas paleontológico documental

Geoportal educativo experimental sobre referencias paleontológicas de Guatemala. Se publica como sitio estático (HTML, CSS, JavaScript y Leaflet) mediante GitHub Pages.

**Sitio:** https://marv-arqueo-it.github.io/geopaleo-guatemala/

## Alcance y precauciones

- Las fichas son **registros documentales**, no necesariamente yacimientos independientes o hallazgos científicamente verificados. Consultar el estado de verificación y las fuentes de cada ficha.
- Los puntos demostrativos son ficticios. Los marcadores orientativos y polígonos departamentales **no** señalan coordenadas reales de fósiles.
- No publicar ubicaciones patrimoniales sensibles ni fotografías o materiales sin licencia o autorización.
- Para contrastar identificaciones y evitar duplicidades, consultar [metodología editorial](docs/metodologia-editorial.md).

## Publicación

1. Mantener `index.html`, `css/`, `js/` y `data/` en la raíz del repositorio.
2. En **Settings → Pages → Build and deployment**, seleccionar **Deploy from a branch**, `main` y `/(root)`.
3. Verificar la publicación en la URL anterior. Leaflet y mosaicos de OpenStreetMap requieren conexión a Internet.

No se necesita compilación ni servidor propio para GitHub Pages. Para probar localmente, ejecutar desde la raíz:

```bash
python -m http.server 8765
```

Abrir `http://localhost:8765/` (no abrir `index.html` directamente con `file://` porque los `fetch` pueden fallar).

## Componentes y datos

- `index.html`: portada, mapa, catálogo y contenidos educativos.
- `css/styles.css`: diseño adaptable.
- `js/app.js`: mapa y navegación.
- `js/catalogo.js`: filtros, paginación y fichas en diálogo.
- `js/distribucion.js`: polígonos departamentales y conteos de referencias.
- `data/catalogo.json`: fichas documentales y referencias.
- `data/ejemplos.geojson`: demostración geográfica, **no hallazgos reales**.
- `data/guatemala-departamentos.fuente.json`: procedencia declarada de la capa administrativa.
- `data/guatemala-departamentos.geojson`: copia local de límites **solo cuando se haya generado y confirmado**.

## Capa departamental

El mapa busca primero `data/guatemala-departamentos.geojson`. Si no está publicado, intenta geoBoundaries y puede fallar por red o disponibilidad. La capa es opcional; el mapa base debe seguir funcionando.

La importación verificable usa `python scripts/importar_limites_verificados.py` y exige que el archivo descargado coincida con un SHA-256 registrado. El flujo [Integrar capa departamental verificada](.github/workflows/integrar-limites.yml) también puede ejecutarse manualmente en GitHub Actions; **fusionar el código no significa que el GeoJSON ya esté incorporado**. Comprobar que el archivo exista en `main` y que el selector de capas lo muestre en la web. Si la descarga falla, revisar el registro del flujo y no cambiar la huella digital sin revisar el archivo de origen.

Consultar [guía de capas departamentales](docs/capas-departamentales.md). Los límites representan áreas administrativas, no yacimientos. Revisar y respetar la atribución y condiciones de ODbL antes de redistribuir la capa.

## Validación y contribuciones

```bash
python scripts/validar_catalogo.py
python scripts/revisar_localidades.py
python -m unittest discover -s tests -p 'test_*.py' -v
node --check js/app.js
node --check js/catalogo.js
node --check js/distribucion.js
```

La validación automática comprueba estructura y seguridad de publicación, **no sustituye una revisión paleontológica**. Las pruebas de navegador con Playwright quedan como fase posterior; no son requisito para contrastar fuentes ni preparar la capa.

Las propuestas de corrección deben indicar ID de ficha, referencia (autor, año, página/DOI), cambio propuesto, motivo y responsable de revisión. No actualizar estados a «verificado» sin respaldo documental y revisión responsable.

## Pendientes activos

1. Confirmar la descarga e incorporación del GeoJSON local en `main` y comprobar el selector de capas.
2. Revisar fuentes, taxonomía, fechas y posibles registros relacionados sin fusionar fichas automáticamente.
3. Revisar usabilidad y accesibilidad en móvil.
4. Finalmente, depurar pruebas automatizadas de Chromium.

La opción de contacto permanece desactivada hasta contar con un canal oficial.
