const {
  createSchema,
  getUserCompanies,
  updateSchema
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

  // get the companies for a user
  app.get('/get-user-companies', { schema: getUserCompanies, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const { user: { id: userId } } = request;

    const company = await companyController.getOneCompany({
      attribute: 'userId',
      value: userId
    });

    return company ? [company] : [];
  });

  app.patch('/:companyId', { schema: updateSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const { body, user: { id: userId }, params: { companyId } } = request;

    const updatedCompany = await companyController.updatecompany({
      loggedUserId: userId,
      companyId,
      company: body
    });

    return updatedCompany;
  });
};

module.exports = companyRoutes;
