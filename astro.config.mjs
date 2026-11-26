// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';

// Site statique, sauf les routes API des formulaires (prerender = false).
export default defineConfig({
  adapter: vercel(),
  // Adresses courtes à imprimer sur le faire-part.
  redirects: {
    '/repas': '/#repas',
  },
  env: {
    schema: {
      // Mot de passe donné sur le faire-part pour s'inscrire au repas.
      REPAS_PASSWORD: envField.string({ context: 'server', access: 'secret' }),
      // Application web Apps Script attachée au tableur des réponses (google-apps-script/Code.gs)
      // et secret partagé avec elle (propriété de script SECRET).
      // Absents en local : les réponses vont alors dans .data/reponses.json.
      SHEETS_SCRIPT_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      SHEETS_SCRIPT_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
