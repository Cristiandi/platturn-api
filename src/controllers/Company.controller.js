const { Controller } = require('./Controller.controller')
const { throwError, isEmptyObject } = require('../utils/functions')

class CompanyController extends Controller {
  constructor ({ app }) {
    super({ app })
  }

  /**
   * function to create a company
   *
   * @param {{ company: object }} { company }
   * @returns {Promise<{id: number}>} created company
   * @memberof CompanyController
   */
  async createCompany ({ company }) {
    const { code } = company

    const existingCompany = await this.getOneCompany({
      attribute: 'code',
      value: code
    })

    if (existingCompany) {
      throw throwError(`a company already exists for the code ${code}.`, 412)
    }

    const existingCompanyForUser = await this.getOneCompany({
      attribute: 'userId',
      value: company.userId
    })

    if (existingCompanyForUser) {
      throw throwError('the user already had created a company.', 412)
    }

    const createdCompany = await this.createOne({
      tableName: 'Company',
      objectToCreate: company
    })

    return createdCompany
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
      throw throwError('attribute and value are needed', 400)
    }

    const user = await this.getOne({
      tableName: 'Company',
      attributeName: attribute,
      attributeValue: value
    })

    return user
  }

  /**
   * function to update a company
   *
   * @param {{ loggedUserId: number, companyId: number, company: object }} { loggedUserId, companyId, company }
   * @returns
   * @memberof CompanyController
   */
  async updatecompany ({ loggedUserId, companyId, company }) {
    // get the company
    const currentCompany = await this.getOneCompany({
      attribute: 'id',
      value: companyId
    })

    // check
    if (!currentCompany) {
      throw throwError(`can't the company ${companyId}`, 412)
    }
    if (currentCompany.userId !== loggedUserId) {
      throw throwError(`the user can't update the company ${companyId}`, 412)
    }

    if (isEmptyObject(company)) return currentCompany

    const { email } = company
    if (email) {
      const existingCompanyForEmail = await this.getOneCompany({
        attribute: 'email',
        value: email
      })
      if (existingCompanyForEmail && currentCompany.id !== existingCompanyForEmail.id) {
        throw throwError(`the email ${email} is already used.`, 412)
      }
    }

    const updatedCompany = this.updateOne({
      tableName: 'Company',
      id: companyId,
      objectToUpdate: company
    })

    return updatedCompany
  }
}

module.exports = {
  CompanyController
}
