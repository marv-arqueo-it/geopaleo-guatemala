# Revisión editorial y funcional — Hito 1.3.15

## Estado de la auditoría
- Catálogo: 77 fichas; 76 históricas (52 referencias históricas y 24 con datos incompletos) y una demostrativa.
- Departamentos representados: 14.
- Detectado y corregido: identificador `GP-HIST-027` duplicado entre Agencia Guatel y Los Yajes I. Los Yajes I ahora usa `GP-HIST-077`.
- Comprobaciones de datos en la rama: identificadores únicos, título, descripción, fuente de registros históricos y ausencia de coordenadas públicas no autorizadas.
- Automatización: `scripts/validar_catalogo.py` y workflow de GitHub Actions para validar JSON y sintaxis JavaScript.
- Ajuste de interfaz: el botón de limpiar filtros vuelve a la primera página.

## Advertencias científicas antes de publicar como datos validados
1. El total de fichas **no equivale** a cantidad de yacimientos distintos. Hay referencias que describen campañas, hallazgos o especímenes del mismo sitio.
2. Las identificaciones taxonómicas son atribuciones de fuentes históricas, no verificaciones científicas independientes.
3. Revisar posibles solapamientos: Chinautla (varios años), Río La Pasión (distintos especímenes), Jutiapa (molares sin localidad), La Reforma y sitios n.º 2 de Estanzuela.
4. La referencia a Cueva de Chiquibul señala fósiles del lado de Belice: **no debe contabilizarse automáticamente como hallazgo en Guatemala**.
5. Verificar municipios, especialmente la referencia a La Reforma y otros lugares con contradicciones entre tabla y texto.
6. Todos los marcadores morados son puntos orientativos de cabeceras departamentales, **nunca coordenadas de yacimientos**.
7. Comprobar los nombres y páginas de cada ficha contra el PDF original y luego las fuentes primarias.

## Pruebas manuales pendientes (navegador)
- [ ] Abrir/cerrar acordeón y comprobar 6 fichas por página (13 páginas para 77 registros).
- [ ] Buscar por nombre, municipio y departamento; cambiar filtros y comprobar reinicio de página.
- [ ] Seleccionar localidad histórica y abrir ficha modal; cerrar con botón, teclado y fondo.
- [ ] Pulsar marcador morado y filtrar por departamento; confirmar que se abre acordeón.
- [ ] Verificar mapa, scroll interno de listados y controles en móvil.
- [ ] Revisar consola de JavaScript y carga de capas departamentales; si fallan, mantener aviso visible.
- [ ] Confirmar que el catálogo se carga correctamente con conexiones lentas.

La validación automática **no prueba** comportamiento real en navegador ni avala la exactitud científica. No convertir referencias históricas a estado `verificado` sin revisión documental.
