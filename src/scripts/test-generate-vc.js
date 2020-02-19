
const moment = require('moment');

const app = require('../app');
const { VerificationCodeController } = require('../controllers/verification-code-controller');
const { generateHtmlByTemplate } = require('../utils/functions');

(async () => {
  await app.ready();
  const vcc = new VerificationCodeController({ app });

  // app.log.warn('date to send', moment().utc().add('d', 1).toDate());

  const cr = await vcc.createVerificationCode({
    verificationCodeObj: {
      userId: 6,
      type: 'CONFIRMATION_EMAIL',
      expirationDate: moment().utc().add(1, 'd').toDate()
    }
  });
  app.log.info('cr', cr);

  const params = { user: { fullName: 'Carlos Chica' }, link: 'https://platturn-api-dev.herokuapp.com/api/documentation' };
  const html = generateHtmlByTemplate('confirmation-email', params);

  const { mailerService } = app;
  await mailerService.sendMail(
    ['cardanito@gmail.com'],
    html,
    'Verificacion de email',
    'disfruta el desarrollo'
  );
})()
  .catch(err => console.error(err))
  .finally(() => app.close());
