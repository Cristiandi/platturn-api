const moment = require('moment');

const { Controller } = require('./controller');
const { throwError, generateHtmlByTemplate } = require('../utils/functions');
const { VerificationCodeController } = require('../controllers/verification-code-controller');
const { ParameterController } = require('./parameter-controller');

class UserController extends Controller {
  /**
   * Creates an instance of UserController.
   * @param {object} app fastify app
   * @memberof UserController
   */
  constructor ({ app }) {
    super({ app });

    const { firebaseAdminService, firebaseService, mailerService } = this.app;
    if (!firebaseAdminService) {
      throw new Error('cant get .firebaseAdminService from fastify app.');
    }
    if (!firebaseService) {
      throw new Error('cant get .firebaseService from fastify app.');
    }
    if (!mailerService) {
      throw new Error('cant get .mailerService from fastify app.');
    }
  }

  /**
   * function to create an user
   *
   * @param {{ user: object }} { user }
   * @returns {Promise<{ id: number }>} created user
   * @memberof UserController
   */
  async createUser ({ user }) {
    this.app.log.info('user', user);
    const { email, password, phone, fullName, address, document } = user;

    const { firebaseAdminService } = this.app;

    const { uid: authUid } = await firebaseAdminService.createUser({ email, password, phone });
    this.app.log.info('authUid', authUid);
    const userObjec = {
      authUid,
      fullName,
      document,
      email,
      address,
      phone
    };

    const createdUser = await this.createOne({ tableName: 'User', objectToCreate: userObjec });

    return createdUser;
  }

  /**
   * function to get one
   *
   * @param {{ attribute: string, value: string }} { attribute, value }
   * @returns {Promise<{id: number}>} object
   * @memberof PersonService
   */
  async getOneUser ({ attribute, value }) {
    if (!attribute || !value) {
      throw throwError(`attribute and value are needed`, 400);
    }

    const user = await this.getOne({
      tableName: 'User',
      attributeName: attribute,
      attributeValue: value
    });

    return user;
  }

  async updateOneUser ({ id, user = {} }) {
    const updatedUser = await this.updateOne({
      tableName: 'User',
      id,
      objectToUpdate: user
    });

    return updatedUser;
  }

  /**
   * function to login
   *
   * @param {{ email: string, password: string }} { email, password }
   * @returns {Promise<object>}
   * @memberof UserController
   */
  async login ({ email, password }) {
    const { firebaseService } = this.app;

    // get the user
    const firebaseUser = await firebaseService.login({ email, password });

    // this.app.log.info('firebaseUser', firebaseUser);

    const { uid: authUid } = firebaseUser;

    const user = await this.getOneUser({ attribute: 'authUid', value: authUid });

    const { verifiedEmail } = user;
    if (!verifiedEmail) {
      throw throwError(`your email address is not verified.`, 412);
    }

    if (!user) {
      throw throwError(`can't get the user with authUid = ${authUid}`, 412);
    }

    // get the accestoken
    const { stsTokenManager: { accessToken } } = firebaseUser;

    return { ...user, accessToken };
  }

  /**
   * function to send the confirmation email
   *
   * @param {{ authUid: string }} { authUid }
   * @returns {Promise<string>} message id of the email
   * @memberof UserController
   */
  async sendConfirmationEmail ({ authUid }) {
    const user = await this.getOneUser({ attribute: 'authUid', value: authUid });
    if (!user) throw throwError(`can't the user.`, 412);

    const { firebaseAdminService } = this.app;
    const firebaseUser = await firebaseAdminService.getUserByUid({ uid: authUid });
    if (!firebaseUser) throw throwError(`can't the user in firebase.`, 412);

    const { verifiedEmail } = user;
    if (verifiedEmail) throw throwError(`email already confirmed.`, 412);

    const { id } = user;
    const verificationCodeController = new VerificationCodeController({ app: this.app });

    const verificationCode = await verificationCodeController.createVerificationCode({
      verificationCodeObj: {
        userId: id,
        expirationDate: moment().utc().add(1, 'd').toDate(),
        type: 'CONFIRMATION_EMAIL'
      }
    });

    const parameterController = new ParameterController({ app: this.app });

    const SELF_API_URL = await parameterController.getParameterValue({ name: 'SELF_API_URL' });

    const { fullName } = user;
    const { code } = verificationCode;

    const params = {
      user: {
        fullName
      },
      link: `${SELF_API_URL}users/confirm-email-address/${code}`
    };

    const html = generateHtmlByTemplate('confirmation-email', params);

    const CONFIRMATION_EMAIL_SUBJECT = await parameterController.getParameterValue({ name: 'CONFIRMATION_EMAIL_SUBJECT' });

    const { mailerService } = this.app;
    const { email } = user;
    const { messageId } = await mailerService.sendMail(
      [email],
      html,
      CONFIRMATION_EMAIL_SUBJECT,
      'awork-team'
    );

    return messageId;
  }

  /**
   * function to confir the email adress
   *
   * @param {{ code: string }} { code }
   * @returns {Promise<{ message: string, redirectUrl: string }>} message id of the email
   * @memberof UserController
   */
  async confirmEmailAddress ({ code }) {
    const verificationCodeController = new VerificationCodeController({ app: this.app });

    const isTheCodeValid = await verificationCodeController.validCode({ code });

    if (!isTheCodeValid) {
      throw throwError(`the code is not valid`, 412);
    }

    const { userId } = await verificationCodeController.getOneVerificationCode({
      attribute: 'code',
      value: code
    });

    const { verifiedEmail } = await this.getOneUser({
      attribute: 'id',
      value: userId
    });

    if (verifiedEmail) throw throwError(`the code was already used.`, 412);

    const parameterController = new ParameterController({ app: this.app });
    const WEB_BASE_URL = await parameterController.getParameterValue({ name: 'WEB_BASE_URL' });

    await this.updateOneUser({
      id: userId,
      user: { verifiedEmail: true }
    });

    await this.sendWelcomeEmail({ userId });

    return {
      message: `yes! you had confirmed your email addres, we'll send you a welcome email.`,
      redirectUrl: `${WEB_BASE_URL}login`
    };
  }

  async sendWelcomeEmail ({ userId }) {
    const user = await this.getOneUser({
      attribute: 'id',
      value: userId
    });

    if (!user) throw throwError(`can't get the user ${userId}.`, 412);

    const parameterController = new ParameterController({ app: this.app });

    const WEB_BASE_URL = await parameterController.getParameterValue({ name: 'WEB_BASE_URL' });

    const WELCOME_EMAIL_SUBJECT = await parameterController.getParameterValue({ name: 'WELCOME_EMAIL_SUBJECT' });

    const { fullName } = user;

    const params = {
      user: {
        fullName
      },
      link: `${WEB_BASE_URL}login`
    };

    const html = generateHtmlByTemplate('welcome-email', params);

    const { mailerService } = this.app;
    const { email } = user;
    const { messageId } = await mailerService.sendMail(
      [email],
      html,
      WELCOME_EMAIL_SUBJECT,
      'awork-team'
    );

    return messageId;
  }
}

module.exports = {
  UserController
};
