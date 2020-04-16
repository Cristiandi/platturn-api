const { Controller } = require('./Controller.controller')
const { throwError } = require('../utils/functions')

class RouteControllor extends Controller {
  constructor ({ app }) {
    super({ app })
  }

  async createRoute ({ route }) {
    const result = await this.canCreateRoute({ route })
    if (!result.can) {
      throw throwError(result.message, 412)
    }

    const createdRoute = await this.createOne({
      tableName: 'Route',
      objectToCreate: route
    })

    return createdRoute
  }

  /**
   * function to get all the routes
   *
   * @param {{
   * attribute: string,
   * value: string
   * }} { attribute, value }
   * @returns {Promise<{ id: number }[]>} routes array
   * @memberof RouteControllor
   */
  async getAllRoutes ({ attribute, value }) {
    const { knex } = this.app

    let query = knex.select('*')
      .from('Route')

    if (attribute) {
      query = query.where({ [attribute]: value })
    }

    query = query.orderBy('path', 'desc')

    const routes = await query

    return routes
  }

  async getOneRoute ({ attribute, value }) {
    const route = await this.getOne({
      tableName: 'Route',
      attributeName: attribute,
      attributeValue: value
    })

    return route
  }

  async updateRoute ({ routeId, route }) {
    const result = await this.canUpdateRoute({ routeId, route })
    if (!result.can) {
      throw throwError(result.message, 412)
    }

    const updatedRoute = await this.updateOne({
      id: routeId,
      tableName: 'Route',
      objectToUpdate: route
    })

    return updatedRoute
  }

  async deleteRoute ({ routeId }) {
    const result = await this.canDeleteRoute({ routeId })
    if (!result.can) {
      throw throwError(result.message, 412)
    }

    const deletedRoute = await this.deleteOne({
      tableName: 'Route',
      id: routeId
    })

    return deletedRoute
  }

  async canCreateRoute ({ route = {} }) {
    const { knex } = this.app
    const { routes } = (await knex('Route')
      .count('id', { as: 'routes' })
      .where({
        httpMethod: route.httpMethod,
        path: route.path
      }))[0]

    if (routes) {
      return {
        can: false,
        message: `already exists a route with the httpMethod ${route.httpMethod} and the path ${route.path}.`
      }
    }

    return {
      can: true,
      message: null
    }
  }

  async canUpdateRoute ({ routeId, route = {} }) {
    const { knex } = this.app

    const data = await knex.select('*')
      .from('Route')
      .where({
        httpMethod: route.httpMethod || null,
        path: route.path || null
      })

    if (!data.length) {
      return {
        can: true,
        message: null
      }
    }

    const [routeFor] = data

    if (routeId !== routeFor.id) {
      return {
        can: false,
        message: `already exists a route with the httpMethod ${route.httpMethod} and the path ${route.path}.`
      }
    }

    return {
      can: true,
      message: null
    }
  }

  async canDeleteRoute ({ routeId }) {
    const { knex } = this.app
    const { routes } = (await knex('FunctionalityRoute')
      .count('id', { as: 'routes' })
      .where({
        routeId
      }))[0]

    if (routes) {
      return {
        can: false,
        message: 'route has functionalities.'
      }
    }

    return {
      can: true,
      message: null
    }
  }

  /**
   * function to know if and array of roles can acess or not to the route
   *
   * @param {{
   * routeId: number,
   * roleIds: number[]
   * }} { routeId, roleIds = [] }
   * @returns {Promise<boolean>} flag that indicates if can access to the route or not
   * @memberof RouteControllor
   */
  async canAccessToRoute ({ routeId, roleIds = [] }) {
    const { knex } = this.app

    const query = knex.select('R2.id')
      .from('Role as R')
      .innerJoin('FunctionalityRole as FR', 'R.id ', '=', 'FR.roleId')
      .innerJoin('Functionality as F', 'FR.functionalityId', '=', 'F.id')
      .innerJoin('FunctionalityRoute as FR2', 'F.id', '=', 'FR2.functionalityId')
      .innerJoin('Route as R2', 'FR2.routeId', '=', 'R2.id')
      .whereIn('R.id', roleIds)
      .andWhere('FR.allowed', '=', true)
      .andWhere('R2.id', '=', routeId)

    // this.app.log.info('query', query.toString());
    const data = await query

    // this.app.log.info('roleIds', roleIds);
    // this.app.log.info('routeId', routeId);
    // this.app.log.info('data', data);

    return data.length > 0
  }
};

module.exports = {
  RouteControllor
}
