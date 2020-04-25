const { Controller } = require('./Controller.controller')
const { FunctionalityController } = require('./Functionality.controller')
const { RouteControllor } = require('./Route.controller')
const { throwError } = require('../utils/functions')

class FunctionalityRouteController extends Controller {
  constructor ({ app }) {
    super({ app })
  }

  /**
   * function to create a functionality route
   *
   * @param {{ functionalityRoute: object }} { functionalityRoute = {} }
   * @returns {Promise<object>} created
   * @memberof FunctionalityRouteController
   */
  async createFunctionalityRoute ({ functionalityRoute = {} }) {
    const result = await this.canCreate({ functionalityRoute })
    if (!result.can) {
      throw throwError(result.message, 412)
    }

    const createdFunctionalityRoute = await this.createOne({
      tableName: 'FunctionalityRoute',
      objectToCreate: functionalityRoute
    })

    return createdFunctionalityRoute
  }

  /**
   * function to get all
   *
   * @param {{ attribute: object, value: string }} { attribute, value }
   * @returns {Promise<{ id: number }[]>} object array
   * @memberof FunctionalityRouteController
   */
  async getAllFunctionalitiesRoutes ({ attribute, value }) {
    const { knex } = this.app

    let query = knex.column(
      'FR.id',
      'R.id as routeId',
      'R.httpMethod as routeMethod',
      'R.path as routePath',
      'F.id as functionalityId',
      'F.name as functionality'
    )
      .from('FunctionalityRoute as FR')
      .innerJoin('Route as R', 'FR.routeId', '=', 'R.id')
      .innerJoin('Functionality as F', 'FR.functionalityId', '=', 'F.id')

    if (attribute) {
      query = query.where({ [attribute]: value })
    }

    query = query.orderBy('path', 'desc')

    const functionalitiesRoutes = await query

    return functionalitiesRoutes
  }

  async updateFunctionalityRoute ({ functionalityRouteId, functionalityRoute = {} }) {
    const updatedFunctionalityRoute = await this.updateOne({
      id: functionalityRouteId,
      tableName: 'FunctionalityRoute',
      objectToUpdate: functionalityRoute
    })

    return updatedFunctionalityRoute
  }

  async deleteFunctionalityRoute ({ functionalityRouteId }) {
    const deletedFunctionalityRoute = await this.deleteOne({
      id: functionalityRouteId,
      tableName: 'FunctionalityRoute'
    })

    return deletedFunctionalityRoute
  }

  /**
   * function to check if it's possible to create a functionality route
   *
   * @param {{ functionalityRoute: object }} { functionalityRoute = {} }
   * @returns {Promise<{ can: boolean, message: string }>} object
   * @memberof FunctionalityRouteController
   */
  async canCreate ({ functionalityRoute = {} }) {
    const { functionalityId, routeId } = functionalityRoute
    if (!functionalityId || !routeId) {
      throw throwError('functionalityId or routeId are missing.', 412)
    }

    const functionalityController = new FunctionalityController({ app: this.app })
    const functionality = await functionalityController.getOneFunctionality({
      attribute: 'id',
      value: functionalityId
    })
    if (!functionality) throw throwError(`can't get the functionality ${functionalityId}.`, 412)

    const routeController = new RouteControllor({ app: this.app })
    const route = await routeController.getOneRoute({
      attribute: 'id',
      value: routeId
    })
    if (!route) throw throwError(`can't get the route ${routeId}.`, 412)

    const { knex } = this.app
    const query = knex.select('*')
      .from('FunctionalityRoute')
      .where({
        functionalityId,
        routeId
      })

    const data = await query

    if (data.length) {
      return {
        can: false,
        message: `already exists a functionality route for the functionality ${functionalityId} and the route ${routeId}.`
      }
    }

    return {
      can: true,
      message: null
    }
  }

  /**
   * functio to check if it's possible to update a functionality route
   *
   * @param {{ functionalityRouteId: number }} { functionalityRouteId, functionalityRoute = {} }
   * @returns
   * @memberof FunctionalityRouteController
   */
  async canUpdate ({ functionalityRouteId, functionalityRoute = {} }) {
    const { knex } = this.app

    const data = await knex.select('*')
      .from('FunctionalityRoute')
      .where({
        functionalityId: functionalityRoute.functionalityId || null,
        routeId: functionalityRoute.routeId || null
      })

    if (!data.length) {
      return {
        can: true,
        message: null
      }
    }

    const [funcRouteFor] = data

    if (functionalityRouteId !== funcRouteFor.id) {
      return {
        can: false,
        message: `already exists a functionality route with the functionalityId ${functionalityRoute.functionalityId} and the route ${functionalityRoute.routeId}.`
      }
    }

    return {
      can: true,
      message: null
    }
  }
}

module.exports = {
  FunctionalityRouteController
}
