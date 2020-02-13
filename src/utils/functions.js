const isEmptyObject = (obj) => {
  return !Object.keys(obj).length;
};

function Class (options) {
  this.options = options;
}

function createFactoryBuilder (options) {
  // modify the options here if you want
  return new Class(options);
}

/**
 * function to return an error object
 *
 * @param {String} errorMessage message to the error
 * @param {Number} statusCode status for the error
 * @returns {Error} object with the informationof the error
 */
const throwError = (errorMessage, statusCode = 500) => {
  const err = new Error();
  err.message = errorMessage;
  err.statusCode = statusCode;

  return err;
};

/**
 * function to get something from the object path when the object is parsed.
 *
 * @param {object} [object={}]
 * @param {string} [path='']
 * @returns {any}
 */
const getFromObjectPath = (object = {}, path = '') => {
  const keysToEvaluete = path.split('.');

  let iteraingObject = object;
  for (const key of keysToEvaluete) {
    iteraingObject = iteraingObject[key];
    if (!iteraingObject) return;
  }
  return iteraingObject;
};

module.exports = {
  isEmptyObject,
  createFactoryBuilder,
  throwError,
  getFromObjectPath
};
