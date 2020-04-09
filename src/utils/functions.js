const hbs = require('handlebars')
const mjml2html = require('mjml')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const { KEY_TO_CRYP } = require('../environment')

const isEmptyObject = (obj) => {
  return !Object.keys(obj).length
}

function Class (options) {
  this.options = options
}

function createFactoryBuilder (options) {
  // modify the options here if you want
  return new Class(options)
}

/**
 * function to return an error object
 *
 * @param {String} errorMessage message to the error
 * @param {Number} statusCode status for the error
 * @returns {Error} object with the informationof the error
 */
const throwError = (errorMessage, statusCode = 500) => {
  const err = new Error()
  err.message = errorMessage
  err.statusCode = statusCode

  return err
}

/**
 * function to get something from the object path when the object is parsed.
 *
 * @param {object} [object={}]
 * @param {string} [path='']
 * @returns {any}
 */
const getFromObjectPath = (object = {}, path = '') => {
  const keysToEvaluete = path.split('.')

  let iteraingObject = object
  for (const key of keysToEvaluete) {
    iteraingObject = iteraingObject[key]
    if (!iteraingObject) return
  }
  return iteraingObject
}

/**
 * function to generate the html from a template and its parameters
 *
 * @param {string} templateName name of the template inside email-templates folder
 * @param {object} parameters parametes used to reder the template
 * @param {object} [helpers=undefined] functions to be registred as helpers for the template
 * @returns {string} html generated
 */
const generateHtmlByTemplate = (templateName, parameters, helpers = undefined, isReport = false) => {
  // get the path of the template
  const filePath = isReport ? `../templates/reports/${templateName}.hbs` : `../templates/emails/${templateName}.mjml`
  const templatePath = path.resolve(__dirname, filePath)

  // compile the template
  const template = hbs.compile(fs.readFileSync(templatePath, 'utf8'))

  if (helpers) {
    for (const helper of helpers) {
      hbs.registerHelper(helper.name, helper.function)
    }
  }

  // get the result
  const result = template(parameters)

  // get the html
  const html = isReport ? result : mjml2html(result).html

  return html
}

const encrypt = data => {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-ccm', Buffer.from(KEY_TO_CRYP), iv)
  let encrypted = cipher.update(data)
  encrypted = Buffer.concat([encrypted, cipher.final()])

  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex')
  }
}

const decrypt = data => {
  const iv = Buffer.from(data.iv, 'hex')
  const encryptedText = Buffer.from(data.encryptedData, 'hex')
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(KEY_TO_CRYP), iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])

  return decrypted.toString()
}

module.exports = {
  isEmptyObject,
  createFactoryBuilder,
  throwError,
  getFromObjectPath,
  generateHtmlByTemplate,
  encrypt,
  decrypt
}
