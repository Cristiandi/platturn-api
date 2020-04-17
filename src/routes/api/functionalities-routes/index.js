const { FunctionalityRouteController } = require('../../../controllers/FunctionalityRoute.controller')
const {
  createSchema,
  getAllSchema,
  updateSchema,
  deleteSchema
} = require('./schemas')

const functionalityRouteRoutes = async (app, options) => {
  const { reqAuthPreHandler } = app
  if (!reqAuthPreHandler) throw new Error('can\'t get .reqAuthPreHandler from app.')

  const functionalityRouteController = new FunctionalityRouteController({ app })

  // create one
  app.post('/', { schema: createSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const { body } = request

    const created = await functionalityRouteController.createFunctionalityRoute({
      functionalityRoute: body
    })

    return created
  })

  // get all
  app.get('/', { schema: getAllSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const functionalitiesRoles = await functionalityRouteController.getAllFunctionalitiesRoutes({})

    return functionalitiesRoles
  })

  // update one
  app.patch('/:id', { schema: updateSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const { params: { id }, body } = request
    return { id, body }
  })

  // delete one
  app.delete('/:id', { schema: deleteSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const { params: { id }, body } = request
    return { id, body }
  })
}

module.exports = functionalityRouteRoutes
