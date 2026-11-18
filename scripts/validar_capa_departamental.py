#!/usr/bin/env python3
"""Verifica capa ADM1 local sin dependencias de navegador ni librerías externas."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GEO = ROOT / "data/guatemala-departamentos.geojson"
META = ROOT / "data/guatemala-departamentos.fuente.json"

def main():
    if not META.exists():
        raise SystemExit("ERROR: faltan metadatos de procedencia.")
    meta = json.loads(META.read_text(encoding="utf-8"))
    if not all(meta.get(k) for k in ("fuente", "licencia", "sha256_geojson")):
        raise SystemExit("ERROR: metadatos incompletos.")
    if not GEO.exists():
        raise SystemExit("PENDIENTE: falta data/guatemala-departamentos.geojson en esta rama.")
    raw = GEO.read_bytes()
    actual = hashlib.sha256(raw).hexdigest()
    if actual != meta["sha256_geojson"]:
        raise SystemExit(f"ERROR: SHA-256 distinto del registrado: {actual}")
    data = json.loads(raw)
    features = data.get("features", [])
    if data.get("type") != "FeatureCollection" or len(features) != 22:
        raise SystemExit(f"ERROR: se esperaban 22 departamentos; encontrados {len(features)}")
    nombres = []
    for i, feature in enumerate(features, 1):
        name = (feature.get("properties") or {}).get("shapeName")
        geom = feature.get("geometry") or {}
        if not isinstance(name, str) or not name.strip():
            raise SystemExit(f"ERROR: departamento {i} sin shapeName")
        if geom.get("type") not in ("Polygon", "MultiPolygon") or not geom.get("coordinates"):
            raise SystemExit(f"ERROR: departamento {i} sin geometría válida")
        nombres.append(name.strip().casefold())
    if len(set(nombres)) != 22:
        raise SystemExit("ERROR: nombres departamentales duplicados")
    print(f"OK: 22 departamentos, SHA-256 {actual}; procedencia {meta['fuente']}")

if __name__ == "__main__":
    main()
