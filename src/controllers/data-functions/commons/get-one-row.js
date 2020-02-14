const { throwError } = require('../../../utils/functions');

const getOneRow = app => async (tableName, fieldName, fieldValue, customMessage = undefined, customStatusCode = undefined) => {
  const { knex } = app;
  if (!knex) throw new Error(`can't get .knex from app`);

  const query = knex.select('*').from(tableName).where({ [fieldName]: fieldValue }).orderBy('id');

  const data = await query;
  if (!data.length) {
    const messageToTheError = customMessage || `can't get the ${tableName} row with ${fieldName} ${fieldValue}`;
    throw throwError(messageToTheError, customStatusCode);
  }

  return data[0];
};

module.exports = {
  getOneRow
};
