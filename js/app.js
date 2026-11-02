// GeoPaleo: capas separadas para referencias ilustrativas y registros públicos verificados.
const map = L.map("map", { scrollWheelZoom: false }).setView([15.55, -90.35], 7);
const base = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const capaDemo = L.layerGroup().addTo(map);
const capaVerificada = L.layerGroup().addTo(map);
L.control.layers(null, {
  "Referencias ilustrativas": capaDemo,
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
