const oas = require('fastify-swagger');

const apiRoutes = async (app, options) => {
  app.register(oas, require('../docs'));
  app.register(require('./users'), { prefix: 'users' });
  app.register(require('./potential-leads'), { prefix: 'potential-leads' });
  app.get('/', { schema: { hide: true } }, async (request, reply) => {
    return { hello: 'world' };
  });
};

module.exports = apiRoutes;
