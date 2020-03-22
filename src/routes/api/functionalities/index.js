const { FunctionalityController } = require('../../../controllers/functionality-controller');
const {
  getAllSchema,
  createSchema,
  updateSchema
} = require('./schemas');

const functionalityRoutes = async (app, options) => {
  const { reqAuthPreHandler } = app;
  if (!reqAuthPreHandler) throw new Error(`can't get .reqAuthPreHandler from app.`);

  const functionalityController = new FunctionalityController({ app });

  // get all plans
  app.get('/', { schema: getAllSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const functionalities = await functionalityController.getAllFunctionalities();
    return functionalities;
  });

  app.post('/', { schema: createSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const { body } = request;

    const createdFunctionality = await functionalityController.createFunctionality({
      functionality: body
    });

    return { ...createdFunctionality, message: 'functionality created!' };
  });

  app.patch('/:functionalityId', { schema: updateSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const { params: { functionalityId }, body } = request;

    app.log.info('----------------');
    app.log.info('body', body);
    app.log.info('----------------');

    const updated = await functionalityController.updateFunctionality({ functionalityId, functionality: body });

    return { ...updated, message: 'functionality updated!' };
  });
};

module.exports = functionalityRoutes;
