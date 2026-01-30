export default ({ env }) => {
  // Email plugin configuration
  const emailHost = env('EMAIL_HOST');
  const emailHostPort = env.int('EMAIL_HOST_PORT');
  const emailLogoUrl = env('EMAIL_LOGO_URL');
  const emailFrom = env('EMAIL_FROM');
  const emailSSL = env.bool('EMAIL_SSL', false);
  const emailUser = env('EMAIL_USER');
  const emailPassword = env('EMAIL_PASSWORD');

  // Upload plugin configuration for Google Cloud Storage
  const serviceAccount = JSON.parse(env('GCP_SERVICE_ACCOUNT'));
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

  return {
    email: {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: emailHost,
          port: emailHostPort,
          secure: emailSSL,
          auth: {
            user: emailUser,
            pass: emailPassword,
          },
          emailLogoUrl: emailLogoUrl,
        },
        settings: {
          defaultFrom: emailFrom
        },
      },
    },
    upload: {
      config: {
        provider: '@strapi-community/strapi-provider-upload-google-cloud-storage',
        providerOptions: {
          bucketName: env('GCS_BUCKET_NAME', 'strapi_playground'),
          publicFiles: env.bool('GCS_PUBLIC_FILES', true),
          uniform: env.bool('GCS_UNIFORM', false),
          basePath: env('GCS_BASE_PATH', ''),
          baseUrl: env(
            'GCS_BASE_URL',
            `https://storage.googleapis.com/${env('GCS_BUCKET_NAME', 'strapi_playground')}`
          ),
          serviceAccount: serviceAccount,
        }
      }
    }
  }
};