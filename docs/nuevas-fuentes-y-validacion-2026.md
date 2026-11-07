# Nuevas fuentes científicas y revisión del atlas — Hito 1.3.17

## Inventario de documentos entregados (noviembre de 2026)

Se recibieron **10 PDF, de los cuales 8 son obras diferentes**: el artículo de Dávila et al. (2019) aparece dos veces y el de Lucas y Alvarado (2010) también. Esta es una evaluación bibliográfica inicial; **no implica que todas las páginas de las ocho obras hayan sido contrastadas individualmente**.

| Fuente | Alcance y uso previsto | Precaución |
|---|---|---|
| Pérez y colaboradores, *Paleoclima y paleoecología de las tierras bajas al norte de los neotrópicos* (Revista UVG 18, pp. 65–83) | Reconstrucción paleoambiental del lago Petén Itzá mediante microfósiles y sedimentos | No convertir automáticamente núcleos lacustres en localidades de megafauna |
| Dávila et al. (2019), *Guatemala's Late Pleistocene (Rancholabrean) fauna: Revision and interpretation*, *Quaternary Science Reviews* 219:277–296. DOI 10.1016/j.quascirev.2019.07.011 | Síntesis y revisión de fauna, datación e interpretación biogeográfica | Algunas interpretaciones son discutidas por Lucas et al. (2022); atribuir cada postura a sus autores |
| Batres Alfaro (2003), *El Paleoindio en América: una propuesta teórico-metodológica para Guatemala*, tesis USAC | Contexto arqueológico y metodología del poblamiento temprano | Hipótesis arqueológicas no equivalen a asociaciones humanas con fósiles demostradas |
| Lucas y Alvarado (2010), *Fossil Proboscidea from the Upper Cenozoic of Central America*, *Revista Geológica de América Central* 42:9–42 | Taxonomía y distribución regional de proboscídeos | Distinguir *Mammut*, *Mammuthus*, *Gomphotherium* y *Cuvieronius*; no usar «mastodonte» como identificación automática |
| Lucas et al. (2022), *The fossil vertebrates of Guatemala*, *Revista Geológica de América Central* 66:1–32. DOI 10.15517/rgac.v66i0.48590 | Revisión de vertebrados fósiles guatemaltecos; al menos 36 localidades pleistocénicas | La publicación cuestiona inferencias sobre asociación humana y migración de mamuts; 36 localidades no equivalen a las 77 fichas documentales del atlas |
| Mead et al. (2012), *Late Pleistocene mammals from Chivacabé, Huehuetenango, Guatemala*, *Revista Mexicana de Ciencias Geológicas* 29(2):319–329 | Fauna de Chivacabé y edades de 15,700–12,920 años calendario; revisión tafonómica | No presentar pecarí, *Eremotherium* ni modificaciones humanas como comprobadas para este sitio |
| Cuadrelli et al. (2023), *Glyptotherium cylindricum ... from the Late Pleistocene of Guatemala*, *Alcheringa* 47(3):336–347. DOI 10.1080/03115518.2023.2242440 | Estudio anatómico de material guatemalteco asignado a *G. cylindricum* | Vincular a localidad específica únicamente después de revisar el apartado de procedencia |
| Lucas, Requena y Alvarado (2016), *Cuvieronius ... del Pleistoceno de Chahal, Guatemala*, *Revista Guatemalteca de Ciencias de la Tierra* 3(1), pp. 67 ss. | Mandíbula de proboscídeo de Chahal, Alta Verapaz | No divulgar el mapa detallado del artículo ni convertirlo en coordenada pública del yacimiento |

## Hallazgos que deben afectar al catálogo

1. **GP-HIST-026 — Chivacabé:** añadir como fuentes de contraste Mead et al. (2012), Dávila et al. (2019) y Lucas et al. (2022). Conservar en estado de referencia histórica hasta cotejar datos de colección; no afirmar coexistencia o intervención humana demostrada.
2. **Chinautla:** Lucas et al. (2022) interpreta el holotipo histórico de «Serridentinus guatemalensis» como *Gomphotherium* de probable Mioceno tardío. No reasignar sin distinguir cuál ficha describe ese espécimen, porque existen varias referencias de Chinautla y distintas fechas.
3. **Chahal, Alta Verapaz:** revisar si ya existe un registro equivalente; en caso contrario, proponer una ficha nueva sustentada en Lucas et al. (2016), con ubicación pública limitada a departamento/municipio.
4. **Gliptodontes:** revisar fichas de Estanzuela frente a Cuadrelli et al. (2023), evitando atribuir *G. cylindricum* a todos los restos de gliptodonte.
5. **Paleoambiente:** crear una capa editorial separada para estudios lacustres de Petén Itzá; no contarlos como yacimientos de vertebrados.
6. **Interpretaciones divergentes:** Dávila et al. (2019) propone un escenario biogeográfico; Lucas et al. (2022) cuestiona parte de esas inferencias. Registrar ambas posturas y la evidencia de cada una, sin elegir una como certeza definitiva.

## Pruebas automáticas y funcionales

- El PR #23 con ocho pruebas está incorporado en `main` (comparación de ramas: cero commits pendientes).
- Las verificaciones estructurales sobre el contenido del repositorio dieron resultados favorables: IDs, fuentes, autorización de coordenadas, elementos HTML, scripts, eventos y catálogo compacto.
- La consulta a las ejecuciones del commit de `main` no devolvió runs de GitHub Actions: **no hay confirmación de CI en verde**. Verificar en Actions que el workflow esté habilitado, que tenga permisos de ejecución y que el PR active `pull_request`.
- **Pruebas de navegador aún pendientes:** interacción de Leaflet, selección de departamento, apertura/cierre de ficha modal, accesibilidad por teclado, paginación, filtros, móvil y errores de carga de GeoJSON.
- Las pruebas actuales son estáticas: no simulan clics, red, DOM real ni renderizado. Para afirmar «pruebas funcionales superadas» es necesario ejecutarlas en un navegador real (por ejemplo, Playwright).

## Orden propuesto

1. Confirmar ejecución verde de GitHub Actions y agregar prueba automatizada de navegador.
2. Revisar la versión pública en escritorio y móvil y corregir los fallos observados.
3. Enriquecer primero las fichas Chivacabé, Chinautla, Chahal y gliptodontes con citas completas y notas de controversia.
4. Consolidar tabla de localidades por yacimiento real, diferenciada de campañas y menciones bibliográficas.
5. Continuar con polígonos departamentales y sección educativa.
