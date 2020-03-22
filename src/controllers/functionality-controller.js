const { Controller } = require('./controller');
const { throwError } = require('../utils/functions');

class FunctionalityController extends Controller {
  constructor ({ app }) {
    super({ app });
  }

  async createFunctionality ({ functionality }) {
    const createdFunctionaty = await this.createOne({
      tableName: 'Functionality',
      objectToCreate: functionality
    });

    return createdFunctionaty;
  }

  async getAllFunctionalities () {
    const functionalities = await this.getAll({
      tableName: 'Functionality'
    });

    return functionalities;
  }

  async getOneFunctionality ({ attribute, value }) {
    if (!attribute || !value) {
      throw throwError(`attribute and value are needed`, 400);
    }

    const functionality = await this.getOne({
      tableName: 'Functionality',
      attributeName: attribute,
      attributeValue: value
    });

    return functionality;
  }

  async updateFunctionality ({ functionalityId, functionality }) {
    const updatedFunctionality = await this.updateOne({
      tableName: 'Functionality',
      id: functionalityId,
      objectToUpdate: functionality
    });

    return updatedFunctionality;
  }
};

module.exports = {
  FunctionalityController
};
