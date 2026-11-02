// Hito 1.3.7: polígonos departamentales orientativos de referencias históricas.
// Fuente de límites: geoBoundaries gbOpen ADM1, obtenida mediante su API pública.
// Los polígonos representan jurisdicciones administrativas, NO yacimientos.
(async function iniciarDistribucionDepartamental() {
  const contenedor = document.querySelector("#map");
  if (!contenedor || typeof map === "undefined" || typeof controlCapas === "undefined") return;

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
    const [respuestaCatalogo, respuestaMeta] = await Promise.all([
      fetch("data/catalogo.json"),
      fetch("https://www.geoboundaries.org/api/current/gbOpen/GTM/ADM1/")
    ]);
    if (!respuestaCatalogo.ok || !respuestaMeta.ok) throw new Error("No se pudieron consultar las fuentes.");
    const [registros, meta] = await Promise.all([respuestaCatalogo.json(), respuestaMeta.json()]);
    if (!Array.isArray(registros) || !/^https:\/\//.test(meta.gjDownloadURL || "")) {
      throw new Error("Fuentes con formato inesperado.");
    }
    const respuestaGeo = await fetch(meta.gjDownloadURL);
    if (!respuestaGeo.ok) throw new Error("No se pudieron descargar los límites.");
    const geojson = await respuestaGeo.json();
    if (geojson.type !== "FeatureCollection" || !Array.isArray(geojson.features)) {
      throw new Error("Límites geográficos inválidos.");
    }

    const conteos = new Map();
    registros.filter(r => r.estadoVerificacion === "referencia_historica").forEach(r => {
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
              if (opcion) { selector.value = opcion.value; selector.dispatchEvent(new Event("change")); }
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
    // No activar automáticamente: conservar el mapa existente y evitar superposición.
    let visible = false;
    map.on("overlayadd", e => {
      if (e.layer === poligonos && !visible) { leyenda.addTo(map); visible = true; }
    });
    map.on("overlayremove", e => {
      if (e.layer === poligonos && visible) { leyenda.remove(); visible = false; }
    });
    if (meta.boundaryLicense) {
      map.attributionControl.addAttribution(
        "Límites: geoBoundaries (" + String(meta.boundaryLicense).replace(/[<>]/g, "") + ")"
      );
    } else {
      map.attributionControl.addAttribution("Límites: geoBoundaries");
    }
  } catch (error) {
    console.warn("No se pudo cargar la capa departamental. El mapa base permanece disponible.", error);
  }
})();
