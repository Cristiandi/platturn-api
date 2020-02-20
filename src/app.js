const fastify = require('fastify');
const { NODE_ENV, APP_PORT } = require('./environment');

function buildApp () {
  const app = fastify({
    bodyLimit: 1048576 * 2,
    logger: { prettyPrint: true }
  });

  // plugins
  app.register(require('./plugins/knex-db-connector-plugin'), {});
  app.register(require('./plugins/firebase-admin-plugin'), {});
  app.register(require('./plugins/firebase-plugin', {}));
  app.register(require('./plugins/request-authorization-plugin', {}));
  app.register(require('./plugins/mailer-plugin', {}));
  // using helmet as plugin with fastify-helmet
  app.register(
    require('fastify-helmet'),
    // Example of passing an option to x-powered-by middleware
    { hidePoweredBy: { setTo: 'PHP 4.2.0' } }
  );

  // hooks
  app.addHook('preValidation', async (request, reply) => {
    // Some code
    const { req: { url } } = request;
    if (url.startsWith('/api/documentation')) {
      const { reqAuthPreHandler } = app;
      await reqAuthPreHandler(request, reply);
    }
  });
  app.addHook('onClose', (instance, done) => {
    const { knex, firebaseAdminService } = instance;
    knex.destroy(async () => {
      instance.log.info('knex pool destroyed.');

      await firebaseAdminService.deleteApp();
      instance.log.info('firebase app deleted.');

      done();
    });
  });

  // middlewares
  app.use(require('cors')());

  // services
  app.get('/', (require, reply) => reply.redirect('/api'));
  app.register(require('./routes/api'), { prefix: 'api' });

  // Run the server!
  app.listen(process.env.PORT || APP_PORT, '0.0.0.0', (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }

    app.log.info(`${NODE_ENV} | server listening on ${address}`);

    process.on('SIGINT', () => app.close());
    process.on('SIGTERM', () => app.close());
  });

  return app;
}

module.exports = buildApp();
