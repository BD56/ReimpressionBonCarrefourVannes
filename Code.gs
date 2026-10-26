/* Réglages du magasin : éditeur Apps Script > Paramètres du projet > Propriétés du script.
     NOM_MAGASIN      ex. « Hypermarché Carrefour Vannes »
     ADRESSE_MAGASIN  ex. « 101 avenue de la Marne, 56000 Vannes »
   Lus à chaque ouverture : une modification s'applique sans redéployer.
   Tant qu'il en manque un, l'application ne sert qu'une page d'explication. */
function doGet() {
  var props = PropertiesService.getScriptProperties();
  var nom = (props.getProperty("NOM_MAGASIN") || "").trim();
  var adresse = (props.getProperty("ADRESSE_MAGASIN") || "").trim();
  if (!nom || !adresse) return pageNonConfiguree_();

  var page = HtmlService.createTemplateFromFile("index");
  // JSON lu par la page ; « < » échappé pour ne jamais fermer la balise <script>
  page.magasinJson = JSON.stringify({ nom: nom, adresse: adresse }).replace(/</g, "\\u003c");
  return page
    .evaluate()
    .setTitle("Réimpression Bon - " + nom)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function pageNonConfiguree_() {
  var html =
    '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    "<style>" +
    "body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f5f3f0;color:#1c1917;" +
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif}' +
    ".carte{max-width:520px;margin:24px;background:#fff;border:1px solid #e5dfd8;border-radius:16px;padding:26px 28px}" +
    "h1{margin:0 0 12px;font-size:20px}p,li{font-size:15px;line-height:1.55;color:#3a3430}" +
    "code{background:#f5f3f0;border:1px solid #e5dfd8;border-radius:6px;padding:1px 6px;font-size:14px}" +
    "</style></head><body><div class=\"carte\">" +
    "<h1>Magasin non configuré</h1>" +
    "<p>L'application doit connaître le nom et l'adresse du magasin avant de pouvoir imprimer des bons.</p>" +
    "<ol>" +
    "<li>Ouvrez le projet Apps Script, puis <b>Paramètres du projet</b> (roue dentée).</li>" +
    "<li>En bas, dans <b>Propriétés du script</b>, ajoutez <code>NOM_MAGASIN</code> et <code>ADRESSE_MAGASIN</code>.</li>" +
    "<li>Enregistrez, puis rechargez cette page.</li>" +
    "</ol>" +
    "<p>Le détail est dans la notice d'installation.</p>" +
    "</div></body></html>";
  return HtmlService.createHtmlOutput(html).setTitle("Magasin non configuré");
}
