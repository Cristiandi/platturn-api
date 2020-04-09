const fastifyPlugin = require('fastify-plugin')

const { MailerService } = require('../services/mailer')

const mailerPlugin = async (app, options = {}) => {
  const mailerService = new MailerService({ app })
  app.decorate('mailerService', mailerService)
}

module.exports = fastifyPlugin(mailerPlugin)
