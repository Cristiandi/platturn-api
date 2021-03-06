const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.resolve(__dirname, '../.env') })

let envPath

// validate the NODE_ENV
const NODE_ENV = process.env.NODE_ENV
switch (NODE_ENV) {
  case 'development':
    envPath = path.resolve(__dirname, '../.env.development')
    break
  case 'staging':
    envPath = path.resolve(__dirname, '../.env.staging')
    break
  case 'production':
    envPath = path.resolve(__dirname, '../.env.production')
    break
  default:
    envPath = path.resolve(__dirname, '../.env.local')
    break
};

dotenv.config({ path: envPath })

const enviroment = {
  /* GENERAL */
  NODE_ENV,
  TIME_ZONE: process.env.TIME_ZONE,
  APP_PORT: process.env.PORT || 8080,
  /* DATABASE */
  DB_NOSQL_HOST: process.env.DB_NOSQL_HOST,
  DB_NOSQL_USER: process.env.DB_NOSQL_USER,
  DB_NOSQL_PASSWORD: process.env.DB_NOSQL_PASSWORD,
  DB_NOSQL_NAME: process.env.DB_NOSQL_NAME,
  DB_NOSQL_PORT: process.env.DB_NOSQL_PORT,
  DB_SQL_CLIENT: process.env.DB_SQL_CLIENT,
  DB_SQL_HOST: process.env.DB_SQL_HOST,
  DB_SQL_USER: process.env.DB_SQL_USER,
  DB_SQL_PASSWORD: process.env.DB_SQL_PASSWORD,
  DB_SQL_NAME: process.env.DB_SQL_NAME,
  DB_SQL_PORT: process.env.DB_SQL_PORT,
  /* GCP */
  GCP_TYPE: process.env.GCP_TYPE,
  GCP_PROJECT_ID: process.env.GCP_PROJECT_ID,
  GCP_PRIVATE_KEY_ID: process.env.GCP_PRIVATE_KEY_ID,
  GCP_PRIVATE_KEY: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n'),
  GCP_CLIENT_EMAIL: process.env.GCP_CLIENT_EMAIL,
  GCP_CLIENT_ID: process.env.GCP_CLIENT_ID,
  GCP_AUTH_URI: process.env.GCP_AUTH_URI,
  GCP_TOKEN_URI: process.env.GCP_TOKEN_URI,
  GCP_AUTH_PROVIDER_X509_CERT_URL: process.env.GCP_AUTH_PROVIDER_X509_CERT_URL,
  GCP_CLIENT_X509_CERT_URL: process.env.GCP_CLIENT_X509_CERT_URL,
  /* FIREBASE */
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
  FIREBASE_DB_URL: process.env.FIREBASE_DB_URL,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
  /* SMT */
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PW: process.env.SMTP_PW,
  /* SELF */
  SELF_API_URL: process.env.SELF_API_URL,
  KEY_TO_CRYP: process.env.KEY_TO_CRYP,
  /* WEB */
  WEB_BASE_URL: process.env.WEB_BASE_URL
}

module.exports = enviroment
