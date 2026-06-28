export default ({ env }) => ({
  googleAppsScript: {
    webAppUrl: env('GOOGLE_APPS_SCRIPT_WEB_APP_URL', ''),
    secretToken: env('GOOGLE_APPS_SCRIPT_WEB_APP_TOKEN', ''),
  },
});
