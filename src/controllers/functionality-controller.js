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

  async createFunctionality ({ functionality }) {
    const createdFunctionaty = await this.createOne({
      tableName: 'Functionality',
      objectToCreate: functionality
    });

    return createdFunctionaty;
  }
};

module.exports = {
  FunctionalityController
};
