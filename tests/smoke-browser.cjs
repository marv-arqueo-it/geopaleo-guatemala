const fs = require('node:fs');
const path = require('node:path');
const expectedCount = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/catalogo.json'), 'utf8')).length;
const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    let ready = false;
    for (let attempt = 0; attempt < 15; attempt++) {
      try {
        await page.goto('http://127.0.0.1:8765/', { waitUntil: 'domcontentloaded', timeout: 3000 });
        ready = true;
        break;
      } catch (error) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    assert.equal(ready, true, 'El servidor local no inició a tiempo');
    await page.waitForFunction(expected => document.querySelector('#catalogo-contador')?.textContent?.includes(`${expected} de ${expected} registros`), expectedCount, { timeout: 20000 });
    assert.equal(await page.locator('#catalogo-desplegable').evaluate(e => e.open), false, 'El catálogo debe iniciar plegado');
    await page.locator('#catalogo-desplegable summary').click();
    assert.equal(await page.locator('#catalogo-registros .catalogo-tarjeta').count(), 6, 'Debe haber seis fichas por página');
    await page.locator('#filtro-texto').fill('Chivacabé');
    await page.waitForTimeout(200);
    assert.match(await page.locator('#catalogo-contador').innerText(), new RegExp(`1 de ${expectedCount} registros`));
    await page.locator('#catalogo-registros .catalogo-tarjeta').first().click();
    assert.equal(await page.locator('#catalogo-modal').evaluate(e => e.open), true);
    await page.locator('#catalogo-cerrar').click();
    assert.equal(await page.locator('#catalogo-modal').evaluate(e => e.open), false);
    await page.locator('#filtro-limpiar').click();
    assert.match(await page.locator('#catalogo-contador').innerText(), new RegExp(`${expectedCount} de ${expectedCount} registros`));
    assert.equal(await page.locator('#map').count(), 1);
    assert.equal(await page.locator('#fauna .geo-educacion-grid article').count(), 4, 'Deben existir cuatro fichas educativas');
    await page.locator('#atlas-localidades input[type=search]').fill('chahal');
    assert.match(await page.locator('#atlas-localidades').innerText(), /Chahal/i);
    await page.locator('#atlas-localidades input[type=search]').fill('chivacabe');
    assert.match(await page.locator('#atlas-localidades').innerText(), /Chivacabé/i, 'Búsqueda sin acento');
    assert.deepEqual(errors, [], 'No debe haber errores JavaScript no controlados');
    console.log('OK: mapa, acordeón, paginación, búsqueda, ficha y limpieza de filtros');
    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await mobile.goto('http://127.0.0.1:8765/', { waitUntil: 'domcontentloaded' });
    await mobile.waitForFunction(expected => document.querySelector('#catalogo-contador')?.textContent?.includes(`${expected} de ${expected} registros`), expectedCount, { timeout: 20000 });
    assert.equal(await mobile.locator('#map').isVisible(), true);
    await mobile.locator('#catalogo-desplegable summary').click();
    assert.equal(await mobile.locator('#catalogo-registros .catalogo-tarjeta').count(), 6);
    assert.equal(await mobile.locator('#fauna .geo-educacion-grid article').count(), 4);
    const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert.ok(overflow <= 2, `Desbordamiento horizontal en móvil: ${overflow}px`);
    console.log('OK: smoke test móvil');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
