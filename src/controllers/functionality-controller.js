const { Controller } = require('./controller');

class FunctionalityController extends Controller {
  constructor ({ app }) {
    super({ app });
  }

  async getAllFunctionalities () {
    const functionalities = await this.getAll({
      tableName: 'Functionality'
    });

    return functionalities;
  }
};

module.exports = {
  FunctionalityController
};
