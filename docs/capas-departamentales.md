# Hito 1.3.7 — Límites departamentales locales

La capa Leaflet busca primero `data/guatemala-departamentos.geojson`.
Si ese archivo aún no existe, consulta la API pública de geoBoundaries (gbOpen, GTM, ADM1).
Si ambas fuentes fallan, aparece un mensaje de diagnóstico en el panel izquierdo y el mapa base sigue operativo.

## Generar el archivo local

Desde la raíz del repositorio, con Python 3 y conexión a Internet:

```bash
python scripts/actualizar_departamentos.py
```

El script descarga los límites ADM1 desde geoBoundaries, verifica que haya 22 departamentos y crea `data/guatemala-departamentos.geojson`.
Después hay que revisar el resultado, confirmar la licencia vigente y hacer commit del archivo generado. **Hasta ese commit, la copia local no está publicada.**

**Fuente prevista:** geoBoundaries gbOpen, Guatemala, ADM1. **Licencia indicada habitualmente:** ODbL 1.0; verificar la respuesta de metadatos al descargar. Conservar atribución y cumplir condiciones de uso y redistribución.

Los polígonos delimitan departamentos administrativos. No son sitios paleontológicos ni coordenadas de fósiles.

## Pruebas

1. En GitHub Pages, comprobar el mensaje de carga en el panel izquierdo.
2. Abrir el selector de capas; debe aparecer `Departamentos: referencias históricas` cuando la carga termine.
3. Activar la capa y verificar colores, leyenda y ventanas emergentes.
4. Comprobar que seleccionar un departamento filtra el catálogo.
5. Confirmar que los puntos demostrativos y el mapa base siguen funcionando.

Si el archivo local existe pero no carga, revisar Network/Console y validar que sea GeoJSON.

## Estado operativo y diagnóstico (noviembre de 2026)

El PR #31 fue fusionado y `data/guatemala-departamentos.fuente.json` está en `main`, **pero el archivo GeoJSON todavía no está publicado en `main`**. No confundir metadatos con geometrías disponibles. El importador fijado en `scripts/importar_limites_verificados.py` valida SHA-256 y 22 nombres únicos; el workflow `Integrar capa departamental verificada` intenta registrar el archivo mediante un commit automático. Debe ejecutarse o comprobarse su ejecución y verificar que tenga permisos `contents: write`. Si la fuente versionada no responde o cambia el archivo, la operación fallará por diseño. No eliminar la comprobación de integridad.

### Comprobación sin Chromium

1. Abrir el repositorio en la rama `main` y confirmar la presencia real de `data/guatemala-departamentos.geojson`.
2. Comprobar que `data/guatemala-departamentos.fuente.json` declara procedencia y licencia.
3. En un clon local, ejecutar `python scripts/validar_capa_departamental.py`. Comprueba 22 geometrías, nombres únicos y huella SHA-256; si falta el archivo, indica que la importación está pendiente.
4. Publicar y comprobar visualmente en GitHub Pages: selector de capas, leyenda, popups y filtros. No declarar este paso terminado antes de verlo funcionando.

**Licencia:** la atribución disponible indica OpenStreetMap y Wambacher, ODbL 1.0. Confirmar los requisitos concretos de atribución y redistribución antes de utilizar la capa en otros productos.
