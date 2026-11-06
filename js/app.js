// GeoPaleo: capas separadas para referencias ilustrativas y registros públicos verificados.
const map = L.map("map", { scrollWheelZoom: false }).setView([15.55, -90.35], 7);
const base = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const capaDemo = L.layerGroup().addTo(map);
const capaVerificada = L.layerGroup().addTo(map);
const capaHistorica = L.layerGroup().addTo(map);
const controlCapas = L.control.layers(null, {
  "Referencias ilustrativas": capaDemo,
  "Referencias históricas por departamento (orientativas)": capaHistorica,
  "Hallazgos públicos verificados": capaVerificada
}, { collapsed: true }).addTo(map);

let features = [];
const results = document.querySelector("#results");
const search = document.querySelector("#search");
const toggle = document.querySelector("#showMarkers");

function draw() {
  capaDemo.clearLayers();
  results.replaceChildren();
  const q = search.value.trim().toLocaleLowerCase("es");
  const visible = features.filter(f =>
    String(f.properties?.nombre || "").toLocaleLowerCase("es").includes(q));

  if (toggle.checked) {
    visible.forEach(f => {
      const punto = L.circleMarker(
        [f.geometry.coordinates[1], f.geometry.coordinates[0]],
        { radius: 9, color: "#fff", weight: 2, fillColor: "#c57b29", fillOpacity: 1 }
      ).addTo(capaDemo);
      const popup = document.createElement("div");
      const titulo = document.createElement("strong");
      titulo.textContent = f.properties.nombre;
      const descripcion = document.createElement("p");
      descripcion.textContent = f.properties.descripcion || "";
      const nota = document.createElement("small");
      nota.textContent = "Referencia ilustrativa: no identifica un yacimiento";
      popup.append(titulo, descripcion, nota);
      punto.bindPopup(popup);
      f._marker = punto;
    });
  }

  visible.forEach(f => {
    const boton = document.createElement("button");
    const titulo = document.createElement("strong");
    titulo.textContent = f.properties.nombre;
    const sub = document.createElement("small");
    sub.textContent = "Ubicación ilustrativa";
    boton.append(titulo, sub);
    boton.addEventListener("click", () => {
      const [lon, lat] = f.geometry.coordinates;
      map.setView([lat, lon], 9);
      if (map.hasLayer(capaDemo) && f._marker) f._marker.openPopup();
    });
    results.appendChild(boton);
  });
  if (!visible.length) results.textContent = "No se encontraron referencias.";
}

fetch("data/ejemplos.geojson")
  .then(r => { if (!r.ok) throw Error("No se pudo leer GeoJSON"); return r.json(); })
  .then(data => { features = Array.isArray(data.features) ? data.features : []; draw(); })
  .catch(error => {
    console.error(error);
    results.textContent = "No fue posible cargar los datos demostrativos.";
  });

