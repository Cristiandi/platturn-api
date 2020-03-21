const { FunctionalityController } = require('../../../controllers/functionality-controller');
const { getAllSchema, createSchema } = require('./schemas');

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
};

module.exports = functionalityRoutes;
