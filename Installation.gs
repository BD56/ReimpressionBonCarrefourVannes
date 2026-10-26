// Installation par magasin : le magasin copie le Google Sheets MODÈLE (lien /copy), clique
// sur le bouton vert de l'onglet « Démarrer », et l'assistant le guide en 3 écrans
// (son magasin, mise en ligne, les postes). Ce que Google impose reste manuel (écran
// d'autorisation, clics de « Déployer ») : l'assistant le guide.

var NOM_APPLICATION = "Réimpression de bons";
var FEUILLE_DEMARRER = "Démarrer";
var FEUILLE_APPLICATION = "Application";
// Nom donné par Google à une copie du modèle : renommée d'après le magasin.
var NOM_COPIE_GOOGLE = /MODÈLE/;
// Adresse d'une application Web déployée (compte ordinaire ou Google Workspace), jamais /dev.
var RE_ADRESSE_APP = /^https:\/\/script\.google\.com\/(a\/macros\/[^/\s]+\/s|macros\/s)\/[\w-]+\/exec$/;

// =================================================================
// --- JETON DE L'ASSISTANT ---
//     L'application Web est ouverte à tous et toute page Apps Script peut appeler les
//     fonctions publiques du serveur. Celles de l'assistant exigent donc un jeton, créé à
//     l'ouverture de la fenêtre depuis le Google Sheets et inscrit dans cette seule fenêtre :
//     un visiteur de l'application ne peut ni le lire ni changer le magasin.
// =================================================================
var CLE_JETON = "JETON_ASSISTANT";

function exigerJeton_(jeton) {
  var attendu = CacheService.getScriptCache().get(CLE_JETON);
  if (!attendu || jeton !== attendu)
    throw new Error("Fenêtre expirée : fermez-la et relancez l'assistant depuis le Google Sheets.");
}

// Bouton vert de l'onglet « Démarrer », ou menu 🚀 APPLICATION.
function ouvrirAssistant() {
  var jeton = Utilities.getUuid();
  CacheService.getScriptCache().put(CLE_JETON, jeton, 21600); // 6 h, le maximum
  var fenetre = HtmlService.createTemplateFromFile("Assistant");
  fenetre.jeton = jeton;
  SpreadsheetApp.getUi().showModalDialog(
    fenetre.evaluate().setWidth(640).setHeight(720),
    "▶ Installation de l'application"
  );
}

// =================================================================
// --- ÉCRANS DE LA FENÊTRE (google.script.run) ---
// =================================================================
// État au moment d'ouvrir : magasin déjà réglé (relance de l'assistant) et adresse notée.
function etatAssistant(jeton) {
  exigerJeton_(jeton);
  var props = PropertiesService.getDocumentProperties();
  var installe = props.getProperty("ID_SCRIPT") === ScriptApp.getScriptId();
  return {
    nom: installe ? props.getProperty("NOM_MAGASIN") || "" : "",
    adresse: installe ? props.getProperty("ADRESSE_MAGASIN") || "" : "",
    adresseApp: installe ? adresseApplication_() : "",
    lienEditeur: "https://script.google.com/d/" + ScriptApp.getScriptId() + "/edit",
  };
}

// 1. Votre magasin. Une copie repart vierge : tout ce qu'elle aurait hérité est effacé
//    avant d'enregistrer, puis la marque (identifiant du script) est posée.
function enregistrerMagasin(jeton, m) {
  exigerJeton_(jeton);
  m = m || {};
  var nom = String(m.nom || "").trim();
  var adresse = String(m.adresse || "").trim();
  if (!nom) throw new Error("Écrivez le nom du magasin.");
  if (!adresse) throw new Error("Écrivez l'adresse du magasin.");
  if (nom.length > 80 || adresse.length > 120) throw new Error("Texte trop long pour tenir sur le bon.");

  var props = PropertiesService.getDocumentProperties();
  var id = ScriptApp.getScriptId();
  if (props.getProperty("ID_SCRIPT") !== id) props.deleteAllProperties();
  props.setProperties({ ID_SCRIPT: id, NOM_MAGASIN: nom, ADRESSE_MAGASIN: adresse });
  renommerCopie_(nom);
  majOngletApplication_();
  return { nom: nom, adresse: adresse };
}

// « Copie de MODÈLE — … » devient « Réimpression de bons — <magasin> ». Un refus de Google
// n'arrête pas l'assistant.
function renommerCopie_(nom) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (NOM_COPIE_GOOGLE.test(ss.getName())) ss.rename(NOM_APPLICATION + " — " + nom);
  } catch (e) {}
}

// 2. Mise en ligne : adresse /exec collée par le manager (bouton « Copier » de Google).
function enregistrerAdresseApplication(jeton, url) {
  exigerJeton_(jeton);
  url = String(url || "").trim();
  if (!RE_ADRESSE_APP.test(url))
    throw new Error(
      "Ce n'est pas l'adresse de l'application : elle commence par https://script.google.com/ et finit par /exec."
    );
  PropertiesService.getDocumentProperties().setProperty("ADRESSE_APP", url);
  majOngletApplication_();
  return url;
}

function adresseApplication_() {
  var url = PropertiesService.getDocumentProperties().getProperty("ADRESSE_APP") || "";
  return RE_ADRESSE_APP.test(url) ? url : "";
}

// Fin : l'onglet « Démarrer » laisse la place à l'onglet « Application » (récapitulatif).
function terminerAssistant(jeton) {
  exigerJeton_(jeton);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var appli = majOngletApplication_();
  var demarrer = ss.getSheetByName(FEUILLE_DEMARRER);
  if (demarrer && ss.getNumSheets() > 1) ss.deleteSheet(demarrer);
  supprimerFeuillesVides_();
  ss.setActiveSheet(appli);
  CacheService.getScriptCache().remove(CLE_JETON);
  return true;
}

