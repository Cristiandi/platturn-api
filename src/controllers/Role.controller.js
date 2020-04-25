const { Controller } = require('./Controller.controller')
const { throwError } = require('../utils/functions')

class RoleController extends Controller {
  constructor ({ app }) {
    super({ app })
  }

  async getOneRole ({ attribute, value }) {
    if (!attribute || !value) {
      throw throwError('attribute and value are needed', 400)
    }

    const role = await this.getOne({
      tableName: 'Role',
      attributeName: attribute,
      attributeValue: value
    })

    return role
  }
}

module.exports = {
  RoleController
}
