// Traitement commun des confirmations de présence (repas et vin d'honneur).
// Les questions reprennent les Google Forms d'origine (voir src/components/FormulairePresence.astro).
import type { APIRoute } from 'astro';
import { REPAS_PASSWORD } from 'astro:env/server';
import { ajouterReponse, ONGLETS, type Ligne } from './stockage';

type TypePresence = keyof typeof ONGLETS;

const json = (status: number, corps: Record<string, string>) =>
  new Response(JSON.stringify(corps), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

// Texte court : une ligne, espaces regroupés.
const texte = (v: unknown) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : '');
// Texte long : garde les retours à la ligne.
const paragraphe = (v: unknown) =>
  typeof v === 'string' ? v.trim().replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n') : '';
const entier = (v: unknown) => (typeof v === 'string' && /^\d+$/.test(v.trim()) ? Number(v) : NaN);

// Tolère les espaces et la casse : « jujutoto2703 » est accepté.
const normaliserCode = (v: unknown) => texte(v).replace(/\s/g, '').toUpperCase();

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_COURT = 100;
const MAX_LONG = 1000;
const MAX_PERSONNES = 20;

class Invalide extends Error {}

function exiger(condition: unknown, erreur: string): asserts condition {
  if (!condition) throw new Invalide(erreur);
}

export function routePresence(type: TypePresence): APIRoute {
  const repas = type === 'repas';

  return async ({ request }) => {
    let corps: Record<string, unknown>;
    try {
      corps = await request.json();
    } catch {
      return json(400, { erreur: 'Requête invalide.' });
    }

    // Piège à robots rempli : on fait comme si tout allait bien, sans rien enregistrer.
    if (texte(corps.site)) return json(200, { message: 'Merci !' });

    if (repas && normaliserCode(corps.code) !== normaliserCode(REPAS_PASSWORD)) {
      return json(401, { erreur: "Le code n'est pas le bon. Vérifie celui inscrit sur ton faire-part." });
    }
    // Première étape du parcours : on vérifie seulement le code.
    if (corps.verifierCode === true) return json(200, { message: 'Code valide.' });

    let ligne: Ligne;
    let prenom: string;
    let present: boolean;
    let accompagnants = 0;

    try {
      prenom = texte(corps.prenom);
      const nom = texte(corps.nom);
      exiger(prenom && nom && prenom.length <= MAX_COURT && nom.length <= MAX_COURT, 'Merci de renseigner ton prénom et ton nom.');

      const email = texte(corps.email);
      exiger(email.length <= 200 && EMAIL.test(email), 'Merci de renseigner une adresse mail valide.');

      exiger(corps.present === 'oui' || corps.present === 'non', 'Merci de dire si tu seras présent.');
      present = corps.present === 'oui';

      const commentaire = paragraphe(corps.commentaire);
      exiger(commentaire.length <= MAX_LONG, 'Le commentaire est trop long.');

      let enfants = 0;
      let noms = '';
      let regime = '';

      if (present) {
        accompagnants = entier(corps.accompagnants);
        exiger(
          accompagnants >= 0 && accompagnants <= MAX_PERSONNES,
          `Le nombre d'accompagnants doit être compris entre 0 et ${MAX_PERSONNES}.`,
        );

        if (repas) {
          regime = paragraphe(corps.regime);
          exiger(regime.length <= MAX_LONG, 'Le texte sur le régime alimentaire est trop long.');

          if (accompagnants > 0) {
            noms = paragraphe(corps.nomsAccompagnants);
            exiger(noms, "Merci d'indiquer le nom des personnes qui t'accompagnent.");
            exiger(noms.length <= MAX_LONG, 'La liste des accompagnants est trop longue.');

            enfants = entier(corps.enfants);
            exiger(
              enfants >= 0 && enfants <= accompagnants,
              "Le nombre d'enfants ne peut pas dépasser le nombre d'accompagnants.",
            );
          }
        }
      }

      const date = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
      const base = [date, prenom, nom, email, present ? 'Oui' : 'Non'];
      const nombres = present ? [accompagnants, 1 + accompagnants] : ['', 0];

      // Ordre des colonnes : voir EN_TETES dans google-apps-script/Code.gs.
      ligne = repas
        ? [...base, ...nombres, present ? enfants : '', noms, regime, commentaire]
        : [...base, ...nombres, commentaire];
    } catch (erreur) {
      if (erreur instanceof Invalide) return json(400, { erreur: erreur.message });
      throw erreur;
    }

    try {
      await ajouterReponse(ONGLETS[type], ligne);
    } catch (erreur) {
      console.error(`[presence:${type}]`, erreur);
      return json(500, { erreur: "Oups, l'enregistrement a échoué. Merci de réessayer un peu plus tard." });
    }

    if (!present) {
      return json(200, { message: `Merci ${prenom} de nous avoir prévenus. Tu vas nous manquer !` });
    }
    const avec =
      accompagnants === 0 ? '' : ` (avec ${accompagnants} personne${accompagnants > 1 ? 's' : ''})`;
    const quoi = repas ? 'au repas' : "à la cérémonie et au vin d'honneur";
    return json(200, { message: `Merci ${prenom} ! Ta présence${avec} est bien notée ${quoi}.` });
  };
}
