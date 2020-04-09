const { Controller } = require('./controller')

class RouteControllor extends Controller {
  constructor ({ app }) {
    super({ app })
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
