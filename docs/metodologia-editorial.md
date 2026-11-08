# Metodología editorial de GeoPaleo Guatemala

## Propósito
GeoPaleo es un atlas de divulgación y referencias bibliográficas. Las fichas son **registros documentales**, no un inventario confirmado de yacimientos distintos. Una localidad puede generar varias publicaciones, campañas o ejemplares; una publicación puede citar varios lugares.

## Tipos que deben distinguirse
- **Localidad paleontológica**: unidad espacial de procedencia sustentada por fuente.
- **Evento de hallazgo / campaña**: fecha o actividad de rescate o investigación en una localidad.
- **Ejemplar o conjunto**: material de colección con identificación, procedencia y custodia.
- **Referencia bibliográfica**: mención documental, potencialmente duplicada o sin ubicación precisa.

El catálogo actual no implementa aún entidades separadas. Para evitar errores, se conserva cada ficha y se prepara una futura migración con relaciones `localidad_id`, `evento_id`, `ejemplar_id` y `fuente_id`. **No fusionar automáticamente** fichas con el mismo municipio o nombres parecidos.

## Criterios de verificación
1. Identificar fuente primaria y secundaria; registrar autor, año, páginas, DOI y material examinado.
2. Verificar taxón, nomenclatura actual, edad y método de datación. No convertir contexto general en datación del espécimen.
3. Verificar procedencia mediante colección o expediente institucional; documentar incertidumbre.
4. Proteger coordenadas exactas y direcciones privadas. Los marcadores departamentales son cabeceras aproximadas y no yacimientos.
5. Mantener `referencia_historica`, `sin_verificar` o `identificacion_discutida` hasta revisión responsable; no promover a `verificado` por citar un artículo.
6. Para correcciones, conservar versión anterior, motivo, responsable, fecha y fuente.

## Candidatos de revisión
- Estanzuela: varias campañas de 1971/1977, sitios n.º 2, 65, 68–70 y gliptodontes.
- Chinautla: menciones de 1875–1876, 1947 y 1962; no confundir con el holotipo *Serridentinus guatemalensis* revisado como *Gomphotherium*.
- Río La Pasión: distintos especímenes y fechas; separar 1950 y 1977.
- Jutiapa y La Reforma: procedencias incompletas y posibles solapamientos.
- Chivacabé: agrupar campañas, pero conservar identificaciones y dataciones con fuente y conjunto examinados.
- Chahal: ficha basada en artículo de 2016, sin coordenadas públicas del hallazgo.

## Herramientas
`python scripts/validar_catalogo.py` comprueba integridad y coordenadas.
`python scripts/revisar_localidades.py` lista candidatos por municipio, **sin afirmar duplicidad**.
`python -m unittest discover -s tests -p 'test_*.py' -v` comprueba regresiones estáticas.
`node tests/smoke-browser.cjs` necesita Chromium/Playwright y un servidor local en puerto 8765.

## Derechos, fuentes y actualización
No subir fotografías, mapas de detalle o textos extensos de artículos sin permiso/licencia compatible. Atribuir cada publicación y mantener vínculos a DOI cuando proceda. Corregir datos cuando una investigación posterior contradiga interpretaciones antiguas, preservando el historial. Se recomienda incorporar un formulario editorial de propuestas de corrección y revisión humana previa a la publicación.

## Límites geográficos
La capa geoBoundaries ADM1 depende actualmente de un servicio externo si no existe `data/guatemala-departamentos.geojson`. Se recomienda obtener una copia local con procedencia y licencia verificadas, ejecutar `scripts/actualizar_departamentos.py` y revisar geometrías antes de incluirla en el repositorio. No confundir límites administrativos con ubicaciones fósiles.
