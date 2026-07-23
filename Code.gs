function doGet() {
  return HtmlService.createHtmlOutputFromFile("index.html")
    .setTitle("Réimpression Bon - Carrefour Vannes")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/* =========================================================
   Mémoire EAN -> montant
   Stockée dans une feuille Google Sheets créée automatiquement
   au premier usage. Son identifiant est conservé dans les
   propriétés du script, donc aucune configuration manuelle.
   ========================================================= */

var CLE_ID_CLASSEUR = 'MEMOIRE_SHEET_ID';
var NOM_CLASSEUR = 'Réimpression Bon - Mémoire EAN';
var NOM_FEUILLE = 'Memoire';

function getFeuilleMemoire_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty(CLE_ID_CLASSEUR);
  var classeur = null;

  if (id) {
    try { classeur = SpreadsheetApp.openById(id); } catch (e) { classeur = null; }
  }
  if (!classeur) {
    classeur = SpreadsheetApp.create(NOM_CLASSEUR);
    props.setProperty(CLE_ID_CLASSEUR, classeur.getId());
  }

  var feuille = classeur.getSheetByName(NOM_FEUILLE);
  if (!feuille) {
    feuille = classeur.getSheets()[0];
    feuille.setName(NOM_FEUILLE);
    feuille.getRange(1, 1, 1, 3).setValues([['EAN', 'Montant', 'Mise à jour']]);
    feuille.setFrozenRows(1);
  }
  return feuille;
}

/** URL du classeur de mémoire (pour le corriger à la main). */
function getUrlMemoire() {
  return getFeuilleMemoire_().getParent().getUrl();
}

/**
 * Renvoie la mémoire sous forme { ean: montant }.
 * Échec silencieux : en cas de problème on renvoie un objet vide,
 * le site continue de fonctionner sans assistance à la saisie.
 */
function getMemoire() {
  try {
    var feuille = getFeuilleMemoire_();
    var derniere = feuille.getLastRow();
    if (derniere < 2) return {};

    var valeurs = feuille.getRange(2, 1, derniere - 1, 2).getValues();
    var memoire = {};
    valeurs.forEach(function (ligne) {
      var ean = String(ligne[0]).trim();
      var montant = String(ligne[1]).trim();
      if (ean && montant) memoire[ean] = montant;
    });
    return memoire;
  } catch (e) {
    return {};
  }
}

/**
 * Enregistre les couples EAN/montant validés à l'impression.
 * Un EAN déjà connu voit son montant remplacé (dernier imprimé fait foi).
 * Protégé par LockService pour supporter plusieurs postes.
 */
function enregistrerMemoire(entrees) {
  var verrou = LockService.getScriptLock();
  try {
    verrou.waitLock(10000);
  } catch (e) {
    return false;
  }

  try {
    var feuille = getFeuilleMemoire_();
    var derniere = feuille.getLastRow();

    var lignes = {};
    if (derniere >= 2) {
      feuille.getRange(2, 1, derniere - 1, 1).getValues().forEach(function (l, i) {
        lignes[String(l[0]).trim()] = i + 2;
      });
    }

    var maintenant = new Date();
    var dejaVus = {};
    var nouvelles = [];

    (entrees || []).forEach(function (e) {
      var ean = String((e && e.ean) || '').trim();
      var montant = String((e && e.montant) || '').trim();
      if (!ean || !montant) return;
      if (dejaVus[ean]) return;          // une seule fois par lot
      if (!eanValide_(ean)) return;      // clé de contrôle invalide : on ne mémorise pas
      dejaVus[ean] = true;

      if (lignes[ean]) {
        feuille.getRange(lignes[ean], 2, 1, 2).setValues([[montant, maintenant]]);
      } else {
        nouvelles.push([ean, montant, maintenant]);
      }
    });

    if (nouvelles.length) {
      feuille.getRange(feuille.getLastRow() + 1, 1, nouvelles.length, 3).setValues(nouvelles);
    }
    return true;
  } catch (e) {
    return false;
  } finally {
    verrou.releaseLock();
  }
}

/** Vérifie la clé de contrôle d'un EAN-13 ou EAN-8. */
function eanValide_(code) {
  if (!/^(\d{8}|\d{13})$/.test(code)) return false;

  var chiffres = code.split('').map(Number);
  var cle = chiffres.pop();
  var poidsInitial = (code.length === 13) ? 1 : 3;
  var somme = 0;

  chiffres.forEach(function (d, i) {
    var pair = (i % 2 === 0);
    somme += d * (pair ? poidsInitial : (poidsInitial === 1 ? 3 : 1));
  });

  return ((10 - (somme % 10)) % 10) === cle;
}
