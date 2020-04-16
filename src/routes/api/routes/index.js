const { RouteControllor } = require('../../../controllers/Route.controller.js')
const {
  getAllSchema,
  createSchema,
  updateSchema,
  deleteSchema
} = require('./schemas')

const routeRoutes = async (app, options) => {
  const { reqAuthPreHandler } = app
  if (!reqAuthPreHandler) throw new Error('can\'t get .reqAuthPreHandler from app.')

  const routeController = new RouteControllor({ app })

  // create a route
  app.post('/', { schema: createSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const { body } = request

    const createdRoute = routeController.createRoute({ route: body })

    return createdRoute
  })

  // get all routes
  app.get('/', { schema: getAllSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const routes = await routeController.getAllRoutes({})
    return routes
  })

  // update a route
  app.patch('/:routeId', { schema: updateSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const { params: { routeId }, body } = request

    const updatedRoute = routeController.updateRoute({ routeId, route: body })

    return updatedRoute
  })

  // delete a route
  app.delete('/:routeId', { schema: deleteSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const { params: { routeId } } = request

    const deletedRoute = await routeController.deleteRoute({ routeId })

    return deletedRoute
  })
}

module.exports = routeRoutes
