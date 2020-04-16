const { PotentialLeadController } = require('../../../controllers/Potential-lead.controller')
const {
  createSchema
} = require('./schemas')

const potentialLeadRoutes = async (app, options) => {
  const potentialLeadController = new PotentialLeadController({ app })

  // create
  app.post(
    '/',
    {
      config: {
        rateLimit: {
          max: 3,
          timeWindow: '1m'
        }
      },
      schema: createSchema
    },
    async (request, reply) => {
      const { body } = request

      const createdPotentialLead = await potentialLeadController.createPotentialLead({ potentialLead: body })

      return reply.code(201).send(createdPotentialLead)
    }
  )
}

module.exports = potentialLeadRoutes
