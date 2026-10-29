// Fabrique la démo autonome de l'application (un seul fichier HTML, sans internet ni
// compte Google), pour la présenter : bons d'exemple, encart « Démonstration », filigrane
// « DÉMONSTRATION » sur chaque bon (écran et impression), codes EAN fictifs.
// Usage : node outils/demo.js [JsBarcode.all.min.js] [sortie.html]
//   sans le 1er argument, la bibliothèque des codes-barres est téléchargée (jsdelivr).
const fs = require("fs");
const path = require("path");

const URL_JSBARCODE = "https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js";
const MAGASIN = { nom: "Hypermarché Carrefour Vannes", adresse: "101 avenue de la Marne, 56000 Vannes" };

const CSS = `
  <style>
    /* ===== Démonstration ===== */
    .bon-container::after {
      content: "DÉMONSTRATION"; position: absolute; inset: 0; z-index: 5; pointer-events: none;
      display: grid; place-items: center; transform: rotate(-22deg);
      font: 900 30px/1 "Inter", "Segoe UI", Arial, sans-serif; letter-spacing: 4px;
      color: rgba(200, 30, 30, .22);
    }
    .bon-container.layout-vertical::after { font-size: 19px; letter-spacing: 2px; transform: rotate(-60deg); }
    .demo-carte {
      position: fixed; left: 20px; bottom: 20px; z-index: 30;
      max-width: calc(100vw - var(--panneau-w) - 40px);
      background: #2b2724; color: #f2efeb; border-radius: 14px; padding: 12px 14px;
      box-shadow: 0 12px 30px rgba(28,25,23,.3); font-size: 13px;
    }
    .demo-carte b { font-size: 14px; }
    .demo-carte .doux { opacity: .75; margin-left: 6px; }
    .demo-essais { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
    .demo-essais button {
      background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2); color: #f2efeb;
      border-radius: 8px; padding: 6px 10px; font-size: 12.5px; cursor: pointer;
    }
    .demo-essais button:hover { background: rgba(255,255,255,.2); }
    @media print {
      .demo-carte { display: none !important; }
      .bon-container::after { color: rgba(0, 0, 0, .28); }
    }
  </style>
`;

const HTML = `
  <div class="demo-carte" role="region" aria-label="Démonstration">
    <b>Démonstration</b><span class="doux">données fictives · rien n'est enregistré · bons sans valeur</span>
    <div class="demo-essais">
      <button type="button" data-essai="design">Changer de design</button>
      <button type="button" data-essai="format">Changer de format</button>
      <button type="button" data-essai="lot">Ajouter 6 bons</button>
      <button type="button" data-essai="incomplet">Bon incomplet</button>
      <button type="button" data-essai="imprimer">Aperçu d'impression</button>
      <button type="button" data-essai="depart">Revenir au départ</button>
    </div>
  </div>
  <script>
    /* Démonstration : s'appuie sur les fonctions de la page (addBons, setDesign…). */
    (function () {
      // EAN-13 fictifs (clé valide, aucun lien avec un vrai bon)
      const EXEMPLES = [['10', '1234567890128'], ['15', '1111111111116'], ['25', '9999999999994'],
                        ['5', '4444444444444'], ['20', '7777777777772'], ['50', '3333333333338']];
      function finDans(jours) {
        const d = new Date(); d.setDate(d.getDate() + jours);
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      }
      function remplir(wrap, montant, ean) {
        const c = wrap.querySelector('.bon-container');
        const m = c.querySelector('.montant-input');
        m.value = montant; m.dispatchEvent(new Event('blur'));
        const f = c.querySelector('.date-fin');
        f.value = finDans(30); f.dispatchEvent(new Event('input'));
        if (ean) { const e = c.querySelector('.ean-input'); e.value = ean; e.dispatchEvent(new Event('input')); }
      }
      function lot(n, depuis) {
        addBons(n);
        allWraps().slice(-n).forEach((w, i) => { const x = EXEMPLES[(depuis + i) % EXEMPLES.length]; remplir(w, x[0], x[1]); });
      }
      // Départ : Design 2, horizontal, 3 bons complets
      function depart() { bonsList.innerHTML = ''; lot(3, 0); setDesign('2'); setLayout('horizontal'); window.scrollTo(0, 0); }
      const essais = {
        design: () => setDesign(currentDesign === '1' ? '2' : '1'),
        format: () => setLayout(currentLayout === 'horizontal' ? 'vertical' : 'horizontal'),
        lot: () => lot(6, 3),
        incomplet: () => { addBons(1); const w = allWraps().pop(); remplir(w, '30', ''); w.scrollIntoView({ block: 'center' }); },
        imprimer: () => window.print(),
        depart: depart,
      };
      document.querySelectorAll('[data-essai]').forEach(b => b.addEventListener('click', () => essais[b.dataset.essai]()));
      depart();
    })();
  </script>
`;

async function main() {
  const racine = path.join(__dirname, "..");
  const [source, sortie] = process.argv.slice(2);
  const jsbarcode = source
    ? fs.readFileSync(source, "utf8")
    : await (await fetch(URL_JSBARCODE)).text();
  if (!/JsBarcode/.test(jsbarcode)) throw new Error("bibliothèque JsBarcode introuvable");
  if (/<\/script/i.test(jsbarcode)) throw new Error("JsBarcode contient </script> : intégration impossible");

  let page = fs.readFileSync(path.join(racine, "index.html"), "utf8");
  const remplacer = (avant, apres) => {
    if (page.split(avant).length !== 2) throw new Error("repère introuvable ou multiple : " + avant);
    page = page.replace(avant, () => apres);
  };
  remplacer(`<script src="${URL_JSBARCODE}"></script>`, "<script>" + jsbarcode + "</script>");
  remplacer("<?!= magasinJson ?>", JSON.stringify(MAGASIN).replace(/</g, "\\u003c"));
  remplacer("<title>Réimpression de bon</title>", "<title>Réimpression de bon — démonstration</title>");
  remplacer("</head>", CSS + "</head>");
  remplacer("</body>", HTML + "</body>");

  const fichier = sortie || path.join(racine, "dist", "demo-reimpression-bons.html");
  fs.mkdirSync(path.dirname(fichier), { recursive: true });
  fs.writeFileSync(fichier, page);
  console.log("Démo : " + fichier + " (" + Math.round(page.length / 1024) + " Ko)");
}
main().catch(e => { console.error(e.message); process.exit(1); });
