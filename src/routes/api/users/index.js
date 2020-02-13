const { UserController } = require('../../../controllers/user');
const { createSchema, loginSchema } = require('./schemas');

const userRoutes = async (app, options) => {
  const userController = new UserController(app);

  // create
  app.post('/', { schema: createSchema }, async (request, reply) => {
    const { body } = request;

    app.log.info('body', body);

    const created = await userController.createUser({ user: body });
    return reply.code(201).send(created);
  });

  // login
  app.post('/login', { schema: loginSchema }, async (request, reply) => {
    const { body } = request;

    app.log.info('body', body);

    const result = await userController.login({ email: body.email, password: body.password });
    return result;
  });
};

module.exports = userRoutes;