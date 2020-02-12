const path = require('path');
const fs = require('fs');
const firebaseAdmin = require('firebase-admin');

const { NODE_ENV } = require('../environment');

class FirebaseAdminService {
  constructor () {
    const serviceAccountPath = path.resolve(__dirname, `./credentials/serviceAccountKey.${NODE_ENV}.json`);

    if (!fs.existsSync(serviceAccountPath)) throw new Error(`can't get ${serviceAccountPath}`);

    this.admin = firebaseAdmin.initializeApp({ credential: firebaseAdmin.credential.cert(serviceAccountPath) });
  }

  /**
   * function to delete the firebase app
   *
   * @memberof FirebaseAdmin
   */
  async deleteApp () {
    await this.admin.delete();
  }
}

const firebaseAdminService = new FirebaseAdminService();

module.exports = {
  firebaseAdminService
};
