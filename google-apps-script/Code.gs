/**
 * Réception des confirmations de présence du site du mariage.
 *
 * À coller dans la Google Sheet des réponses : Extensions → Apps Script.
 * Le site (src/lib/stockage.ts) envoie un POST JSON : { secret, onglet, ligne }.
 *
 * Après chaque modification de ce fichier : Déployer → Gérer les déploiements → modifier (crayon)
 * → Version : « Nouvelle version » → Déployer. L'URL /exec reste la même.
 *
 * Réglage obligatoire : Paramètres du projet (roue dentée) → Propriétés du script →
 * ajouter la propriété SECRET, avec la même valeur que la variable SHEETS_SCRIPT_SECRET
 * du site. Sans ce secret, n'importe qui connaissant l'URL pourrait écrire dans la feuille.
 */

// Mêmes colonnes, dans le même ordre, que les lignes construites par src/lib/presence.ts.
const COMMUNES = ['Date', 'Prénom', 'Nom', 'E-mail', 'Présent', 'Accompagnants', 'Total personnes'];
const EN_TETES = {
  Repas: [...COMMUNES, 'Enfants de moins de 12 ans', 'Noms des accompagnants', 'Régime / allergies', 'Commentaire'],
  "Vin d'honneur": [...COMMUNES, 'Commentaire'],
};
const ONGLETS_AUTORISES = Object.keys(EN_TETES);

function doPost(e) {
  try {
    const corps = JSON.parse(e.postData.contents);
    const secret = PropertiesService.getScriptProperties().getProperty('SECRET');

    if (!secret || corps.secret !== secret) return repondre({ ok: false, erreur: 'non autorisé' });
    if (!ONGLETS_AUTORISES.includes(corps.onglet)) return repondre({ ok: false, erreur: 'onglet inconnu' });
    if (!Array.isArray(corps.ligne) || corps.ligne.length !== EN_TETES[corps.onglet].length) {
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

/**
 * Crée l'onglet et sa ligne d'en-têtes s'ils n'existent pas encore.
 * Si l'onglet existe avec d'autres colonnes (ancienne version du formulaire), il est renommé
 * « <nom> (ancien format) » pour ne rien perdre, et un onglet neuf est créé.
 */
function ongletAvecEnTetes(nom) {
  const enTetes = EN_TETES[nom];
  const classeur = SpreadsheetApp.getActiveSpreadsheet();
  let onglet = classeur.getSheetByName(nom);

  if (onglet && onglet.getLastRow() > 0) {
    const actuels = onglet.getRange(1, 1, 1, onglet.getLastColumn()).getValues()[0];
    if (actuels.join('|') !== enTetes.join('|')) {
      let ancien = `${nom} (ancien format)`;
      for (let i = 2; classeur.getSheetByName(ancien); i++) ancien = `${nom} (ancien format ${i})`;
      onglet.setName(ancien);
      onglet = null;
    }
  }

  if (!onglet) onglet = classeur.insertSheet(nom);
  if (onglet.getLastRow() === 0) {
    onglet.appendRow(enTetes);
    onglet.getRange(1, 1, 1, enTetes.length).setFontWeight('bold');
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
