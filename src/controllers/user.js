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

    const createdUser = await this.getOne({ id });

    return createdUser;
  }

  /**
   * function to get one
   *
   * @param {{ id: number }} { id }
   * @returns {Promise<{id: number}>} object
   * @memberof PersonService
   */
  async getOne ({ id }) {
    if (!id) {
      throw throwError(`id is needed`, 400);
    }

    const { knex } = this.app;

    const data = await knex.select('*').from('User').where({ id });

    if (!data.length) {
      throw throwError(`can't get the user ${id}.`, 412);
    }

    const [user] = data;
    return user;
  }

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
