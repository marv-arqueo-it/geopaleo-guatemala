# Integración de la capa departamental local — procedimiento verificable

**Estado:** la capa no está integrada mientras no existan ambos archivos en `main`:
- `data/guatemala-departamentos.geojson`
- `data/guatemala-departamentos.fuente.json`

## Descarga y comprobación en GitHub

1. En **Actions → Preparar límites departamentales**, pulsar **Run workflow** en la rama `main`.
2. Abrir la ejecución completada. Si el trabajo falla, leer el registro de `Descargar y validar límites ADM1` y verificar acceso a la API de geoBoundaries.
3. Descargar el artefacto `guatemala-departamentos-geojson-revisar-licencia`.
4. Descomprimir y revisar que incluya los dos archivos anteriores. Comprobar en `.fuente.json` el origen, año, licencia y condiciones de atribución. No publicar sin verificar esos datos.
5. En GitHub, abrir la carpeta `data/` y usar **Add file → Upload files** para incorporar ambos archivos en una rama de trabajo y crear un PR.
6. Confirmar que `Validar GeoPaleo` termine en verde y que el mapa muestre el mensaje «Capa departamental disponible». Activar la capa desde el control de Leaflet.
7. Probar filtros por departamento, contadores, 22 polígonos y visualización móvil. Confirmar que la leyenda expresa **referencias bibliográficas** y no coordenadas de yacimientos.

## Verificaciones automatizadas

El script `scripts/actualizar_departamentos.py` rechaza una capa que no tenga 22 polígonos con nombres únicos y geometrías Polygon/MultiPolygon. `js/distribucion.js` valida los 22 polígonos al cargar y utiliza los metadatos de la copia local para atribución. Si la capa local falla, el visor intenta geoBoundaries remotamente y mantiene el mapa base disponible.

## Limitaciones

Este entorno no pudo resolver el dominio de geoBoundaries; por eso **no se ha incorporado un archivo de límites sin verificar**. La ejecución de Actions es el siguiente paso externo necesario. No subir coordenadas exactas de sitios arqueológicos o paleontológicos.

## Estado de pruebas

El PR #28 fue fusionado. La ejecución revisada del PR #28 mostró `catalogo` correcto y `navegador` fallido al abrir la ficha (línea 32). El código del modal se corrigió posteriormente; la prueba del commit fusionado requiere una ejecución nueva para demostrar el resultado.
