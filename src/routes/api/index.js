const oas = require('fastify-swagger')

const apiRoutes = async (app, options) => {
  app.register(oas, require('../docs'))
  app.register(require('./users'), { prefix: 'users' })
  app.register(require('./potential-leads'), { prefix: 'potential-leads' })
  app.register(require('./companies'), { prefix: 'companies' })
  app.register(require('./plans'), { prefix: 'plans' })
  app.register(require('./functionalities'), { prefix: 'functionalities' })
  app.register(require('./screens'), { prefix: 'screens' })
  app.register(require('./routes'), { prefix: 'routes' })
  app.get('/', { schema: { hide: true } }, async (request, reply) => {
    return { hello: 'world' }
  })
}

module.exports = apiRoutes
