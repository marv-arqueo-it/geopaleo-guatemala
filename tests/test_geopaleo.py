#!/usr/bin/env python3
"""Pruebas de regresión estáticas para GeoPaleo (sin dependencias externas)."""
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
APP = (ROOT / "js/app.js").read_text(encoding="utf-8")
CATALOGO = (ROOT / "js/catalogo.js").read_text(encoding="utf-8")
RECORDS = json.loads((ROOT / "data/catalogo.json").read_text(encoding="utf-8"))

class GeoPaleoTests(unittest.TestCase):
    def test_ids_unicos(self):
        ids = [r["id"] for r in RECORDS]
        self.assertEqual(len(ids), len(set(ids)), "No puede haber IDs duplicados")

    def test_fuentes_historicas(self):
        for r in RECORDS:
            with self.subTest(id=r["id"]):
                if r["estadoVerificacion"] in {"referencia_historica", "sin_verificar", "identificacion_discutida"}:
                    self.assertTrue(r["documentacion"]["referencias"])
                    self.assertTrue(r["ubicacion"]["departamento"])

    def test_no_coordenadas_publicas_sin_autorizacion(self):
        for r in RECORDS:
            with self.subTest(id=r["id"]):
                if r["estadoVerificacion"] != "demostrativo":
                    if r["ubicacion"].get("coordenadasPublicas"):
                        self.assertTrue(r["ubicacion"].get("publicacionAutorizada"))

    def test_contenedores_del_mapa_y_catalogo(self):
        for element_id in ["map", "atlas-localidades", "catalogo-desplegable",
                           "catalogo-registros", "catalogo-paginacion",
                           "catalogo-modal", "atlas-resumen", "filtro-departamento"]:
            with self.subTest(element_id=element_id):
                self.assertIn('id="' + element_id + '"', HTML)

    def test_scripts_incluidos(self):
        for script in ["js/app.js", "js/catalogo.js", "js/distribucion.js"]:
            with self.subTest(script=script):
                self.assertIn('src="' + script + '"', HTML)

    def test_eventos_de_navegacion(self):
        self.assertIn("geopaleo:abrir-ficha", APP)
        self.assertIn("geopaleo:abrir-ficha", CATALOGO)
        self.assertIn("geopaleo:filtrar-departamento", APP)
        self.assertIn("geopaleo:filtrar-departamento", CATALOGO)

    def test_catalogo_compacto(self):
        self.assertIn("<details", HTML)
        self.assertIn('id="catalogo-desplegable"', HTML)
        self.assertIn("const porPagina = 6", CATALOGO)
        self.assertIn("const limite = 8", APP)

    def test_no_yacimientos_orientativos_como_verificados(self):
        self.assertIn("NO representa un yacimiento", APP)
        self.assertEqual(sum(r["estadoVerificacion"] == "verificado" for r in RECORDS), 0)

if __name__ == "__main__":
    unittest.main(verbosity=2)
