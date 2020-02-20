
const { throwError } = require('../utils/functions');

class Controller {
  /**
   * Creates an instance of UserController.
   * @param {object} app fastify app
   * @memberof Controller
   */
  constructor ({ app }) {
    if (!app.ready) throw new Error(`can't get .ready from fastify app.`);
    this.app = app;

    const { knex } = this.app;

    if (!knex) {
      throw new Error('cant get .knex from fastify app.');
    }
  }

  /**
   * function to create one row
   *
   * @param {{ tableName: string, objectToCreate: object }} { tableName, objectToCreate }
   * @returns {Promise<{id: number}>} created object
   * @memberof Controller
   */
  async createOne ({ tableName, objectToCreate, message = undefined, statusCode = undefined }) {
    const { knex } = this.app;
    if (!knex) throw new Error(`can't get .knex from app`);

    const insertSentense = await knex(tableName).insert(objectToCreate);

    let id;
    try {
      id = await insertSentense;
    } catch (error) {
      throw throwError(message || error.message, statusCode);
    }

    const insertedRow = await this.getOne({ tableName, attributeName: 'id', attributeValue: id });

    return insertedRow;
  }

  /**
   * function to get one row
   *
   * @param {{
   * tableName: string,
   * attributeName: string,
   * attributeValue: string
   * }} { tableName, attributeName, attributeValue, message = undefined, statusCode = undefined }
   * @returns
   * @memberof Controller
   */
  async getOne ({ tableName, attributeName, attributeValue }) {
    const { knex } = this.app;
    if (!knex) throw new Error(`can't get .knex from app`);

    const query = knex.select('*').from(tableName).where({ [attributeName]: attributeValue }).orderBy('id');

    const data = await query;

    if (!data.length) {
      return null;
    }

    return data[0];
  }
}

module.exports = {
  Controller
};
