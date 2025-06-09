export default ({ env }) => {
  const serviceAccount = JSON.parse(env('GCP_SERVICE_ACCOUNT'));
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

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