#!/usr/bin/env python3
"""Descarga ADM1 de geoBoundaries, valida geometrías y registra integridad/procedencia."""
import hashlib
import json
from pathlib import Path
from urllib.request import Request, urlopen

API = "https://www.geoboundaries.org/api/current/gbOpen/GTM/ADM1/"
DEST = Path("data/guatemala-departamentos.geojson")
SOURCE = Path("data/guatemala-departamentos.fuente.json")

def leer(url):
    with urlopen(Request(url, headers={"User-Agent": "GeoPaleo-Guatemala/1.0"}), timeout=90) as response:
        return response.read()

def validar(datos):
    if datos.get("type") != "FeatureCollection":
        raise ValueError("No es una colección GeoJSON")
    features = datos.get("features", [])
    if len(features) != 22:
        raise ValueError(f"Se esperaban 22 departamentos, recibidos {len(features)}")
    nombres = []
    for f in features:
        nombre = (f.get("properties") or {}).get("shapeName")
        geom = f.get("geometry") or {}
        if not isinstance(nombre, str) or not nombre.strip():
            raise ValueError("Departamento sin nombre")
        if geom.get("type") not in ("Polygon", "MultiPolygon") or not geom.get("coordinates"):
            raise ValueError("Departamento sin polígono")
        nombres.append(nombre.strip().casefold())
    if len(set(nombres)) != 22:
        raise ValueError("Nombres departamentales duplicados")

def main():
    metadata = json.loads(leer(API))
    if metadata.get("boundaryISO") != "GTM" or metadata.get("boundaryType") != "ADM1":
        raise SystemExit("La API devolvió una frontera inesperada")
    url = metadata.get("gjDownloadURL")
    if not isinstance(url, str) or not url.startswith("https://"):
        raise SystemExit("URL GeoJSON no válida")
    raw = leer(url)
    if raw.startswith(b"version https://git-lfs.github.com/spec/v1"):
        raise SystemExit("La descarga devolvió un puntero Git LFS en vez de geometrías")
    datos = json.loads(raw)
    validar(datos)
    digest = hashlib.sha256(raw).hexdigest()
    licencia = metadata.get("boundaryLicense")
    if not licencia:
        raise SystemExit("La API no indicó licencia; revisión humana requerida")
    fuente = {
        "api": API,
        "geojson_url": url,
        "fuente": metadata.get("boundarySource"),
        "licencia": licencia,
        "url_licencia": metadata.get("licenseSource"),
        "anio_referencia": metadata.get("boundaryYearRepresented"),
        "sha256_geojson": digest,
        "nota": "Límites administrativos ADM1. No representan coordenadas de fósiles. Respetar atribución y condiciones ODbL."
    }
    DEST.parent.mkdir(parents=True, exist_ok=True)
    DEST.write_bytes(raw)
    SOURCE.write_text(json.dumps(fuente, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"OK: 22 departamentos; {len(raw)} bytes; SHA-256 {digest}; fuente {fuente['fuente']}")

if __name__ == "__main__":
    main()
