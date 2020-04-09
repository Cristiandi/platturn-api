const { RouteControllor } = require('../../../controllers/route-controller.js')
const {
  getAllSchema
} = require('./schemas')

const routeRoutes = async (app, options) => {
  const { reqAuthPreHandler } = app
  if (!reqAuthPreHandler) throw new Error('can\'t get .reqAuthPreHandler from app.')

  const routeController = new RouteControllor({ app })

  // get all plans
  app.get('/', { schema: getAllSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const routes = await routeController.getAllRoutes({})
    return routes
  })
}

module.exports = routeRoutes
