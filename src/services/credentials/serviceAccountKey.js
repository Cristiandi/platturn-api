const environment = require('../../environment')

module.exports = {
  type: environment.GCP_TYPE,
  project_id: environment.GCP_PROJECT_ID,
  private_key_id: environment.GCP_PRIVATE_KEY_ID,
  private_key: environment.GCP_PRIVATE_KEY,
  client_email: environment.GCP_CLIENT_EMAIL,
  client_id: environment.GCP_CLIENT_ID,
  token_uri: environment.GCP_TOKEN_URI,
  auth_provider_x509_cert_url: environment.GCP_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: environment.GCP_CLIENT_X509_CERT_URL
}
