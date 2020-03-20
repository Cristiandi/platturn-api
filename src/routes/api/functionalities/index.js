const { FunctionalityController } = require('../../../controllers/functionality-controller');
const { getAllSchema } = require('./schemas');

const functionalityRoutes = async (app, options) => {
  const { reqAuthPreHandler } = app;
  if (!reqAuthPreHandler) throw new Error(`can't get .reqAuthPreHandler from app.`);

  const functionalityController = new FunctionalityController({ app });

  // get all plans
  app.get('/', { schema: getAllSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const functionalities = await functionalityController.getAllFunctionalities();
    return functionalities;
  });
};

module.exports = functionalityRoutes;
