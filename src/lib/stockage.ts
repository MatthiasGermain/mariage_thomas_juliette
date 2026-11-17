// Enregistrement des réponses : Google Sheets si configuré, sinon fichier local en développement.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { JWT } from 'google-auth-library';
import { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } from 'astro:env/server';

export type Ligne = (string | number)[];

/**
 * Onglets du tableur, à créer avec exactement ces noms.
 * En-têtes de la ligne 1 : Date | Prénom | Nom | Nombre de personnes
 */
export const ONGLETS = {
  repas: 'Repas',
  'vin-honneur': "Vin d'honneur",
} as const;

const googleConfigure = Boolean(GOOGLE_SERVICE_ACCOUNT_EMAIL && GOOGLE_PRIVATE_KEY && GOOGLE_SHEET_ID);

let client: JWT | undefined;

function clientGoogle(): JWT {
  client ??= new JWT({
    email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    // Vercel stocke la clé sur une ligne : on remet les vrais retours à la ligne.
    key: GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return client;
}

async function ajouterGoogle(onglet: string, ligne: Ligne): Promise<void> {
  // Les noms d'onglets avec apostrophe doivent être entre quotes, apostrophe doublée.
  const plage = encodeURIComponent(`'${onglet.replace(/'/g, "''")}'!A:D`);
  await clientGoogle().request({
    url: `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${plage}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    method: 'POST',
    data: { values: [ligne] },
  });
}

const FICHIER_LOCAL = path.resolve('.data/reponses.json');

async function ajouterLocal(onglet: string, ligne: Ligne): Promise<void> {
  let donnees: Record<string, Ligne[]> = {};
  try {
    donnees = JSON.parse(await readFile(FICHIER_LOCAL, 'utf8'));
  } catch {
    // Premier enregistrement : le fichier n'existe pas encore.
  }
  (donnees[onglet] ??= []).push(ligne);
  await mkdir(path.dirname(FICHIER_LOCAL), { recursive: true });
  await writeFile(FICHIER_LOCAL, JSON.stringify(donnees, null, 2));
}

export async function ajouterReponse(onglet: string, ligne: Ligne): Promise<void> {
  if (googleConfigure) return ajouterGoogle(onglet, ligne);
  if (import.meta.env.DEV) return ajouterLocal(onglet, ligne);
  throw new Error('Stockage non configuré : variables GOOGLE_* manquantes.');
}
