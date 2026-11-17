// Enregistrement des réponses : Google Sheet via Apps Script si configuré, sinon fichier local en développement.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { SHEETS_SCRIPT_URL, SHEETS_SCRIPT_SECRET } from 'astro:env/server';

export type Ligne = (string | number)[];

/**
 * Onglets du tableur. Le script (google-apps-script/Code.gs) les crée au premier envoi,
 * avec les en-têtes : Date | Prénom | Nom | Nombre de personnes
 */
export const ONGLETS = {
  repas: 'Repas',
  'vin-honneur': "Vin d'honneur",
} as const;

const scriptConfigure = Boolean(SHEETS_SCRIPT_URL && SHEETS_SCRIPT_SECRET);

async function ajouterSheet(onglet: string, ligne: Ligne): Promise<void> {
  // Apps Script répond par une redirection (302) vers la réponse : fetch la suit tout seul.
  const reponse = await fetch(SHEETS_SCRIPT_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: SHEETS_SCRIPT_SECRET, onglet, ligne }),
    signal: AbortSignal.timeout(15000),
  });
  // Apps Script renvoie toujours 200 : le vrai résultat est dans le JSON.
  const corps = (await reponse.json().catch(() => null)) as { ok?: boolean; erreur?: string } | null;
  if (!reponse.ok || !corps?.ok) {
    throw new Error(`Apps Script a refusé l'enregistrement : ${corps?.erreur ?? `HTTP ${reponse.status}`}`);
  }
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
  if (scriptConfigure) return ajouterSheet(onglet, ligne);
  if (import.meta.env.DEV) return ajouterLocal(onglet, ligne);
  throw new Error('Stockage non configuré : variables SHEETS_SCRIPT_URL et SHEETS_SCRIPT_SECRET manquantes.');
}
