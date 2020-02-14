const fastify = require('fastify');
const cors = require('cors');

const { NODE_ENV, APP_PORT } = require('./environment');
const { createFactoryBuilder } = require('./utils/functions');

const app = fastify({
  bodyLimit: 1048576 * 2,
  logger: { prettyPrint: true }
});

// plugins
app.register(require('./plugins/knex-db-connector'), {});
app.register(require('./plugins/firebase-admin-service'), {});
app.register(require('./plugins/firebase-service', {}));
app.register(require('./plugins/request-authorization-pre-handler', {}));
app.register(require('./routes/api'), { prefix: 'api' });

// hooks
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
app.use(cors());

// use the factory pattern to get the app
const { options: { app: fbApp } } = createFactoryBuilder({ app });

// Run the server!
fbApp.listen(process.env.PORT || APP_PORT, '0.0.0.0', (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  app.log.info(`${NODE_ENV} | server listening on ${address}`);

  process.on('SIGINT', () => app.close());
  process.on('SIGTERM', () => app.close());
});
