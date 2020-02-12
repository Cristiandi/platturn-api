const firebaseAdmin = require('firebase-admin');

const { NODE_ENV } = require('../environment');
const serviceAccount = require(`./credentials/serviceAccountKey.${NODE_ENV}.js`);

class FirebaseAdminService {
  constructor () {
    // const serviceAccountPath = path.resolve(__dirname, `./credentials/serviceAccountKey.${NODE_ENV}.js`);

    // if (!fs.existsSync(serviceAccountPath)) throw new Error(`can't get ${serviceAccountPath}`);

    this.admin = firebaseAdmin.initializeApp({ credential: firebaseAdmin.credential.cert(serviceAccount) });
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
