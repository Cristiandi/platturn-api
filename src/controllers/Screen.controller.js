const { Controller } = require('./Controller.controller')
const { throwError } = require('../utils/functions')

class ScreenController extends Controller {
  constructor ({ app }) {
    super({ app })
  }

  async createScreen ({ screen }) {
    const createdScreen = await this.createOne({
      tableName: 'Screen',
      objectToCreate: screen
    })

    return createdScreen
  }

  /**
   * function to get all the screens
   *
   * @param {{
    * attribute: string,
    * value: string
    * }} { attribute, value }
    * @returns {Promise<{ id: number }[]>} screens array
    * @memberof RouteControllor
    */
  async getAllScreens ({ attribute, value }) {
    const { knex } = this.app

    const query = knex.select('S.*', 'F.name as functionality')
      .from('Screen as S')
      .innerJoin('Functionality as F', 'S.functionalityId', '=', 'F.id')

    const data = await query

    return data
  }

  async getOneScreen ({ attribute, value }) {
    if (!attribute || !value) {
      throw throwError('attribute and value are needed', 400)
    }

    const functionality = await this.getOne({
      tableName: 'Screen',
      attributeName: attribute,
      attributeValue: value
    })

    return functionality
  }

  async updateScreen ({ screenId, screen }) {
    const updatedScreen = await this.updateOne({
      tableName: 'Screen',
      id: screenId,
      objectToUpdate: screen
    })

    return updatedScreen
  }

  async deleteScreen ({ screenId }) {
    const deletedScreen = await this.deleteOne({
      tableName: 'Screen',
      id: screenId
    })

    return deletedScreen
  }
}

module.exports = {
  ScreenController
}
