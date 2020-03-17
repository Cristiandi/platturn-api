const { Controller } = require('./controller');

class PlanController extends Controller {
  constructor ({ app }) {
    super({ app });
  }

  async getAllPlans () {
    const plans = await this.getAll({
      tableName: 'Plan'
    });

    return plans;
  }
};

module.exports = {
  PlanController
};
