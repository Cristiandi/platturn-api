const {
  createSchema
} = require('./schemas');
const { CompanyController } = require('../../../controllers/company-controller');

const companyRoutes = async (app, options) => {
  const { reqAuthPreHandler } = app;
  if (!reqAuthPreHandler) throw new Error(`can't get .reqAuthPreHandler from app.`);

  const companyController = new CompanyController({ app });

  // create a company
  app.post('/', { schema: createSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const { body, user: { id: userId } } = request;

    const createdCompany = await companyController.createCompany({ company: { ...body, userId } });

    return createdCompany;
  });
};

module.exports = companyRoutes;
