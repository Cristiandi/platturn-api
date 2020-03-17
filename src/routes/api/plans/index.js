const { PlanController } = require('../../../controllers/plan-controller');

const companyRoutes = async (app, options) => {
  const planController = new PlanController({ app });

  // get all plans
  app.get('/', async (request, reply) => {
    const plans = await planController.getAllPlans();
    return plans;
  });
};

module.exports = companyRoutes;
