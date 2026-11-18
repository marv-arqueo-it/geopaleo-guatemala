#!/usr/bin/env python3
"""Importa límites departamentales de fuente fijada y verifica SHA-256 del archivo recibido."""
import hashlib
import json
from pathlib import Path
from urllib.request import Request, urlopen

URL = "https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/GTM/ADM1/geoBoundaries-GTM-ADM1.geojson"
SHA256 = "9dc5bbb390c2e57d32159bd4c87fa84179ca52187433f95378642c48cee74b21"
DEST = Path("data/guatemala-departamentos.geojson")
SOURCE = Path("data/guatemala-departamentos.fuente.json")
with urlopen(Request(URL, headers={"User-Agent": "GeoPaleo-Guatemala/1.0"}), timeout=90) as response:
    raw = response.read()
digest = hashlib.sha256(raw).hexdigest()
if digest != SHA256:
    raise SystemExit(f"El GeoJSON no coincide con el archivo validado: {digest}")
data = json.loads(raw)
features = data.get("features", [])
names = [f.get("properties", {}).get("shapeName") for f in features]
if data.get("type") != "FeatureCollection" or len(features) != 22 or len(set(names)) != 22 or any(not n for n in names):
    raise SystemExit("No se encontraron 22 departamentos únicos")
if any(f.get("geometry", {}).get("type") not in ("Polygon", "MultiPolygon") for f in features):
    raise SystemExit("Geometría departamental inesperada")
DEST.parent.mkdir(parents=True, exist_ok=True)
DEST.write_bytes(raw)
SOURCE.write_text(json.dumps({
    "api": "https://www.geoboundaries.org/api/current/gbOpen/GTM/ADM1/",
    "geojson_url": URL,
    "fuente": "OpenStreetMap, Wambacher",
    "licencia": "Open Data Commons Open Database License 1.0",
    "url_licencia": None,
    "anio_referencia": None,
    "sha256_geojson": SHA256,
    "nota": "Procedencia declarada en el archivo facilitado para GeoPaleo; revisar requisitos de atribución ODbL antes de publicación."
}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"OK: {len(features)} departamentos; SHA256 {digest}; {len(raw)} bytes")
