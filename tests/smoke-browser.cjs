const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.goto('http://127.0.0.1:8765/', { waitUntil: 'domcontentloaded' });
    await page.locator('#catalogo-contador').getByText(/78 de 78 registros/).waitFor({ timeout: 20000 });
    assert.equal(await page.locator('#catalogo-desplegable').evaluate(e => e.open), false, 'El catálogo debe iniciar plegado');
    await page.locator('#catalogo-desplegable summary').click();
    assert.equal(await page.locator('#catalogo-registros .catalogo-tarjeta').count(), 6, 'Debe haber seis fichas por página');
    await page.locator('#filtro-texto').fill('Chivacabé');
    await page.waitForTimeout(200);
    assert.match(await page.locator('#catalogo-contador').innerText(), /1 de 78 registros/);
    await page.locator('#catalogo-registros .catalogo-tarjeta').first().click();
    assert.equal(await page.locator('#catalogo-modal').evaluate(e => e.open), true);
    await page.locator('#catalogo-cerrar').click();
    assert.equal(await page.locator('#catalogo-modal').evaluate(e => e.open), false);
    await page.locator('#filtro-limpiar').click();
    assert.match(await page.locator('#catalogo-contador').innerText(), /78 de 78 registros/);
    assert.equal(await page.locator('#map').count(), 1);
    assert.deepEqual(errors, [], 'No debe haber errores JavaScript no controlados');
    console.log('OK: mapa, acordeón, paginación, búsqueda, ficha y limpieza de filtros');
    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await mobile.goto('http://127.0.0.1:8765/', { waitUntil: 'domcontentloaded' });
    await mobile.locator('#catalogo-contador').getByText(/78 de 78 registros/).waitFor({ timeout: 20000 });
    assert.equal(await mobile.locator('#map').isVisible(), true);
    await mobile.locator('#catalogo-desplegable summary').click();
    assert.equal(await mobile.locator('#catalogo-registros .catalogo-tarjeta').count(), 6);
    console.log('OK: smoke test móvil');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
