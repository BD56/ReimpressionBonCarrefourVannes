// Logique serveur (Code.gs, Installation.gs) dans une imitation minimale d'Apps Script.
// Usage : node tests/serveur.test.js
const fs = require('fs'), vm = require('vm'), assert = require('assert');
const R = require('path').join(__dirname, '..') + '/';
function store(init) { let d = Object.assign({}, init); return {
  getProperty: k => (k in d ? d[k] : null), setProperty: (k, v) => { d[k] = String(v); },
  setProperties: o => Object.keys(o).forEach(k => (d[k] = String(o[k]))), deleteAllProperties: () => { d = {}; },
  getProperties: () => Object.assign({}, d), _d: () => d }; }
function monde({ lie = true, scriptId = 'S1', doc = {}, script = {} } = {}) {
  const cache = {}; const feuilles = [{ name: 'Feuille 1', vide: true }]; let nomSS = 'Copie de MODÈLE — Réimpression de bons';
  const f = n => ({ getName: () => n.name, getLastRow: () => (n.vide ? 0 : 1), getLastColumn: () => (n.vide ? 0 : 1),
    setHiddenGridlines() {}, setColumnWidth() {}, setRowHeights() {}, setRowHeight() {}, clear() {},
    getRange() { const r = { setValue: () => r, setValues: () => r, setFontSize: () => r, setFontWeight: () => r, setWrap: () => r,
      setVerticalAlignment: () => r, merge: () => r, setFontColor: () => r }; return r; },
    getImages: () => (n.images || []).map(img => ({ remove: () => n.images.splice(n.images.indexOf(img), 1) })),
    insertImage() { const i = { setWidth: () => i, setHeight: () => i, setAltTextTitle: () => i, assignScript: s => { n.script = s; return i; } };
      (n.images = n.images || []).push(i); return i; } });
  const ss = { getName: () => nomSS, rename: n => (nomSS = n), getId: () => 'SS',
    getSheetByName: n => { const x = feuilles.find(y => y.name === n); return x ? Object.assign(f(x), { _n: x }) : null; },
    insertSheet: n => { const x = { name: n }; feuilles.unshift(x); return Object.assign(f(x), { _n: x }); },
    deleteSheet: s => { if (feuilles.length === 1) throw new Error("Vous ne pouvez pas supprimer toutes les feuilles d'un document."); return feuilles.splice(feuilles.indexOf(s._n || feuilles.find(y => y.name === s.getName())), 1); },
    getSheets: () => feuilles.map(x => Object.assign(f(x), { _n: x })), getNumSheets: () => feuilles.length,
    setActiveSheet() {}, moveActiveSheet() {}, toast() {} };
  let dialogue = null;
  const docP = lie ? store(doc) : null, scriptP = store(script);
  const ctx = {
    PropertiesService: { getDocumentProperties: () => docP, getScriptProperties: () => scriptP },
    ScriptApp: { getScriptId: () => scriptId },
    CacheService: { getScriptCache: () => ({ get: k => cache[k] || null, put: (k, v) => (cache[k] = v), remove: k => delete cache[k] }) },
    Utilities: { getUuid: () => 'jeton-' + Math.random(), newBlob: () => ({}), base64Decode: () => [] },
    SpreadsheetApp: { getActiveSpreadsheet: () => ss, getUi: () => ({ showModalDialog: h => (dialogue = h),
      createMenu: () => ({ addItem() { return this; }, addToUi() {} }) }) },
    HtmlService: { XFrameOptionsMode: { ALLOWALL: 1 },
      createTemplateFromFile: n => { const t = { evaluate: () => ({ setTitle: x => ({ setXFrameOptionsMode: () => ({ type: 'page', fichier: n, t, titre: x }), setWidth: () => ({ setHeight: () => t }) }), setWidth: () => ({ setHeight: () => t }) }) }; return t; },
      createHtmlOutput: h => ({ setTitle: x => ({ type: 'non-configure', titre: x }) }) },
    Logger: { log() {} },
  };
  vm.createContext(ctx);
  ['Code.gs', 'Installation.gs'].forEach(n => vm.runInContext(fs.readFileSync(R + n, 'utf8'), ctx, { filename: n }));
  return { ctx, docP, scriptP, ss, feuilles, jeton: () => dialogue && dialogue.jeton };
}
const ok = m => console.log('✓ ' + m);

