#!/usr/bin/env python3
"""Auditoría reproducible del catálogo público; Python 3, sin dependencias."""
import json
from collections import Counter
from pathlib import Path

root = Path(__file__).resolve().parents[1]
records = json.loads((root / "data/catalogo.json").read_text(encoding="utf-8"))
errors, warnings = [], []
ids = set()
allowed = {"demostrativo", "referencia_historica", "sin_verificar", "identificacion_discutida", "verificado"}
for n, r in enumerate(records, 1):
    key = r.get("id")
    if not key or key in ids:
        errors.append(f"Fila {n}: identificador ausente o repetido: {key}")
    ids.add(key)
    if not r.get("titulo") or not r.get("descripcion"):
        errors.append(f"{key}: falta título o descripción")
    if r.get("estadoVerificacion") not in allowed:
        errors.append(f"{key}: estado desconocido")
    loc = r.get("ubicacion") or {}
    if r.get("estadoVerificacion") != "demostrativo" and loc.get("coordenadasPublicas"):
        if not loc.get("publicacionAutorizada"):
            errors.append(f"{key}: coordenadas públicas sin autorización")
    if r.get("estadoVerificacion") in {"referencia_historica", "sin_verificar", "identificacion_discutida"}:
        if not loc.get("departamento"):
            warnings.append(f"{key}: sin departamento")
        if not (r.get("documentacion") or {}).get("referencias"):
            errors.append(f"{key}: referencia bibliográfica ausente")
        if r.get("estadoVerificacion") == "verificado":
            errors.append(f"{key}: estado contradictorio")
    if r.get("estadoVerificacion") == "verificado" and not loc.get("publicacionAutorizada"):
        warnings.append(f"{key}: verificado sin autorización de publicación")
print(f"Total: {len(records)} | estados: {dict(Counter(r.get('estadoVerificacion') for r in records))}")
print(f"Departamentos: {len(set((r.get('ubicacion') or {}).get('departamento') for r in records if (r.get('ubicacion') or {}).get('departamento')))}")
for warning in warnings:
    print("ADVERTENCIA:", warning)
for error in errors:
    print("ERROR:", error)
if errors:
    raise SystemExit(1)
print("OK: validación estructural superada; no sustituye revisión científica.")
