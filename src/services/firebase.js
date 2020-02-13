const firebase = require('firebase');

const firebaseConfig = require('./credentials/firebaseConfig');
const { throwError } = require('../utils/functions');

class FirebaseService {
  /**
   * Creates an instance of FirebaseService.
   * @memberof FirebaseService
   */
  constructor () {
    firebase.initializeApp(firebaseConfig);

    this.app = firebase.app();
  }

  /**
   * funciton to login a user
   *
   * @param {{ email: string, password }} { email, password }
   * @returns
   * @memberof FirebaseService
   */
  async login ({ email, password }) {
    let result;
    try {
      result = await this.app.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      const code = error.code;
      if (code && code.startsWith('auth')) {
        throw throwError(`email or password are wrong,`, 401);
      }
      throw error;
    }

    return result.user.toJSON();
  }
}

const firebaseService = new FirebaseService();

module.exports = {
  firebaseService
};