// =================================================================
// --- ONGLETS ---
// =================================================================
// « Application » : le magasin et le lien, pour les retrouver plus tard.
function majOngletApplication_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var f = ss.getSheetByName(FEUILLE_APPLICATION) || ss.insertSheet(FEUILLE_APPLICATION, 0);
  var props = PropertiesService.getDocumentProperties();
  var url = adresseApplication_();
  f.clear();
  f.setHiddenGridlines(true);
  f.setColumnWidth(1, 30);
  f.setColumnWidth(2, 190);
  f.setColumnWidth(3, 520);
  f.getRange("B2").setValue(NOM_APPLICATION).setFontSize(18).setFontWeight("bold");
  f.getRange("B4:C6").setValues([
    ["Magasin", props.getProperty("NOM_MAGASIN") || ""],
    ["Adresse sur les bons", props.getProperty("ADRESSE_MAGASIN") || ""],
    ["Lien de l'application", url || "(pas encore mis en ligne)"],
  ]);
  f.getRange("B4:B6").setFontWeight("bold");
  f.getRange("B4:C6").setFontSize(11).setVerticalAlignment("middle");
  f.setRowHeights(4, 3, 28);
  f.getRange("B8:C8")
    .merge()
    .setValue(
      "Le lien s'ouvre sur chaque poste qui imprime des bons (à mettre en favori), sans compte Google. " +
        "Pour changer le nom ou l'adresse : menu 🚀 APPLICATION → Assistant d'installation."
    )
    .setFontSize(10)
    .setFontColor("#6f6863")
    .setWrap(true);
  f.setRowHeight(8, 36);
  return f;
}

// « Démarrer » (modèle) : quelques lignes et une image-bouton reliée à ouvrirAssistant. La
// voir ne demande aucune autorisation ; c'est le clic qui en demande une.
function creerOngletDemarrer_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ancien = ss.getSheetByName(FEUILLE_DEMARRER);
  if (ancien) ss.deleteSheet(ancien);
  var f = ss.insertSheet(FEUILLE_DEMARRER, 0);
  f.setHiddenGridlines(true);
  f.setColumnWidth(1, 30);
  f.setColumnWidth(2, 640);
  var lignes = [
    [2, "Bienvenue", 20, "bold"],
    [
      3,
      "Cette copie est la vôtre. Pour mettre l'application en service, cliquez sur le bouton vert " +
        "et laissez-vous guider (environ 10 minutes).",
      11,
      "normal",
    ],
    [9, "Au premier clic, Google demande votre autorisation.", 11, "bold"],
    [
      10,
      "Il affiche « Google n'a pas validé cette application » : c'est normal. Cliquez sur « Paramètres " +
        "avancés », puis sur « Accéder… », et cochez « Tout sélectionner ».",
      11,
      "normal",
    ],
    [
      11,
      "Si rien ne s'ouvre ensuite, cliquez une seconde fois sur le bouton vert.",
      11,
      "normal",
    ],
    [13, "Le même assistant se trouve dans le menu 🚀 APPLICATION → Assistant d'installation.", 10, "normal"],
  ];
  lignes.forEach(function (l) {
    f.getRange(l[0], 2).setValue(l[1]).setFontSize(l[2]).setFontWeight(l[3]).setWrap(true);
  });
  f.setRowHeights(5, 3, 30); // place du bouton (lignes 5 à 7)
  var image = f.insertImage(
    Utilities.newBlob(Utilities.base64Decode(BOUTON_INSTALLER_PNG), "image/png", "installer.png"),
    2,
    5
  );
  image.setWidth(320).setHeight(64);
  image.setAltTextTitle("Installer l'application");
  image.assignScript("ouvrirAssistant");
  ss.setActiveSheet(f);
  ss.moveActiveSheet(1);
  return f;
}

// Onglet vide créé d'office par Google (« Feuille 1 », « Sheet1 »…) : retiré.
function supprimerFeuillesVides_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.getSheets().forEach(function (f) {
    if (
      /^(Feuille|Sheet) ?\d+$/.test(f.getName()) &&
      f.getLastRow() === 0 &&
      f.getLastColumn() === 0 &&
      ss.getNumSheets() > 1
    )
      ss.deleteSheet(f);
  });
}

// =================================================================
// --- MODÈLE (pour l'auteur) ---
//     Sur le MODÈLE, après chaque mise à jour : éditeur Apps Script → choisir
//     preparerModele → Exécuter. Le modèle repart vierge, avec l'onglet « Démarrer ».
//     Refusé sur un classeur installé : une installation en service ne se vide pas
//     (ni par erreur, ni par un visiteur de l'application qui l'appellerait).
// =================================================================
function preparerModele() {
  var props = PropertiesService.getDocumentProperties();
  if (!props) throw new Error("À lancer dans le projet rattaché au Google Sheets MODÈLE.");
  if (props.getProperty("ID_SCRIPT") === ScriptApp.getScriptId())
    throw new Error("Ce Google Sheets est une installation en service : ce n'est pas le modèle.");
  props.deleteAllProperties();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  creerOngletDemarrer_();
  var appli = ss.getSheetByName(FEUILLE_APPLICATION);
  if (appli) ss.deleteSheet(appli);
  supprimerFeuillesVides_();
  Logger.log("Modèle prêt : onglet « Démarrer » et son bouton.");
  return "Modèle prêt";
}

// Image du bouton vert (PNG 640 × 128, affichée en 320 × 64), dessinée par
// outils/bouton-installer.js.
var BOUTON_INSTALLER_PNG = "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";
