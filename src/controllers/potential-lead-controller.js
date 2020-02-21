const { Controller } = require('./controller');
const { throwError, generateHtmlByTemplate } = require('../utils/functions');
const { ParameterController } = require('./parameter-controller');

class PotentialLeadController extends Controller {
  constructor ({ app }) {
    super({ app });

    const { mailerService } = this.app;

    if (!mailerService) {
      throw new Error('cant get .mailerService from fastify app.');
    }
  }

  async createPotentialLead ({ potentialLead }) {
    const { email } = potentialLead;

    const existingPotentialLead = await this.getOnePotentialLead({
      attribute: 'email',
      value: email
    });

    if (existingPotentialLead) {
      throw throwError(`a potential lead already exists for the email ${email}.`, 412);
    }

    const createdPotentialLead = await this.createOne({
      tableName: 'PotentialLead',
      objectToCreate: potentialLead
    });

    this.sendPotentialLeadEmail({ email });

    return createdPotentialLead;
  }

  async getOnePotentialLead ({ attribute, value }) {
    if (!attribute || !value) {
      throw throwError(`attribute and value are needed`, 400);
    }

    const user = await this.getOne({
      tableName: 'PotentialLead',
      attributeName: attribute,
      attributeValue: value
    });

    return user;
  }

  async sendPotentialLeadEmail ({ email }) {
    const potentialLead = await this.getOnePotentialLead({
      attribute: 'email',
      value: email
    });

    if (!potentialLead) {
      throw throwError(`can't get the potential lead with email ${email}.`, 412);
    }

    const parameterController = new ParameterController({ app: this.app });

    const WEB_BASE_URL = await parameterController.getParameterValue({ name: 'WEB_BASE_URL' });

    const { fullName } = potentialLead;

    const params = {
      potencialLead: {
        fullName
      },
      link: WEB_BASE_URL
    };

    const html = generateHtmlByTemplate('potential-lead', params);

    const POTENTIAL_LEAD_EMAIL_SUBJECT = await parameterController.getParameterValue({ name: 'POTENTIAL_LEAD_EMAIL_SUBJECT' });

    const { mailerService } = this.app;
    const { messageId } = await mailerService.sendMail(
      [email],
      html,
      POTENTIAL_LEAD_EMAIL_SUBJECT,
      'awork-team'
    );

    return messageId;
  }
};

module.exports = {
  PotentialLeadController
};
