const joi = require('@hapi/joi')
const uid = require('uid-safe')
const moment = require('moment')

const { Controller } = require('./controller')
const { throwError } = require('../utils/functions')

class VerificationCodeController extends Controller {
  constructor ({ app }) {
    super({ app })
  }

  /**
   * function to create a verification code row
   *
   * @param {{ verificationCodeObj: { userId: number, type: string, expirationDate: date }}} { verificationCodeObj }
   * @returns {Promise<{ id: number }>} created verification code object
   * @memberof VerificationCodeController
   */
  async createVerificationCode ({ verificationCodeObj }) {
    const schema = joi.object({
      userId: joi.number().required(),
      type: joi.string().uppercase().required(),
      expirationDate: joi.date().greater('now')
    })

    await schema.validateAsync(verificationCodeObj)

    const objectToCreate = { code: uid.sync(5), ...verificationCodeObj }

    this.app.log.warn('date', objectToCreate.expirationDate)

    const created = this.createOne({ tableName: 'VerificationCode', objectToCreate })

    return created
  }

  /**
   *
   *
   * @param {{ attribute: string, value: string }} { attribute, value }
   * @returns {Promise<{ id: number }>}
   * @memberof VerificationCodeController
   */
  async getOneVerificationCode ({ attribute, value }) {
    if (!attribute || !value) {
      throw throwError('attribute and value are needed', 400)
    }

    const verificationCode = await this.getOne({
      tableName: 'VerificationCode',
      attributeName: attribute,
      attributeValue: value
    })

    return verificationCode
  }

  /**
   * function to determinate if a code is valid or not
   *
   * @param {{ code: string, type: string }} { code }
   * @returns
   * @memberof VerificationCodeController
   */
  async validCode ({ code, type }) {
    const verificationCode = await this.getOneVerificationCode({ attribute: 'code', value: code })
    if (!verificationCode) {
      throw throwError('can\'t the verificarion code', 412)
    }

    if (type !== verificationCode.type) {
      throw throwError(`the type ${type} doesn't match with the code.`, 412)
    }

    const { expirationDate } = verificationCode

    const momentFromExpDate = moment(expirationDate).utc()
    const currentDate = moment().utc()

    return momentFromExpDate.isAfter(currentDate)
  }
}

module.exports = {
  VerificationCodeController
}
