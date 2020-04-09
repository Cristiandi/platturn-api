const fastifyPlugin = require('fastify-plugin')

const { firebaseService } = require('../services/firebase')

const firebasePlugin = async (app, options = {}) => {
  app.decorate('firebaseService', firebaseService)
}

module.exports = fastifyPlugin(firebasePlugin)
