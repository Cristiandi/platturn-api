const environment = require('../environment');

const nodemailer = require('nodemailer');

class MailerService {
  constructor ({ app }) {
    this.app = app;
    this.nodeMailer = nodemailer;
  }

  /**
   * Function to create a ramdon account
   *
   * @returns {Promise<TestAccount>}
   * @memberof Mailer
   */
  createAccount () {
    return new Promise((resolve, reject) => {
      this.nodeMailer.createTestAccount((err, account) => {
        if (err) return reject(err);
        return resolve(account);
      });
    });
  }

  /**
   * function to create the trasporter to send the mail
   *
   * @returns {Promise<Transport>}
   * @memberof Mailer
   */
  createTransporter () {
    const transporter = this.nodeMailer.createTransport({
      host: environment.SMTP_HOST,
      port: environment.SMTP_PORT,
      secure: false,
      auth: {
        user: environment.SMTP_USER,
        pass: environment.SMTP_PW
      }
    });

    return transporter;
  }

  /**
   * function to send email
   *
   * @param {string[]} emails emails to
   * @param {string} stringHtml content for the mail
   * @param {string} [subject=''] subject for the mail
   * @param {string} [text='']
   * @param {string[]} arreglo de adjuntos
   * @returns {Promise<object>} object with the information
   * @memberof Mailer
   */
  async sendMail (emails, stringHtml, subject = '', text = '', attachments = []) {
    // const FROM_EMAIL = await getParameterValue('FROM_EMAIL');

    // this.app.log.info('---------------------------------');
    // this.app.log.info('emails', emails);
    // this.app.log.info('stringHtml', stringHtml);
    // this.app.log.info('---------------------------------');

    // TODO: use a parameter
    const FROM_EMAIL = 'no-reply@awork-team.co';

    const transporter = await this.createTransporter();

    this.app.log.info('environment.NODE_ENV', environment.NODE_ENV);

    const subjectTo = environment.NODE_ENV === 'production' ? subject : `${environment.NODE_ENV} | ${subject}`;

    this.app.log.info('subjectTo', subjectTo);

    const mailOptions = {
      from: FROM_EMAIL,
      to: emails.toString(),
      subject: subjectTo,
      text,
      html: stringHtml,
      attachments
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) return reject(err);
        this.app.log.info('---------------------------------');
        this.app.log.info('Message sent: %s', info.messageId);
        this.app.log.info('---------------------------------');
        return resolve(info);
      });
    });
  }
}

module.exports = {
  MailerService
};
