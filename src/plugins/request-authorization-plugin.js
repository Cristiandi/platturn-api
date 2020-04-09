const fastifyPlugin = require('fastify-plugin')

const requestAuthorizationPlugin = async (app, options = {}) => {
  const requestAuthorization = require('../routes/pre-handlers/request-authorization').requestAuthorization(app)

  app.decorate('reqAuthPreHandler', requestAuthorization)
}

module.exports = fastifyPlugin(requestAuthorizationPlugin)
