const { throwError } = require('../utils/functions');

class UserController {
  /**
   * Creates an instance of UserController.
   * @param {object} app fastify app
   * @memberof UserController
   */
  constructor (app) {
    if (!app.ready) throw new Error(`can't get .ready from fastify app.`);
    this.app = app;

    const { knex, firebaseAdminService, firebaseService } = this.app;

    if (!knex) {
      throw new Error('cant get .knex from fastify app.');
    }
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

    const { knex } = this.app;

    const id = (await knex('User').insert(userObjec))[0];

    const createdUser = await this.getOne({ attribute: 'id', value: id });

    if (!createdUser) throw throwError(`can't get user ${id}.`, 500);

    return createdUser;
  }

  /**
   * function to get one
   *
   * @param {{ attribute: string, value: string }} { attribute, value }
   * @returns {Promise<{id: number}>} object
   * @memberof PersonService
   */
  async getOne ({ attribute, value }) {
    if (!attribute || !value) {
      throw throwError(`attribute or value are needed`, 400);
    }

    const getOneRow = require('./data-functions/commons/get-one-row').getOneRow(this.app);

    let user;
    try {
      user = await getOneRow('User', attribute, value, undefined, 412);
    } catch (error) {
      if (error.statusCode === 412) user = null;
      else throw error;
    }

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

    const getOneRow = require('./data-functions/commons/get-one-row').getOneRow(this.app);

    this.app.log.info('firebaseUser', firebaseUser);

    const user = await getOneRow('User', 'authUid', firebaseUser.uid);

    // get the accestoken
    const { stsTokenManager: { accessToken } } = firebaseUser;

    return { ...user, accessToken };
  }
}

module.exports = {
  UserController
};
