export default ({ env }) => {
  const serviceAccount = env.json('GCP_SERVICE_ACCOUNT', {
    type: 'service_account',
    project_id: env('GCP_PROJECT_ID', 'strapi-playground-mark'),
    private_key_id: env('GCP_PRIVATE_KEY_ID'),
    private_key: env('GCP_PRIVATE_KEY'),
    client_email: env('GCP_CLIENT_EMAIL'),
    client_id: env('GCP_CLIENT_ID'),
    auth_uri: env('GCP_AUTH_URI', 'https://accounts.google.com/o/oauth2/auth'),
    token_uri: env('GCP_TOKEN_URI', 'https://oauth2.googleapis.com/token'),
    auth_provider_x509_cert_url: env('GCP_AUTH_PROVIDER_CERT_URL', 'https://www.googleapis.com/oauth2/v1/certs'),
    client_x509_cert_url: env('GCP_CLIENT_CERT_URL'),
  });

  if (typeof serviceAccount.private_key === 'string') {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }

    return {upload: {
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
    }}
  };