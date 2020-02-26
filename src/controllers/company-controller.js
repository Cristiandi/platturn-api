const { Controller } = require('./controller');
const { throwError } = require('../utils/functions');

class CompanyController extends Controller {
  constructor ({ app }) {
    super({ app });
  }

  /**
   * function to create a company
   *
   * @param {{ company: object }} { company }
   * @returns {Promise<{id: number}>} created company
   * @memberof CompanyController
   */
  async createCompany ({ company }) {
    const { code } = company;

    const existingCompany = await this.getOneCompany({
      attribute: 'code',
      value: code
    });

    if (existingCompany) {
      throw throwError(`a company already exists for the code ${code}.`, 412);
    }

    const createdCompany = await this.createOne({
      tableName: 'Company',
      objectToCreate: company
    });

    return createdCompany;
  }

  /**
   * function to get a company
   *
   * @param {{ attribute: string, value: string }} { attribute, value }
   * @returns
   * @memberof CompanyController
   */
  async getOneCompany ({ attribute, value }) {
    if (!attribute || !value) {
      throw throwError(`attribute and value are needed`, 400);
    }

    const user = await this.getOne({
      tableName: 'Company',
      attributeName: attribute,
      attributeValue: value
    });

    return user;
  }
}

module.exports = {
  CompanyController
};