// Capa preparada para el futuro: solo muestra registros explícitamente autorizados
// para publicación, con coordenadas públicas y precisión apta para difusión.
fetch("data/catalogo.json")
  .then(r => { if (!r.ok) throw Error("No se pudo leer el catálogo"); return r.json(); })
  .then(registros => {
    if (!Array.isArray(registros)) return;

    // Cabeceras departamentales: puntos de orientación, NO sitios paleontológicos.
    // Pendiente: sustituir esta vista por polígonos oficiales con licencia validada.
    const cabeceras = {
      "Guatemala": [14.6349, -90.5069],
      "Huehuetenango": [15.3197, -91.4708],
      "Jutiapa": [14.2917, -89.8958],
      "Zacapa": [14.9722, -89.5306],
      "Izabal": [15.7300, -88.6000],
      "Petén": [16.9300, -89.8900],
      "Baja Verapaz": [15.1000, -90.3200],
      "Sacatepéquez": [14.5600, -90.7300],
      "El Progreso": [14.8500, -90.0700],
      "Chiquimula": [14.8000, -89.5500],
      "Quetzaltenango": [14.8347, -91.5181]
    };
    const porDepartamento = new Map();
    registros.filter(r => ["referencia_historica", "identificacion_discutida", "sin_verificar"].includes(r.estadoVerificacion))
      .forEach(r => {
        const dep = r.ubicacion?.departamento;
        if (!dep) return;
        if (!porDepartamento.has(dep)) porDepartamento.set(dep, []);
        porDepartamento.get(dep).push(r);
      });
    const listado = document.querySelector("#atlas-localidades");
    if (listado) {
      const registrosHistoricos = registros.filter(r => ["referencia_historica", "identificacion_discutida", "sin_verificar"].includes(r.estadoVerificacion));
      const encabezado = document.createElement("div");
      encabezado.className = "atlas-listado-controles";
      const buscar = document.createElement("input");
      buscar.type = "search";
      buscar.placeholder = "Buscar localidad o departamento...";
      buscar.setAttribute("aria-label", "Buscar localidades históricas");
      const contador = document.createElement("small");
      const resultados = document.createElement("div");
      resultados.className = "atlas-listado-resultados";
      const limite = 8;
      let visibles = limite;
      function pintarLocalidades() {
        const termino = buscar.value.trim().toLocaleLowerCase("es");
        const coinciden = registrosHistoricos.filter(r => [r.titulo, r.ubicacion?.departamento, r.ubicacion?.municipio].some(v => String(v || "").toLocaleLowerCase("es").includes(termino)));
        contador.textContent = `${coinciden.length} localidades coincidentes`;
        resultados.replaceChildren();
        coinciden.slice(0, visibles).forEach(r => {
          const boton = document.createElement("button");
          boton.type = "button";
          boton.className = "atlas-localidad";
          const titulo = document.createElement("strong");
          titulo.textContent = r.titulo;
          const ubicacion = document.createElement("small");
          ubicacion.textContent = [r.ubicacion?.municipio, r.ubicacion?.departamento].filter(Boolean).join(", ") + " · Sin verificación independiente";
          boton.append(titulo, ubicacion);
          boton.addEventListener("click", () => {
            document.dispatchEvent(new CustomEvent("geopaleo:abrir-ficha", { detail: { id: r.id } }));
          });
          resultados.appendChild(boton);
        });
        if (coinciden.length > visibles) {
          const mas = document.createElement("button");
          mas.type = "button";
          mas.className = "atlas-mas-localidades";
          mas.textContent = "Ver más localidades";
          mas.addEventListener("click", () => { visibles += limite; pintarLocalidades(); });
          resultados.appendChild(mas);
        }
      }
      buscar.addEventListener("input", () => { visibles = limite; pintarLocalidades(); });
      encabezado.append(buscar, contador);
      listado.replaceChildren(encabezado, resultados);
      pintarLocalidades();
    }
    // Puntos de orientación aproximados en cabeceras departamentales, nunca en los sitios fósiles.
    porDepartamento.forEach((fichas, dep) => {
      if (!cabeceras[dep]) return;
      const punto = L.circleMarker(cabeceras[dep], {
        radius: 11, color: "#fff", weight: 2, fillColor: "#8555a4", fillOpacity: .9
      }).addTo(capaHistorica);
      const popup = document.createElement("div");
      const titulo = document.createElement("strong");
      titulo.textContent = dep + ": " + fichas.length + " referencia(s) histórica(s)";
      const nota = document.createElement("p");
      nota.textContent = "Marcador en cabecera departamental para orientación. NO representa un yacimiento ni las coordenadas de un fósil.";
      const lista = document.createElement("ul");
      lista.style.maxHeight = "160px";
      lista.style.overflowY = "auto";
      fichas.forEach(f => {
        const item = document.createElement("li");
        item.textContent = (f.ubicacion?.municipio || "Municipio no indicado") + ": " + f.titulo;
        lista.appendChild(item);
      });
      const enlace = document.createElement("a");
      enlace.href = "#catalogo";
      enlace.textContent = "Consultar fichas históricas";
      enlace.addEventListener("click", () => document.dispatchEvent(new CustomEvent("geopaleo:filtrar-departamento", { detail: { departamento: dep } })));
      popup.append(titulo, nota, lista, enlace);
      punto.bindPopup(popup, { maxWidth: 340 });
    });
    registros.forEach(registro => {
      const u = registro.ubicacion || {};
      const coords = u.coordenadasPublicas;
      if (registro.estadoVerificacion !== "verificado" ||
          u.publicacionAutorizada !== true ||
          !["generalizada", "aproximada"].includes(u.precision) ||
          !Array.isArray(coords) || coords.length !== 2) return;
      const [lon, lat] = coords.map(Number); // Formato GeoJSON: [longitud, latitud]
      if (!Number.isFinite(lon) || !Number.isFinite(lat) ||
          lon < -180 || lon > 180 || lat < -90 || lat > 90) return;
      const punto = L.circleMarker([lat, lon], {
        radius: 8, color: "#fff", weight: 2, fillColor: "#247d72", fillOpacity: 1
      }).addTo(capaVerificada);
      const popup = document.createElement("div");
      const titulo = document.createElement("strong");
      titulo.textContent = registro.titulo || "Registro verificado";
      const aviso = document.createElement("p");
      aviso.textContent = "Ubicación pública generalizada; no señala el sitio exacto.";
      const enlace = document.createElement("a");
      enlace.href = "#catalogo";
      enlace.textContent = "Consultar catálogo";
      popup.append(titulo, aviso, enlace);
      punto.bindPopup(popup);
    });
  })
  .catch(error => console.warn("Capa científica no disponible:", error));

search.addEventListener("input", draw);
toggle.addEventListener("change", () => {
  if (toggle.checked) { if (!map.hasLayer(capaDemo)) map.addLayer(capaDemo); }
  else map.removeLayer(capaDemo);
  draw();
});
map.on("overlayadd overlayremove", e => {
  if (e.layer === capaDemo) toggle.checked = map.hasLayer(capaDemo);
});
document.querySelector("#contactLink")?.addEventListener("click", e => e.preventDefault());
