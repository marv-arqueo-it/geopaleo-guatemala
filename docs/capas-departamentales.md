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
