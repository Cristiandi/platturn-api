const { APP_PORT } = require('../../environment');

module.exports = {
  routePrefix: '/documentation',
  exposeRoute: true,
  swagger: {
    info: {
      title: 'platurn api',
      description: 'docs',
      version: '0.1.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    servers: [
      { url: `http://localhost:${APP_PORT}/api`, description: 'local development' },
      { url: 'https://platturn-api-dev.herokuapp.com/api', description: 'development' },
      { url: 'https://platturn-api-sta.herokuapp.com/api', description: 'staging' },
      { url: 'https://pro.your-site.com', description: 'production' }
    ],
    schemes: ['http', 'https'],
    securityDefinitions: {
      Bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    },
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'user', description: 'User related end-points' }
    ]
  }
};
