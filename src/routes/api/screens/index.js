const { ScreenController } = require('../../../controllers/screen-controller')
const {
  getAllSchema,
  createSchema,
  updateSchema,
  deleteSchema
} = require('./schemas')

const screensRoutes = async (app, options) => {
  const { reqAuthPreHandler } = app
  if (!reqAuthPreHandler) throw new Error('can\'t get .reqAuthPreHandler from app.')

  const screenController = new ScreenController({ app })

  // get all screens
  app.get('/', { schema: getAllSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const screens = await screenController.getAllScreens({})
    return screens
  })

  // create screen
  app.post('/', { schema: createSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const { body } = request

    const created = await screenController.createScreen({
      screen: body
    })

    return { ...created, message: 'screen created!' }
  })

  // update screen
  app.patch('/:screenId', { schema: updateSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const { params: { screenId }, body } = request

    const updated = await screenController.updateScreen({ screenId, screen: body })

    return { ...updated, message: 'screen updated!' }
  })

  // delete screen
  app.delete('/:screenId', { schema: deleteSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const { params: { screenId } } = request

    const deleted = await screenController.deleteScreen({ screenId })

    return { ...deleted, message: 'screen deleted.' }
  })
}

module.exports = screensRoutes
