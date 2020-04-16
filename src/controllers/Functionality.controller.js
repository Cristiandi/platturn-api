const { Controller } = require('./Controller.controller')
const { throwError } = require('../utils/functions')

class FunctionalityController extends Controller {
  constructor ({ app }) {
    super({ app })
  }

  async createFunctionality ({ functionality }) {
    const createdFunctionaty = await this.createOne({
      tableName: 'Functionality',
      objectToCreate: functionality
    })

    return createdFunctionaty
  }

  async getAllFunctionalities () {
    const functionalities = await this.getAll({
      tableName: 'Functionality'
    })

    return functionalities
  }

  async getOneFunctionality ({ attribute, value }) {
    if (!attribute || !value) {
      throw throwError('attribute and value are needed', 400)
    }

    const functionality = await this.getOne({
      tableName: 'Functionality',
      attributeName: attribute,
      attributeValue: value
    })

    return functionality
  }

  async updateFunctionality ({ functionalityId, functionality }) {
    const updatedFunctionality = await this.updateOne({
      tableName: 'Functionality',
      id: functionalityId,
      objectToUpdate: functionality
    })

    return updatedFunctionality
  }

  async canDeteleFunctionality ({ functionalityId }) {
    const { knex } = this.app
    const { screens } = (await knex('Screen')
      .count('id', { as: 'screens' })
      .where({ functionalityId }))[0]

    const { functionalityRoles } = (await knex('FunctionalityRole')
      .count('id', { as: 'functionalityRoles' })
      .where({ functionalityId }))[0]

    const { functionalityRoutes } = (await knex('FunctionalityRoute')
      .count('id', { as: 'functionalityRoutes' })
      .where({ functionalityId }))[0]

    if (screens > 0) {
      return {
        can: false,
        message: 'functionality has screens'
      }
    } else if (functionalityRoles > 0) {
      return {
        can: false,
        message: 'functionality has functionality-roles'
      }
    } else if (functionalityRoutes > 0) {
      return {
        can: false,
        message: 'functionality has functionality-routes'
      }
    }

    return {
      can: true,
      message: null
    }
  }

  async deleteFunctionality ({ functionalityId }) {
    const result = await this.canDeteleFunctionality({ functionalityId })

    if (!result.can) {
      throw throwError(result.message, 412)
    }

    const deletedFunctionality = await this.deleteOne({
      tableName: 'Functionality',
      id: functionalityId
    })

    return deletedFunctionality
  }
};

module.exports = {
  FunctionalityController
}
