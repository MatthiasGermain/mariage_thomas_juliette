# Site du mariage de Juliette & Thomas — brief

Date : **samedi 27 mars 2027**. Ce fichier rassemble le contenu à mettre sur le site et le lien type Linktree.
Identité visuelle : voir `Identité visuelle/` (charte, logo, maquette `Site internet mariage J&T.png`).

## Charte

- Couleurs : `#332A1B` café noir · `#5B4734` brun cendré · `#E1973D` abricot doré · `#E7D6C2` crème d'amande · `#6B734F` olive poussiéreuse
- Polices : Sloop ScriptOne (titres script, fournie dans `typo/`) · Americana (titres et sous-titres, fournie dans `typo/`) · Montserrat (corps, Google Fonts)
- Contrastes : voir les captures WCAG dans `Identité visuelle/` (l'abricot ne convient au petit texte que sur les fonds foncés).

## Stack

- **Astro**, déployé sur **Vercel** (adaptateur `@astrojs/vercel`). Pages statiques, sauf deux routes API serveur pour les formulaires.
- **Google Sheets** pour stocker les réponses : un onglet « Repas » et un onglet « Vin d'honneur », colonnes date · nom · prénom · nombre de personnes. Le tableur est partagé avec Juliette et Thomas.
- Écriture via un **script Google Apps Script** attaché au tableur (`google-apps-script/Code.gs`), publié en application web. Gratuit, sans Google Cloud ni carte bancaire. Le serveur du site lui envoie chaque réponse avec un secret partagé.
- CSS simple, avec les couleurs de la charte en variables. JS uniquement pour le compte à rebours et les formulaires.
- Variables d'environnement Vercel, jamais dans le dépôt :
  - `REPAS_PASSWORD` : mot de passe du repas
  - `SHEETS_SCRIPT_URL` : URL de l'application web Apps Script (se termine par `/exec`)
  - `SHEETS_SCRIPT_SECRET` : secret partagé, identique à la propriété de script `SECRET`

## Lien type Linktree

Une page de liens :

1. **Google Forms du vin d'honneur** (fait par Yolaine, pour le plat à amener) : lien dans `src/data/content.ts`
2. **Site Internet** (fait par Matthias)
   - Confirmation de présence au **repas** : protégée par le mot de passe du faire-part (variable d'environnement `REPAS_PASSWORD`, jamais dans le dépôt), puis formulaire. Réponse attendue **avant le 15 janvier 2027**.
   - Confirmation de présence au **vin d'honneur** : formulaire
3. **Covoiturage Togetzer** : https://togetzer.com/covoiturage-evenement/dpelsm

### Formulaires de confirmation (décisions)

- Pour l'instant, le site ne gère **que les confirmations de présence** (repas et vin d'honneur). Le plat à amener sera traité plus tard.
- Parcours en plusieurs étapes (une question par écran, puis récapitulatif), qui reprend les questions des Google Forms d'origine :
  - **communes** : prénom et nom, e-mail, présent oui/non, nombre d'accompagnants (« Combien de personnes viendront avec toi ? »), commentaire
  - **repas en plus** : code du faire-part (vérifié dès la 1re étape), noms des accompagnants, enfants de moins de 12 ans, régime alimentaire / allergies
  - après la confirmation du vin d'honneur : liens vers le Google Forms des plats et le covoiturage
- Mot de passe du repas : vérifié **côté serveur**, à partir d'une variable d'environnement Vercel, pour ne pas apparaître dans le code envoyé au navigateur.
- Liens manquants (Google Forms, cagnotte) : on avance sans. Les emplacements restent prévus, masqués tant que l'URL est vide.

## Contenu du site

### Invitation

> Nous avons le plaisir de vous inviter à notre cérémonie de mariage suivie de notre vin d'honneur participatif. Nous avons hâte de vivre ce moment avec vous !
>
> Vous trouverez toutes les informations pratiques pour cet évènement ici.

### Verset

> « L'amour est patient, l'amour rend service. Il n'est pas jaloux, il ne se vante pas, il ne se gonfle pas d'orgueil. L'amour ne fait rien de honteux. Il ne cherche pas son intérêt, il ne se met pas en colère, il ne se souvient pas du mal. Il ne se réjouit pas de l'injustice, mais il se réjouit de la vérité. L'amour excuse tout, il croit tout, il espère tout, il supporte tout. »
>
> 1 Corinthiens 13:4-7 (PDV2017)

### Programme

- **Entre 13h et 14h** : dépôt de votre participation au vin d'honneur
- **14h** : cérémonie de mariage
- **16h** : vin d'honneur participatif (avec animations et jeux)
  - Le vin d'honneur se fera en extérieur : nous vous conseillons de vous habiller chaudement.

### Infos pratiques

- **Dress code** (pas obligatoire) : « Si vous voulez vous accorder au thème du mariage, voici les couleurs mises en avant : » puis les 5 pastilles de couleur
- **Cadeaux de mariage** : « Si vous voulez nous aider dans notre début de vie à deux » + lien vers la cagnotte (**URL à fournir**)
- **Inscription au repas + confirmation de présence** (voir Linktree ci-dessus)
- **Plat à amener pour le vin d'honneur** (Google Forms de Yolaine)

### Lieu et comment y aller

- **Domaine des Templiers** : Ferme de Béville, Salle Bastide, 3 Rue Beville, 57530 Glatigny (Moselle)
- Parking sur place
- Covoiturage : https://togetzer.com/covoiturage-evenement/dpelsm
- Gare la plus proche : gare de Metz

### Dormir : les possibilités de logement

**Tout près (environ 10 à 20 minutes en voiture)**

- **Logis Hôtel Auberge du Gros**, Silly-sur-Nied (4,2/5) : le plus proche, avec un restaurant sur place. Chambres simples mais propres selon les avis. Petit-déjeuner minimal, mieux vaut ne pas compter dessus.
- **Les chambres de la Nied**, Condé-Northen (4,8/5) : maison d'hôtes très bien notée, calme, avec parking et un très bon petit-déjeuner.
- **Le Coup de Cœur**, Coincy (4,9/5) : chambre d'hôtes très appréciée pour son accueil et son petit-déjeuner, mais avec peu d'avis (24).

**À environ 20 à 25 minutes**

- **Le Vieux Nayeu**, Raville (4,6/5) : chambres d'hôtes avec piscine en été, dans un cadre de campagne. Les avis récents sont plus mitigés : nous vous conseillons de contacter l'hôte avant de réserver.

**Hôtels classiques près de l'autoroute, vers Metz (environ 25 à 30 minutes)**

- **B&B Hôtel Metz Est Technopole**, Ars-Laquenexy (4,3/5) : économique, parking gratuit, restaurants et supermarché à pied, accès direct A4/A31. Le plus pratique pour un hôtel standard.
- **ACE Hôtel Metz** (4,6/5) : bien noté pour sa propreté et son accueil. Chambres petites mais agréables, animaux acceptés avec supplément.
- **Hôtel Campanile Metz Nord**, Woippy (4,3/5) : parking, bornes de recharge pour véhicules électriques, accès rapide à l'autoroute. Plus éloigné, au nord-ouest de Metz.

## À fournir ou à trancher

- URL de la cagnotte (plus tard)
- Où arrivent les réponses des formulaires (choix de stack, déploiement sur Vercel)
