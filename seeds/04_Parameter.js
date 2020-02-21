const environment = require('../src/environment');

const seed = async (knex) => {
  const parameters = [
    {
      id: 1,
      name: 'SELF_API_URL',
      value: environment.SELF_API_URL,
      description: 'self apir url'
    },
    {
      id: 2,
      name: 'CONFIRMATION_EMAIL_SUBJECT',
      value: 'Confirmación de email',
      description: 'confirmation email subject'
    },
    {
      id: 3,
      name: 'FROM_EMAIL',
      value: 'no-reply@awork-team.co',
      description: 'email address used to send the mails'
    },
    {
      id: 4,
      name: 'WEB_BASE_URL',
      value: environment.WEB_BASE_URL,
      description: 'platturn web base url'
    },
    {
      id: 5,
      name: 'WELCOME_EMAIL_SUBJECT',
      value: 'Gracias por confirmar tu email!',
      description: 'platturn web base url'
    },
    {
      id: 6,
      name: 'POTENTIAL_LEAD_EMAIL_SUBJECT',
      value: 'Gracias por tu interes!',
      description: 'potential lead email subject'
    },
    {
      id: 7,
      name: 'FORGOT_PASSWORD_EMAIL_SUBJECT',
      value: 'Olvidaste tu clave...',
      description: 'forgot password email subject'
    }
  ];

  const promises = parameters.map(async parameter => {
    const rows = await knex('Parameter').select('id').where('name', parameter.name);
    if (rows.length === 0) {
      const id = (await knex('Parameter').insert(parameter))[0];
      return { id };
    } else {
      await knex('Parameter')
        .update({
          value: parameter.value
        })
        .where({
          name: parameter.name
        });
    }
    return { ...rows[0] };
  });

  await Promise.all(promises);
};

module.exports = {
  seed
};
