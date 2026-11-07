# Hito 1.3.18 — Primeros cinco pendientes

Fecha: 2026-11-07.

## 1. CI / GitHub Actions
El flujo `.github/workflows/validar-geopaleo.yml` conserva las ocho pruebas estructurales y agrega una prueba de navegador Chromium. No declarar CI en verde hasta consultar la ejecución del commit correspondiente. Si no hay ejecuciones, verificar Actions > Validar GeoPaleo > habilitación y permisos del repositorio.

## 2. Navegador y móvil
Se agregó `tests/smoke-browser.cjs`: arranque del atlas mediante servidor local, carga de 78 registros, acordeón cerrado inicialmente, seis tarjetas por página, búsqueda de Chivacabé, apertura/cierre de modal, limpieza de filtros y renderizado de mapa. La misma prueba visita el sitio con viewport móvil de 390 px. **La prueba aún debe ejecutarse en GitHub Actions**. No sustituye revisión visual humana ni garantiza que teselas o polígonos externos estén disponibles.

## 3. Chivacabé
`GP-HIST-026`: añadida referencia especializada Mead et al. (2012), pp. 319–320; fauna y cronología de su conjunto de estudio. Se diferencia la ausencia de evidencia de modificaciones humanas en material examinado de cualquier afirmación general sobre poblamiento temprano.

## 4. Chinautla
`GP-HIST-004`: añadida nota taxonómica basada en Lucas et al. (2022), pp. 1–2. El holotipo denominado históricamente *Serridentinus guatemalensis* es interpretado allí como *Gomphotherium* del probable Mioceno tardío. **No se atribuye automáticamente ese espécimen a las noticias de 1875–1876, 1947 ni 1962**. Pendiente cotejar procedencia y año exactos.

## 5. Chahal
`GP-HIST-078`: nueva ficha bibliográfica sustentada en Lucas, Requena y Alvarado (2016), pp. 67–69. Incluye la mandíbula de *Cuvieronius hyodon* y ubicación administrativa Chahal, Alta Verapaz; sin coordenadas exactas ni imagen del mapa detallado. El total pasa de 77 a **78 fichas**, de ellas 77 históricas y una demostrativa. El conteo no equivale al número de yacimientos únicos.

## Pruebas de aceptación
- [ ] CI `catalogo` y `navegador` en verde para el commit del PR.
- [ ] Confirmar resultados en navegador real, incluida vista móvil, sin errores de consola.
- [ ] Verificar visualmente que la ficha de Chivacabé no desborda el modal al tener descripción extensa.
- [ ] Revisar enlaces de referencias, taxonomía y procedencia con especialistas.
- [ ] Confirmar que no se publiquen coordenadas precisas de sitios sensibles.

## Pendientes posteriores
1. Revisar gliptodontes frente a Cuadrelli et al. (2023), sin reasignaciones generales.
2. Separar localidades únicas, campañas y menciones históricas.
3. Revisar taxones de Chinautla a partir de la documentación de colección.
4. Resolver polígonos departamentales y optimizar capas.
5. Ampliar sección educativa de fauna, paleoambientes y criterios de revisión editorial.
