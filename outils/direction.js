// Produit les PDF de la réunion avec la direction à partir de docs/direction/ :
// présentation (16:9), fiche d'une page et déroulé de la démo (A4).
// Usage : node outils/direction.js [dossier de sortie]   (défaut : dist/direction)
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");

const DOCUMENTS = [
  ["presentation.html", "Presentation - Reimpression de bons.pdf"],
  ["fiche.html", "Fiche - Reimpression de bons.pdf"],
  ["deroule.html", "Deroule de la demo.pdf"],
];

(async () => {
  const racine = path.join(__dirname, "..");
  const sortie = process.argv[2] || path.join(racine, "dist", "direction");
  fs.mkdirSync(sortie, { recursive: true });
  const navigateur = await chromium.launch();
  const page = await navigateur.newPage();
  for (const [source, pdf] of DOCUMENTS) {
    await page.goto("file://" + path.join(racine, "docs", "direction", source));
    await page.waitForLoadState("networkidle");
    await page.pdf({ path: path.join(sortie, pdf), preferCSSPageSize: true, printBackground: true });
    console.log(pdf);
  }
  await navigateur.close();
})();
