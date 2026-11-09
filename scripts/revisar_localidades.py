#!/usr/bin/env python3
"""Detecta candidatos a duplicación editorial, sin fusionar registros automáticamente."""
import json
import re
import unicodedata
from collections import defaultdict
from pathlib import Path

catalog = json.loads((Path(__file__).resolve().parents[1] / "data/catalogo.json").read_text(encoding="utf-8"))
def norm(s):
    s = unicodedata.normalize("NFD", str(s or "").lower())
    return re.sub(r"[^a-z0-9]+", " ", "".join(c for c in s if not unicodedata.combining(c))).strip()
groups = defaultdict(list)
for r in catalog:
    if r.get("estadoVerificacion") == "demostrativo":
        continue
    u = r.get("ubicacion") or {}
    key = (norm(u.get("departamento")), norm(u.get("municipio")))
    groups[key].append(r)
print("ATENCIÓN: referencias agrupadas por municipio; no equivalen a sitios duplicados.")
for (dep, mun), items in sorted(groups.items(), key=lambda item: -len(item[1])):
    if len(items) < 2:
        continue
    print(f"\n{dep or '?'} / {mun or '?'} — {len(items)} referencias")
    for r in items:
        print("  ", r["id"], r["titulo"])
print("\nLa decisión de fusionar o separar requiere cotejo de fuente, colección, espécimen, campaña y localidad.")
