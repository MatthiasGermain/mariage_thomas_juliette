// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';

// Site statique, sauf les routes API des formulaires (prerender = false).
export default defineConfig({
  adapter: vercel(),
  env: {
    schema: {
      // Mot de passe donné sur le faire-part pour s'inscrire au repas.
      REPAS_PASSWORD: envField.string({ context: 'server', access: 'secret' }),
      // Compte de service Google pour écrire dans le tableur des réponses.
      // Absents en local : les réponses vont alors dans .data/reponses.json.
      GOOGLE_SERVICE_ACCOUNT_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
      GOOGLE_PRIVATE_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      GOOGLE_SHEET_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
