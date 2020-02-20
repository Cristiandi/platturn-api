const { UserController } = require('../../../controllers/user-controller');
const { throwError } = require('../../../utils/functions');
const {
  createSchema,
  getOneSchema,
  loginSchema,
  sendConfirmationEmailSchema,
  confirmEmailAddressSchema
} = require('./schemas');

const userRoutes = async (app, options) => {
  const { reqAuthPreHandler } = app;
  if (!reqAuthPreHandler) throw new Error(`can't get .reqAuthPreHandler from app.`);

  const userController = new UserController({ app });

  // create
  app.post('/', { schema: createSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const { body } = request;

    app.log.info('body', body);

    const created = await userController.createUser({ user: body });
    return reply.code(201).send(created);
  });

  // get one
  app.get('/:userId', { schema: getOneSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const { params: { userId } } = request;

    app.log.info('-----------');
    app.log.info('userId', userId);
    app.log.info('-----------');

    const user = await userController.getOneUser({ attribute: 'id', value: userId });

    if (!user) {
      throw throwError(`can't get the user ${userId}.`, 412);
    }

    return user;
  });

  // login
  app.post('/login', { schema: loginSchema }, async (request, reply) => {
    const { body } = request;

    app.log.info('body', body);

    const result = await userController.login({ email: body.email, password: body.password });
    return result;
  });

  // send confirmation email
  app.post('/send-confimation-email/:authUid', { schema: sendConfirmationEmailSchema }, async (request, reply) => {
    const { params: { authUid } } = request;

    await userController.sendConfirmationEmail({ authUid });

    return reply.code(200).send();
  });

  // confirm email
  app.get('/confirm-email-address/:code', { schema: confirmEmailAddressSchema }, async (request, reply) => {
    const { params: { code } } = request;

    const { redirectUrl } = await userController.confirmEmailAddress({ code });

    return reply.redirect(redirectUrl);
  });
};

module.exports = userRoutes;
