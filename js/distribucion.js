// Hito 1.3.7: polígonos departamentales orientativos de referencias históricas.
// Fuente de límites: geoBoundaries gbOpen ADM1, obtenida mediante su API pública.
// Los polígonos representan jurisdicciones administrativas, NO yacimientos.
(async function iniciarDistribucionDepartamental() {
  const contenedor = document.querySelector("#map");
  if (!contenedor || typeof map === "undefined" || typeof controlCapas === "undefined") return;

  const aviso = document.createElement("p");
  aviso.className = "geo-capa-estado";
  aviso.setAttribute("role", "status");
  aviso.textContent = "Cargando límites departamentales…";
  contenedor.closest(".map-layout")?.querySelector(".panel")?.appendChild(aviso);

  const normalizar = texto => String(texto || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es").replace(/^departamento de\s+/, "").trim();

  const leyenda = L.control({ position: "bottomleft" });
  leyenda.onAdd = () => {
    const caja = L.DomUtil.create("div", "geopaleo-leyenda");
    caja.innerHTML = '<strong>Referencias históricas por departamento</strong>' +
      '<div><i class="geo-nivel-0"></i> Sin referencias en el catálogo</div>' +
      '<div><i class="geo-nivel-1"></i> 1 referencia</div>' +
      '<div><i class="geo-nivel-2"></i> 2 o más referencias</div>' +
      '<small>Distribución administrativa, no ubicación de fósiles.</small>';
    L.DomEvent.disableClickPropagation(caja);
    return caja;
  };

  try {
    const respuestaCatalogo = await fetch("data/catalogo.json");
    if (!respuestaCatalogo.ok) throw new Error("No se pudo leer el catálogo.");
    const registros = await respuestaCatalogo.json();
    if (!Array.isArray(registros)) throw new Error("Catálogo con formato inesperado.");

    // Se intenta primero una copia local versionada. Si todavía no existe,
    // se recurre al servicio oficial de geoBoundaries.
    async function leerGeoJSON(url) {
      const respuesta = await fetch(url, { cache: "no-cache" });
      if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);
      const datos = await respuesta.json();
      if (datos.type !== "FeatureCollection" || !Array.isArray(datos.features) || datos.features.length !== 22 ||
          datos.features.some(f => !f?.properties?.shapeName || !["Polygon", "MultiPolygon"].includes(f?.geometry?.type))) {
        throw new Error("GeoJSON inválido: se esperan 22 departamentos identificados y geometrías Polygon/MultiPolygon.");
      }
      return datos;
    }

    let geojson;
    let procedencia = "geoBoundaries gbOpen ADM1";
    let licencia = "licencia por verificar";
    try {
      geojson = await leerGeoJSON("data/guatemala-departamentos.geojson");
      procedencia += " (copia local)";
      try {
        const metaLocal = await fetch("data/guatemala-departamentos.fuente.json");
        if (metaLocal.ok) {
          const meta = await metaLocal.json();
          if (typeof meta.licencia === "string" && meta.licencia.trim()) licencia = meta.licencia;
          if (typeof meta.fuente === "string" && meta.fuente.trim()) procedencia = meta.fuente + " (copia local)";
        }
      } catch (errorMetadatos) {
        console.info("Metadatos locales no disponibles:", errorMetadatos.message);
      }
    } catch (localError) {
      console.info("Copia local no disponible; consultando geoBoundaries.", localError.message);
      try {
        const respuestaMeta = await fetch("https://www.geoboundaries.org/api/current/gbOpen/GTM/ADM1/");
        if (!respuestaMeta.ok) throw new Error("API geoBoundaries HTTP " + respuestaMeta.status);
        const meta = await respuestaMeta.json();
        if (!/^https:\/\//.test(meta.gjDownloadURL || "")) throw new Error("URL GeoJSON no válida.");
        geojson = await leerGeoJSON(meta.gjDownloadURL);
        licencia = meta.boundaryLicense || licencia;
      } catch (externoError) {
        throw new Error("No se encontraron límites locales y falló geoBoundaries: " + externoError.message);
      }
    }

    const conteos = new Map();
    registros.filter(r => ["referencia_historica", "sin_verificar", "identificacion_discutida"].includes(r.estadoVerificacion)).forEach(r => {
      const dep = normalizar(r.ubicacion?.departamento);
      if (dep) conteos.set(dep, (conteos.get(dep) || 0) + 1);
    });

    const color = cantidad => cantidad >= 2 ? "#8753a5" : cantidad === 1 ? "#c59a57" : "#b7c8c4";
    const poligonos = L.geoJSON(geojson, {
      style: feature => {
        const nombre = normalizar(feature.properties?.shapeName || feature.properties?.name);
        const n = conteos.get(nombre) || 0;
        return { color: "#ffffff", weight: 1.4, fillColor: color(n), fillOpacity: n ? 0.52 : 0.15 };
      },
      onEachFeature: (feature, capa) => {
        const nombre = feature.properties?.shapeName || feature.properties?.name || "Departamento";
        const n = conteos.get(normalizar(nombre)) || 0;
        const bloque = document.createElement("div");
        const titulo = document.createElement("strong");
        titulo.textContent = nombre;
        const detalle = document.createElement("p");
        detalle.textContent = n + " referencia(s) histórica(s) en el catálogo. El área resaltada no indica la ubicación exacta de hallazgos.";
        bloque.append(titulo, detalle);
        if (n) {
          const enlace = document.createElement("a");
          enlace.href = "#catalogo";
          enlace.textContent = "Ver catálogo y filtrar por departamento";
          enlace.addEventListener("click", () => {
            const selector = document.querySelector("#filtro-departamento");
            if (selector) {
              const opcion = [...selector.options].find(o => normalizar(o.value) === normalizar(nombre));
              if (opcion) { selector.value = opcion.value; selector.dispatchEvent(new Event("change")); document.querySelector("#catalogo-desplegable")?.setAttribute("open", ""); }
            }
          });
          bloque.appendChild(enlace);
        }
        capa.bindPopup(bloque, { maxWidth: 300 });
        capa.on("mouseover", () => capa.setStyle({ weight: 2.5, fillOpacity: .72 }));
        capa.on("mouseout", () => poligonos.resetStyle(capa));
      }
    });

    controlCapas.addOverlay(poligonos, "Departamentos: referencias históricas");
    aviso.textContent = "Capa departamental disponible: ábrela desde el botón de capas del mapa.";
    aviso.classList.add("geo-capa-ok");
    // No activar automáticamente: conservar el mapa existente y evitar superposición.
    let visible = false;
    map.on("overlayadd", e => {
      if (e.layer === poligonos && !visible) { leyenda.addTo(map); visible = true; }
    });
    map.on("overlayremove", e => {
      if (e.layer === poligonos && visible) { leyenda.remove(); visible = false; }
    });
    map.attributionControl.addAttribution("Límites: " + procedencia + " (" + String(licencia).replace(/[<>]/g, "") + ")");
  } catch (error) {
    console.warn("No se pudo cargar la capa departamental. El mapa base permanece disponible.", error);
    aviso.textContent = "La capa de polígonos no pudo cargarse. El mapa y las fichas siguen disponibles. Detalle: " + error.message;
  }
})();