// 1. Copie neuve du modèle : non configurée
let w = monde();
assert.equal(w.ctx.doGet().type, 'non-configure'); ok('copie neuve : « Magasin non configuré »');
// 2. Jeton obligatoire
assert.throws(() => w.ctx.enregistrerMagasin('faux', { nom: 'A', adresse: 'B' }), /Fenêtre expirée/); ok('sans jeton : refusé');
w.ctx.ouvrirAssistant(); const j = w.jeton(); assert.ok(j);
assert.throws(() => w.ctx.enregistrerMagasin(j, { nom: ' ', adresse: 'B' }), /nom du magasin/); ok('nom vide : refusé');
w.ctx.enregistrerMagasin(j, { nom: ' Hypermarché Carrefour Lorient ', adresse: '1 rue X, 56100 Lorient' });
assert.equal(w.docP.getProperty('ID_SCRIPT'), 'S1'); assert.match(w.ss.getName(), /^Réimpression de bons — Hypermarché Carrefour Lorient$/); ok('magasin enregistré, classeur renommé');
let page = w.ctx.doGet(); assert.equal(page.type, 'page'); assert.equal(page.titre, 'Réimpression Bon - Hypermarché Carrefour Lorient');
assert.deepEqual(JSON.parse(page.t.magasinJson), { nom: 'Hypermarché Carrefour Lorient', adresse: '1 rue X, 56100 Lorient' }); ok('doGet sert la page avec le magasin');
// 3. Adresse
assert.throws(() => w.ctx.enregistrerAdresseApplication(j, 'https://exemple.fr'), /finit par \/exec/);
w.ctx.enregistrerAdresseApplication(j, 'https://script.google.com/macros/s/AKfyc_x-1/exec');
assert.equal(w.ctx.etatAssistant(j).adresseApp, 'https://script.google.com/macros/s/AKfyc_x-1/exec'); ok('adresse /exec validée et relue');
// 4. Fin : Démarrer retiré, Application présent, jeton invalidé
w.ctx.creerOngletDemarrer_();
w.ctx.terminerAssistant(j);
assert.deepEqual(w.feuilles.map(x => x.name), ['Application']); ok('fin : seul l\'onglet « Application » reste');
assert.throws(() => w.ctx.etatAssistant(j), /Fenêtre expirée/); ok('fin : jeton invalidé');
// 5. preparerModele refusé sur une installation
assert.throws(() => w.ctx.preparerModele(), /installation en service/); ok('preparerModele refusé sur une installation');
// 6. Copie d'un magasin installé : propriétés héritées mais autre script -> non configurée, puis repart vierge
const copie = monde({ scriptId: 'S2', doc: w.docP.getProperties() });
assert.equal(copie.ctx.doGet().type, 'non-configure'); ok('copie d\'une installation : n\'hérite pas du magasin');
copie.ctx.ouvrirAssistant(); const e = copie.ctx.etatAssistant(copie.jeton());
assert.equal(e.nom, ''); assert.equal(e.adresseApp, ''); ok('copie : assistant vierge (ni nom ni adresse héritée)');
copie.ctx.enregistrerMagasin(copie.jeton(), { nom: 'Vannes 2', adresse: 'Ici' });
assert.equal(copie.docP.getProperty('ADRESSE_APP'), null); ok('copie : adresse /exec héritée effacée');
// 7. Modèle vierge : preparerModele
const modele = monde({ scriptId: 'M' });
modele.ctx.preparerModele();
assert.deepEqual(modele.feuilles.map(x => x.name), ['Démarrer']); assert.equal(modele.feuilles[0].script, 'ouvrirAssistant'); ok('modèle : onglet « Démarrer » + bouton relié à ouvrirAssistant');
// 7 bis. Modèle repréparé (après une mise à jour) : « Démarrer » est son seul onglet
modele.ctx.preparerModele();
assert.deepEqual(modele.feuilles.map(x => x.name), ['Démarrer']); assert.equal(modele.feuilles[0].images.length, 1); ok('modèle repréparé : « Démarrer » réutilisé, un seul bouton');
// 8. Vannes : projet autonome, propriétés du script
const vannes = monde({ lie: false, script: { NOM_MAGASIN: 'Hypermarché Carrefour Vannes', ADRESSE_MAGASIN: '101 avenue de la Marne, 56000 Vannes' } });
assert.equal(vannes.ctx.doGet().titre, 'Réimpression Bon - Hypermarché Carrefour Vannes'); ok('Vannes (projet autonome) : propriétés du script');
assert.equal(monde({ lie: false }).ctx.doGet().type, 'non-configure'); ok('projet autonome sans propriétés : non configuré');
assert.throws(() => vannes.ctx.preparerModele(), /rattaché au Google Sheets/); ok('preparerModele refusé sur le projet autonome');
// 9. Échappement
const x = monde(); x.ctx.ouvrirAssistant(); x.ctx.enregistrerMagasin(x.jeton(), { nom: 'A</script><b>', adresse: 'B' });
assert.ok(!x.ctx.doGet().t.magasinJson.includes('<')); ok('« < » échappé dans le JSON injecté');
// 10. onOpen ne plante pas
monde().ctx.onOpen(); w.ctx.onOpen(); ok('onOpen');
console.log('Tous les cas passent.');
