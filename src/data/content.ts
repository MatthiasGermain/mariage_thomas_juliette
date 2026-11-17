// Tout le contenu éditorial du site, au même endroit (source : BRIEF.md).

export const mariage = {
  maries: 'Juliette & Thomas',
  dateAffichee: '27.03.27',
  dateLongue: 'Samedi 27 mars 2027',
  // Début de la cérémonie, heure de Paris (heure d'hiver, UTC+1, le 27/03/2027).
  dateCeremonie: '2027-03-27T14:00:00+01:00',
  dateLimiteRepas: '15 janvier 2027',
};

export const invitation = {
  texte:
    "Nous avons le plaisir de vous inviter à notre cérémonie de mariage suivie de notre vin d'honneur participatif. Nous avons hâte de vivre ce moment avec vous !",
  suite: 'Vous trouverez toutes les informations pratiques pour cet évènement ici.',
};

export const verset = {
  texte:
    "L'amour est patient, l'amour rend service. Il n'est pas jaloux, il ne se vante pas, il ne se gonfle pas d'orgueil. L'amour ne fait rien de honteux. Il ne cherche pas son intérêt, il ne se met pas en colère, il ne se souvient pas du mal. Il ne se réjouit pas de l'injustice, mais il se réjouit de la vérité. L'amour excuse tout, il croit tout, il espère tout, il supporte tout.",
  reference: '1 Corinthiens 13:4-7',
  traduction: 'PDV2017',
};

// Titre en serif grasse + sous-titre en script, comme la frise de la maquette.
export const programme = [
  {
    heure: '13h',
    titre: 'Apport des plats',
    sousTitre: 'entre 13h et 14h',
    detail: "Déposez votre participation au vin d'honneur.",
    illustration: '/images/deco/plats.webp',
  },
  {
    heure: '14h',
    titre: 'Cérémonie',
    sousTitre: 'de mariage',
    detail: 'Cérémonie de mariage.',
    illustration: '/images/deco/bague.webp',
  },
  {
    heure: '16h',
    titre: "Vin d'honneur",
    sousTitre: 'participatif',
    detail: 'Avec animations et jeux.',
    illustration: '/images/deco/verre.webp',
  },
];

export const noteProgramme =
  "Le vin d'honneur se fera en extérieur : nous vous conseillons de vous habiller chaudement !";

export const lieu = {
  nom: 'Domaine des Templiers',
  adresse: ['Ferme de Béville, Salle Bastide', '3 Rue Beville', '57530 Glatigny (Moselle)'],
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=3+Rue+Beville+57530+Glatigny',
  parking: 'Parking sur place',
  gare: 'Gare la plus proche : gare de Metz',
};

export const liens = {
  covoiturage: 'https://togetzer.com/covoiturage-evenement/dpelsm',
  // À renseigner : les blocs correspondants restent masqués tant que l'URL est vide.
  formulairePlats: '',
  cagnotte: '',
};

export const couleurs = [
  { nom: 'Café noir', hex: '#332A1B' },
  { nom: 'Brun cendré', hex: '#5B4734' },
  { nom: 'Abricot doré', hex: '#E1973D' },
  { nom: "Crème d'amande", hex: '#E7D6C2' },
  { nom: 'Olive poussiéreuse', hex: '#6B734F' },
];

export type Logement = { nom: string; ville?: string; note: string; description: string };

export const logements: { groupe: string; items: Logement[] }[] = [
  {
    groupe: 'Tout près (environ 10 à 20 minutes en voiture)',
    items: [
      {
        nom: 'Logis Hôtel Auberge du Gros',
        ville: 'Silly-sur-Nied',
        note: '4,2/5',
        description:
          "Le plus proche, avec un restaurant sur place. Chambres simples mais propres selon les avis. Petit-déjeuner minimal, mieux vaut ne pas compter dessus.",
      },
      {
        nom: 'Les chambres de la Nied',
        ville: 'Condé-Northen',
        note: '4,8/5',
        description: "Maison d'hôtes très bien notée, calme, avec parking et un très bon petit-déjeuner.",
      },
      {
        nom: 'Le Coup de Cœur',
        ville: 'Coincy',
        note: '4,9/5',
        description: "Chambre d'hôtes très appréciée pour son accueil et son petit-déjeuner, mais avec peu d'avis (24).",
      },
    ],
  },
  {
    groupe: 'À environ 20 à 25 minutes',
    items: [
      {
        nom: 'Le Vieux Nayeu',
        ville: 'Raville',
        note: '4,6/5',
        description:
          "Chambres d'hôtes avec piscine en été, dans un cadre de campagne. Les avis récents sont plus mitigés : nous vous conseillons de contacter l'hôte avant de réserver.",
      },
    ],
  },
  {
    groupe: "Hôtels classiques près de l'autoroute, vers Metz (environ 25 à 30 minutes)",
    items: [
      {
        nom: 'B&B Hôtel Metz Est Technopole',
        ville: 'Ars-Laquenexy',
        note: '4,3/5',
        description:
          'Économique, parking gratuit, restaurants et supermarché à pied, accès direct A4/A31. Le plus pratique pour un hôtel standard.',
      },
      {
        nom: 'ACE Hôtel Metz',
        note: '4,6/5',
        description:
          'Bien noté pour sa propreté et son accueil. Chambres petites mais agréables, animaux acceptés avec supplément.',
      },
      {
        nom: 'Hôtel Campanile Metz Nord',
        ville: 'Woippy',
        note: '4,3/5',
        description:
          "Parking, bornes de recharge pour véhicules électriques, accès rapide à l'autoroute. Plus éloigné, au nord-ouest de Metz.",
      },
    ],
  },
];
