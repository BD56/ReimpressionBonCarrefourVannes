/** @OnlyCurrentDoc */
// (n'accède qu'au Google Sheets qui porte l'application : autorisations minimales)

/* Magasin (nom, adresse) :
   - installation par l'assistant (projet rattaché au Google Sheets) : propriétés du
     document, posées par l'assistant et marquées avec l'identifiant du script. Une copie
     du classeur a un autre identifiant : elle n'hérite donc jamais du magasin d'un autre.
   - projet autonome (installation historique de Vannes) : propriétés du script
     NOM_MAGASIN et ADRESSE_MAGASIN, réglées dans l'éditeur (Paramètres du projet).
   Lus à chaque ouverture : une modification s'applique sans redéployer. */
function lireMagasin_() {
  var doc = PropertiesService.getDocumentProperties();
  var props = doc || PropertiesService.getScriptProperties();
  if (doc && doc.getProperty("ID_SCRIPT") !== ScriptApp.getScriptId()) return null;
  var nom = (props.getProperty("NOM_MAGASIN") || "").trim();
  var adresse = (props.getProperty("ADRESSE_MAGASIN") || "").trim();
  return nom && adresse ? { nom: nom, adresse: adresse } : null;
}

function doGet() {
  var magasin = lireMagasin_();
  if (!magasin) return pageNonConfiguree_();

  var page = HtmlService.createTemplateFromFile("index");
  // JSON lu par la page ; « < » échappé pour ne jamais fermer la balise <script>
  page.magasinJson = JSON.stringify(magasin).replace(/</g, "\\u003c");
  return page
    .evaluate()
    .setTitle("Réimpression Bon - " + magasin.nom)
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
    "h1{margin:0 0 12px;font-size:20px}p{font-size:15px;line-height:1.55;color:#3a3430;margin:0 0 10px}" +
    "</style></head><body><div class=\"carte\">" +
    "<h1>Magasin non configuré</h1>" +
    "<p>L'application doit connaître le nom et l'adresse du magasin avant de pouvoir imprimer des bons.</p>" +
    "<p>Ouvrez le Google Sheets de l'application et suivez l'assistant : bouton vert " +
    "« Installer l'application », ou menu 🚀 APPLICATION → Assistant d'installation.</p>" +
    "</div></body></html>";
  return HtmlService.createHtmlOutput(html).setTitle("Magasin non configuré");
}

// Menu du Google Sheets ; sur une copie pas encore installée, un rappel.
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🚀 APPLICATION")
    .addItem("▶ Assistant d'installation", "ouvrirAssistant")
    .addToUi();
  var installe = true;
  try {
    installe = !!lireMagasin_();
  } catch (e) {}
  if (!installe) {
    try {
      SpreadsheetApp.getActiveSpreadsheet().toast(
        "Onglet « Démarrer » : bouton vert « Installer l'application ».",
        "Installation",
        20
      );
    } catch (e) {}
  }
}
