const { Controller } = require('./controller')
const { throwError } = require('../utils/functions')

class ParameterController extends Controller {
  constructor ({ app }) {
    super({ app })
  }

  /**
   * function to get the value of a parameter
   *
   * @param {{ name: string, message: string, statusCode: number }} { name, message = undefined, statusCode = undefined }
   * @returns {Promise<string>} value of the parameter
   * @memberof ParameterController
   */
  async getParameterValue ({ name, message = undefined, statusCode = undefined }) {
    const parameter = await this.getOne({
      tableName: 'Parameter',
      attributeName: 'name',
      attributeValue: name
    })

    if (!parameter) {
      throw throwError(
        message || `can't get parameter with name ${name}.`,
        statusCode
      )
    }

    return parameter.value
  }
}

module.exports = {
  ParameterController
}
