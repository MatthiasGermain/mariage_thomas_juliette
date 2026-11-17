// Traitement commun des confirmations de présence (repas et vin d'honneur).
import type { APIRoute } from 'astro';
import { REPAS_PASSWORD } from 'astro:env/server';
import { ajouterReponse, ONGLETS } from './stockage';

type TypePresence = keyof typeof ONGLETS;

const json = (status: number, corps: Record<string, string>) =>
  new Response(JSON.stringify(corps), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

const texte = (v: unknown) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : '');

// Tolère les espaces et la casse : « jujutoto2703 » est accepté.
const normaliserCode = (v: unknown) => texte(v).replace(/\s/g, '').toUpperCase();

export function routePresence(type: TypePresence): APIRoute {
  return async ({ request }) => {
    let corps: Record<string, unknown>;
    try {
      corps = await request.json();
    } catch {
      return json(400, { erreur: 'Requête invalide.' });
    }

    // Piège à robots rempli : on fait comme si tout allait bien, sans rien enregistrer.
    if (texte(corps.site)) return json(200, { message: 'Merci !' });

    if (type === 'repas' && normaliserCode(corps.code) !== normaliserCode(REPAS_PASSWORD)) {
      return json(401, { erreur: "Le code n'est pas le bon. Vérifiez celui inscrit sur votre faire-part." });
    }

    const prenom = texte(corps.prenom);
    const nom = texte(corps.nom);
    const personnes = Number(corps.personnes);

    if (!prenom || !nom || prenom.length > 100 || nom.length > 100) {
      return json(400, { erreur: 'Merci de renseigner votre prénom et votre nom.' });
    }
    if (!Number.isInteger(personnes) || personnes < 1 || personnes > 20) {
      return json(400, { erreur: 'Le nombre de personnes doit être compris entre 1 et 20.' });
    }

    const date = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });

    try {
      await ajouterReponse(ONGLETS[type], [date, prenom, nom, personnes]);
    } catch (erreur) {
      console.error(`[presence:${type}]`, erreur);
      return json(500, { erreur: "Oups, l'enregistrement a échoué. Merci de réessayer un peu plus tard." });
    }

    const pluriel = personnes > 1;
    const quoi = type === 'repas' ? 'au repas' : "à la cérémonie et au vin d'honneur";
    return json(200, {
      message: `Merci ${prenom} ! ${pluriel ? `Vos ${personnes} places sont` : 'Votre présence est'} bien notée${pluriel ? 's' : ''} ${quoi}.`,
    });
  };
}
