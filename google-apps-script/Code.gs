/**
 * Réception des confirmations de présence du site du mariage.
 *
 * À coller dans la Google Sheet des réponses : Extensions → Apps Script.
 * Le site (src/lib/stockage.ts) envoie un POST JSON : { secret, onglet, ligne }.
 *
 * Réglage obligatoire : Paramètres du projet (roue dentée) → Propriétés du script →
 * ajouter la propriété SECRET, avec la même valeur que la variable SHEETS_SCRIPT_SECRET
 * du site. Sans ce secret, n'importe qui connaissant l'URL pourrait écrire dans la feuille.
 */

const EN_TETES = ['Date', 'Prénom', 'Nom', 'Nombre de personnes'];
const ONGLETS_AUTORISES = ['Repas', "Vin d'honneur"];

function doPost(e) {
  try {
    const corps = JSON.parse(e.postData.contents);
    const secret = PropertiesService.getScriptProperties().getProperty('SECRET');

    if (!secret || corps.secret !== secret) return repondre({ ok: false, erreur: 'non autorisé' });
    if (!ONGLETS_AUTORISES.includes(corps.onglet)) return repondre({ ok: false, erreur: 'onglet inconnu' });
    if (!Array.isArray(corps.ligne) || corps.ligne.length !== EN_TETES.length) {
      return repondre({ ok: false, erreur: 'ligne invalide' });
    }

    // Deux invités qui confirment en même temps ne doivent pas écrire sur la même ligne.
    const verrou = LockService.getScriptLock();
    verrou.waitLock(10000);
    try {
      ongletAvecEnTetes(corps.onglet).appendRow(corps.ligne);
    } finally {
      verrou.releaseLock();
    }
    return repondre({ ok: true });
  } catch (erreur) {
    return repondre({ ok: false, erreur: String(erreur) });
  }
}

/** Crée l'onglet et sa ligne d'en-têtes s'ils n'existent pas encore. */
function ongletAvecEnTetes(nom) {
  const classeur = SpreadsheetApp.getActiveSpreadsheet();
  let onglet = classeur.getSheetByName(nom);
  if (!onglet) onglet = classeur.insertSheet(nom);
  if (onglet.getLastRow() === 0) {
    onglet.appendRow(EN_TETES);
    onglet.getRange(1, 1, 1, EN_TETES.length).setFontWeight('bold');
    onglet.setFrozenRows(1);
  }
  return onglet;
}

/**
 * À lancer une fois depuis l'éditeur (sélectionner « autoriser » puis Exécuter) :
 * déclenche la fenêtre d'autorisation de Google et crée les deux onglets.
 * Tant que le propriétaire n'a pas autorisé le script, l'URL /exec répond « Accès refusé ».
 */
function autoriser() {
  ONGLETS_AUTORISES.forEach(ongletAvecEnTetes);
  const secret = PropertiesService.getScriptProperties().getProperty('SECRET');
  Logger.log(secret ? 'Autorisé, onglets prêts, secret présent.' : 'Autorisé, mais la propriété SECRET manque.');
}

function repondre(objet) {
  return ContentService.createTextOutput(JSON.stringify(objet)).setMimeType(ContentService.MimeType.JSON);
}
