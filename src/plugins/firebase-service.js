const fastifyPlugin = require('fastify-plugin');

const { firebaseService } = require('../services/firebase');

const firebasePlugin = async (server, options = {}) => {
  server.decorate('firebaseService', firebaseService);
};

module.exports = fastifyPlugin(firebasePlugin);
