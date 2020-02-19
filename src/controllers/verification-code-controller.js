const joi = require('@hapi/joi');
const uid = require('uid-safe');

const { Controller } = require('./controller');

class VerificationCodeController extends Controller {
  constructor ({ app }) {
    super({ app });
  }

  /**
   *
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
    });

    await schema.validateAsync(verificationCodeObj);

    const objectToCreate = { code: uid.sync(5), ...verificationCodeObj };

    this.app.log.warn('date', objectToCreate.expirationDate);

    const created = this.createOne({ tableName: 'VerificationCode', objectToCreate });

    return created;
  }
}

module.exports = {
  VerificationCodeController
};
