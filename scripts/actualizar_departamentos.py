#!/usr/bin/env python3
"""Descarga límites ADM1 de Guatemala desde geoBoundaries para servirlos localmente.
Ejecutar desde la raíz del repositorio: python scripts/actualizar_departamentos.py
No incluye ni infiere coordenadas de hallazgos paleontológicos.
"""
import json
from pathlib import Path
from urllib.request import Request, urlopen

API = "https://www.geoboundaries.org/api/current/gbOpen/GTM/ADM1/"
DESTINO = Path("data/guatemala-departamentos.geojson")

def descargar(url):
    with urlopen(Request(url, headers={"User-Agent": "GeoPaleo-Guatemala/1.0"}), timeout=40) as respuesta:
        return json.load(respuesta)

def main():
    metadata = descargar(API)
    url = metadata.get("gjDownloadURL")
    if not isinstance(url, str) or not url.startswith("https://"):
        raise ValueError("La API no proporcionó un enlace HTTPS GeoJSON válido")
    datos = descargar(url)
    if datos.get("type") != "FeatureCollection" or len(datos.get("features", [])) != 22:
        raise ValueError("Se esperaban los 22 departamentos de Guatemala; no se escribió ningún archivo")
    nombres = [f.get("properties", {}).get("shapeName") for f in datos["features"]]
    if any(not n for n in nombres):
        raise ValueError("Hay polígonos sin nombre de departamento")
    DESTINO.parent.mkdir(parents=True, exist_ok=True)
    DESTINO.write_text(json.dumps(datos, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print("Guardado:", DESTINO, "| departamentos:", len(nombres))
    print("Fuente: geoBoundaries gbOpen, Guatemala ADM1")
    print("Licencia declarada por la API:", metadata.get("boundaryLicense", "Consultar metadatos"))
    print("Revisar la licencia y hacer commit del GeoJSON para que GitHub Pages lo sirva localmente.")

if __name__ == "__main__":
    main()
