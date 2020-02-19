const { Controller } = require('./controller');
const { throwError } = require('../utils/functions');

class UserController extends Controller {
  /**
   * Creates an instance of UserController.
   * @param {object} app fastify app
   * @memberof UserController
   */
  constructor ({ app }) {
    super({ app });

    const { firebaseAdminService, firebaseService } = this.app;
    if (!firebaseAdminService) {
      throw new Error('cant get .firebaseAdminService from fastify app.');
    }
    if (!firebaseService) {
      throw new Error('cant get .firebaseService from fastify app.');
    }
  }

  /**
   *
   *
   * @param {{
   * user: {
   *  email: string
   * }
   * }} { user }
   * @returns {Promise<object>} created user
   * @memberof UserController
   */
  async createUser ({ user }) {
    this.app.log.info('user', user);
    const { email, password, phone, fullName, address, document } = user;

    const { firebaseAdminService } = this.app;

    const { uid: authUid } = await firebaseAdminService.createUser({ email, password, phone });
    this.app.log.info('authUid', authUid);
    const userObjec = {
      authUid,
      fullName,
      document,
      email,
      address,
      phone
    };

    const createdUser = await this.createOne({ tableName: 'User', objectToCreate: userObjec });

    return createdUser;
  }

  /**
   * function to get one
   *
   * @param {{ attribute: string, value: string }} { attribute, value }
   * @returns {Promise<{id: number}>} object
   * @memberof PersonService
   */
  async getOneUser ({ attribute, value }) {
    if (!attribute || !value) {
      throw throwError(`attribute or value are needed`, 400);
    }

    const user = await this.getOne({
      tableName: 'User',
      attributeName: attribute,
      attributeValue: value,
      message: `can't get a user.${attribute} = ${value}.`,
      statusCode: 412
    });

    return user;
  }

  /**
   * function to login
   *
   * @param {{ email: string, password: string }} { email, password }
   * @returns {Promise<object>}
   * @memberof UserController
   */
  async login ({ email, password }) {
    const { firebaseService } = this.app;

    // get the user
    const firebaseUser = await firebaseService.login({ email, password });

    // this.app.log.info('firebaseUser', firebaseUser);

    const { uid: authUid } = firebaseUser;

    const user = await this.getOneUser({ attribute: 'authUid', value: authUid });

    if (!user) {
      throw throwError(`can't get the user with authUid = ${authUid}`, 412);
    }

    // get the accestoken
    const { stsTokenManager: { accessToken } } = firebaseUser;

    return { ...user, accessToken };
  }
}

module.exports = {
  UserController
};
