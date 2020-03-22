
const { throwError, isEmptyObject } = require('../utils/functions');

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
   * function to create one
   *
   * @param {{ tableName: string, objectToCreate: object }} { tableName, objectToCreate }
   * @returns {Promise<{id: number}>} created object
   * @memberof Controller
   */
  async createOne ({ tableName, objectToCreate = {}, message = undefined, statusCode = undefined }) {
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

  /**
   * function to get all
   *
   * @param {{
   * tableName: string.
   * attributeName: string,
   * attributeValue: any
   * }} { tableName, attributeName = null, attributeValue = null }
   * @returns
   * @memberof Controller
   */
  async getAll ({ tableName, attributeName = null, attributeValue = null }) {
    const { knex } = this.app;
    if (!knex) throw new Error(`can't get .knex from app`);

    let query = knex.select('*').from(tableName);

    if (attributeName !== null) {
      query = query.where({ [attributeName]: attributeValue });
    }

    query = query.orderBy('id');

    const data = await query;

    return data;
  }

  /**
   * function to update one
   *
   * @param {{ tableName: string, id: number, objectToUpdate: object }} { tableName, id, objectToUpdate = {} }
   * @returns {Promise<{ id: number }>} updated object
   * @memberof Controller
   */
  async updateOne ({ tableName, id, objectToUpdate = {} }) {
    const rowBefore = await this.getOne({
      tableName,
      attributeName: 'id',
      attributeValue: id
    });

    if (!rowBefore) {
      throw throwError(`can't get the user ${id}.`, 412);
    }

    if (isEmptyObject(objectToUpdate)) return rowBefore;

    const { knex } = this.app;
    await knex(tableName)
      .update(objectToUpdate)
      .where({ id });

    const rowAfter = await this.getOne({
      tableName,
      attributeName: 'id',
      attributeValue: id
    });

    return rowAfter;
  }

  async deleteOne ({ tableName, id }) {
    const rowBefore = await this.getOne({
      tableName,
      attributeName: 'id',
      attributeValue: id
    });

    if (!rowBefore) {
      throw throwError(`can't get the ${tableName} ${id}.`, 412);
    }

    const { knex } = this.app;
    await knex(tableName)
      .where({ id })
      .delete();

    return rowBefore;
  }
}

module.exports = {
  Controller
};
