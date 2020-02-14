const firebaseAdmin = require('firebase-admin');

const serviceAccount = require(`./credentials/serviceAccountKey.js`);

class FirebaseAdminService {
  constructor () {
    // const serviceAccountPath = path.resolve(__dirname, `./credentials/serviceAccountKey.${NODE_ENV}.js`);

    // if (!fs.existsSync(serviceAccountPath)) throw new Error(`can't get ${serviceAccountPath}`);

    this.admin = firebaseAdmin.initializeApp({ credential: firebaseAdmin.credential.cert(serviceAccount) });
  }

  /**
   * funciton to create an user in firebase
   *
   * @param {{
   * email: string,
   * password: string,
   * phone: string
   * }} { email, password, phone }
   * @returns {Promise<{
   * uid: string,
   * phoneNumber: string,
   * email: string
   * }>}
   * @memberof FirebaseAdminService
   */
  async createUser ({ email, password, phone }) {
    const objectToCreate = {
      email,
      password,
      phoneNumber: `+57${phone}`
    };

    let userRecord = await this.admin.auth().createUser(objectToCreate);
    userRecord = userRecord.toJSON();

    return userRecord;
  }

  /**
   * function to verify the token
   *
   * @param {string} token
   * @returns {Promise<{
   * aud: string,
   * auth_time: number,
   * exp: number,
   * firebase: object,
   * iat: number,
   * iss: string,
   * sub: string,
   * uid: string
   * }>}
   * @memberof FirebaseAdminService
   */
  async verifyToken (token) {
    const userFirebase = await this.admin.auth().verifyIdToken(token);

    return userFirebase;
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
