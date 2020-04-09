const fastifyPlugin = require('fastify-plugin')

const { firebaseAdminService } = require('../services/firebase-admin')

const firebaseAdminPlugin = async (server, options = {}) => {
  server.decorate('firebaseAdminService', firebaseAdminService)
}

module.exports = fastifyPlugin(firebaseAdminPlugin)
