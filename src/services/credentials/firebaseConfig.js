const environment = require('../../environment')

module.exports = {
  apiKey: environment.FIREBASE_API_KEY,
  authDomain: environment.FIREBASE_AUTH_DOMAIN,
  databaseURL: environment.FIREBASE_DB_URL,
  projectId: environment.FIREBASE_PROJECT_ID,
  storageBucket: environment.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: environment.FIREBASE_MESSAGING_SENDER_ID,
  appId: environment.FIREBASE_APP_ID,
  measurementId: environment.FIREBASE_MEASUREMENT_ID
}
