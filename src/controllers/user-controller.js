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
   * @returns {Promise<{ id: number, email:string, accessToken: string, authUid: string }>}
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

    // get the parameters needed
    const parameterController = new ParameterController({ app: this.app });
    const SELF_API_URL = await parameterController.getParameterValue({ name: 'SELF_API_URL' });
    const CONFIRMATION_EMAIL_SUBJECT = await parameterController.getParameterValue({ name: 'CONFIRMATION_EMAIL_SUBJECT' });

    // create the verification code row
    const { id } = user;
    const verificationCodeController = new VerificationCodeController({ app: this.app });
    const verificationCode = await verificationCodeController.createVerificationCode({
      verificationCodeObj: {
        userId: id,
        expirationDate: moment().utc().add(1, 'd').toDate(),
        type: 'CONFIRMATION_EMAIL'
      }
    });

    // define the parameters
    const { fullName } = user;
    const { code } = verificationCode;
    const params = {
      user: {
        fullName
      },
      link: `${SELF_API_URL}users/confirm-email-address/${code}`
    };

    // generate the html
    const html = generateHtmlByTemplate('confirmation-email', params);

    // send the email
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

    const isTheCodeValid = await verificationCodeController.validCode({
      code,
      type: 'CONFIRMATION_EMAIL'
    });

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

  /**
   * function to send the welcome user email
   *
   * @param {{ userId: number }} { userId }
   * @returns {Promise<string>} message id
   * @memberof UserController
   */
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

  /**
   * function to send the forgot password email
   *
   * @param {{ email: string }} { email }
   * @returns
   * @memberof UserController
   */
  async sendForgotPasswordEmail ({ email }) {
    // get the user
    const user = await this.getOneUser({
      attribute: 'email',
      value: email
    });
    // check
    if (!user) {
      throw throwError(`can't get the user with email ${email}.`, 412);
    }

    // get the user in firebase
    const { authUid } = user;
    const { firebaseAdminService } = this.app;
    const firebaseUser = await firebaseAdminService.getUserByUid({ uid: authUid });
    // check
    if (!firebaseUser) {
      throw throwError(`can't the user with email ${email} in firebase.`, 412);
    }

    // get the parameters needed
    const parameterController = new ParameterController({ app: this.app });
    const WEB_BASE_URL = await parameterController.getParameterValue({ name: 'WEB_BASE_URL' });
    const FORGOT_PASSWORD_EMAIL_SUBJECT = await parameterController.getParameterValue({ name: 'FORGOT_PASSWORD_EMAIL_SUBJECT' });

    const { id: userId } = user;

    // create the verification code row
    const verificationCodeController = new VerificationCodeController({ app: this.app });
    const verificationCode = await verificationCodeController.createVerificationCode({
      verificationCodeObj: {
        userId: userId,
        expirationDate: moment().utc().add(1, 'd').toDate(),
        type: 'FORGOT_PASSWORD'
      }
    });

    // define the parameters for the email template
    const { code } = verificationCode;
    const { fullName } = user;
    const params = {
      user: {
        fullName
      },
      link: `${WEB_BASE_URL}forgot-password/${code}`
    };

    // generate the html
    const html = generateHtmlByTemplate('forgot-password-email', params);

    // send the email
    const { mailerService } = this.app;
    const { messageId } = await mailerService.sendMail(
      [email],
      html,
      FORGOT_PASSWORD_EMAIL_SUBJECT,
      'awork-team'
    );

    return messageId;
  }

  /**
   * function to change the password from the code sended in sendForgotPasswordEmail
   *
   * @param {{ code: string, password: string, repeatedPassword: string }} { code, password, repeatedPassword }
   * @memberof UserController
   */
  async changePasswordFromCode ({ code, password, repeatedPassword }) {
    // check the passwords
    if (password !== repeatedPassword) {
      throw throwError(`the passwords don't match`, 412);
    }

    const verificationCodeController = new VerificationCodeController({ app: this.app });

    // check if the code is valid
    const isTheCodeValid = await verificationCodeController.validCode({
      code,
      type: 'FORGOT_PASSWORD'
    });

    if (!isTheCodeValid) {
      throw throwError(`the code is not valid.`, 412);
    }

    // get the user id from the verification code
    const { userId } = await verificationCodeController.getOneVerificationCode({
      attribute: 'code',
      value: code
    });

    // get the user
    const user = await this.getOneUser({
      attribute: 'id',
      value: userId
    });

    const { authUid } = user;

    // get the user in firebase
    const { firebaseAdminService } = this.app;
    const firebaseUser = await firebaseAdminService.getUserByUid({ uid: authUid });
    // check
    if (!firebaseUser) {
      throw throwError(`can't get the user in firebase.`, 412);
    }

    await firebaseAdminService.updateUser({ uid: authUid, attributes: { password } });

    this.sendPasswordChagedAlertEmail({ userId });

    return {
      userId,
      passwordChanged: true
    };
  }

  /**
   * function to get the send the password changed alert email
   *
   * @param {{ userId: number }} { userId }
   * @returns {Promise<string>} message id
   * @memberof UserController
   */
  async sendPasswordChagedAlertEmail ({ userId }) {
    const user = await this.getOneUser({
      attribute: 'id',
      value: userId
    });

    if (!user) throw throwError(`can't get the user ${userId}.`, 412);

    const parameterController = new ParameterController({ app: this.app });
    const PASSWORD_CHANGED_ALERT_SUBJECT = await parameterController.getParameterValue({ name: 'PASSWORD_CHANGED_ALERT_SUBJECT' });

    const { fullName } = user;

    const params = {
      user: {
        fullName
      }
    };

    const html = generateHtmlByTemplate('password-changed-alert-email', params);

    const { mailerService } = this.app;
    const { email } = user;
    const { messageId } = await mailerService.sendMail(
      [email],
      html,
      PASSWORD_CHANGED_ALERT_SUBJECT,
      'awork-team'
    );

    return messageId;
  }

  /**
   * function to change the password
   *
   * @param {{ email: string, oldPassword: string, password: string, repeatedPassword: string }} { email, oldPassword, password, repeatedPassword }
   * @returns
   * @memberof UserController
   */
  async changePassword ({ email, oldPassword, password, repeatedPassword }) {
    // check the passwords
    if (password !== repeatedPassword) {
      throw throwError(`the passwords don't match.`, 412);
    }

    // login the user with the old password
    const { id: userId, authUid } = await this.login({
      email,
      password: oldPassword
    });

    // change the password
    const { firebaseAdminService } = this.app;
    await firebaseAdminService.updateUser({ uid: authUid, attributes: { password } });

    // login the user with the new password
    const { accessToken } = await this.login({
      email,
      password
    });

    // the the alert email
    this.sendPasswordChagedAlertEmail({ userId });

    return { accessToken };
  }

  /**
   * function to change the email
   *
   * @param {{ oldEmail: string, email: string, repeatedEmail: string }} { oldEmail, email, repeatedEmail }
   * @memberof UserController
   */
  async changeEmailAdress ({ oldEmail, email, repeatedEmail }) {
    if (oldEmail === email) {
      throw throwError(`the email can't be the current email.`, 412);
    }
    if (email !== repeatedEmail) {
      throw throwError(`the emails don't match.`, 412);
    }

    // get the user
    const user = await this.getOneUser({
      attribute: 'email',
      value: oldEmail
    });
    // check
    if (!user) {
      throw throwError(`can't get the user.`, 412);
    }

    const { authUid } = user;

    // get the firebase user
    const { firebaseAdminService } = this.app;
    const firebaseUser = await firebaseAdminService.getUserByUid({ uid: authUid });
    if (!firebaseUser) {
      throw throwError(`can't get the firebase user.`, 412);
    }

    // update the email
    await firebaseAdminService.updateUser({ uid: authUid, attributes: { email } });

    const { id: userId } = user;

    await this.updateOneUser({
      id: userId,
      user: {
        email: email,
        verifiedEmail: false
      }
    });

    // send the alert email
    this.sendEmailAdressChangedEmail({ oldEmail, userId });

    // send the confirmation email
    this.sendConfirmationEmail({ authUid });

    return {
      userId,
      emailChanged: true
    };
  }

  /**
   * function to send an email to altert the email changed event
   *
   * @param {{ oldEmail: string, userId: number }} { oldEmail, userId }
   * @returns
   * @memberof UserController
   */
  async sendEmailAdressChangedEmail ({ oldEmail, userId }) {
    // get the user
    const user = await this.getOneUser({
      attribute: 'id',
      value: userId
    });
    if (!user) {
      throw throwError(`can't get the user.`, 412);
    }

    const { fullName } = user;

    const params = {
      user: {
        fullName
      }
    };

    const html = generateHtmlByTemplate('email-changed-alert-email', params);

    const parameterController = new ParameterController({ app: this.app });
    const EMAIL_ADDRESS_CHANGED_ALERT_SUBJECT = await parameterController.getParameterValue({ name: 'EMAIL_ADDRESS_CHANGED_ALERT_SUBJECT' });

    const { mailerService } = this.app;
    const { messageId } = await mailerService.sendMail(
      [oldEmail],
      html,
      EMAIL_ADDRESS_CHANGED_ALERT_SUBJECT,
      'awork-team'
    );

    return messageId;
  }
}

module.exports = {
  UserController
};
