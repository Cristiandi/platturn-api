/* eslint-disable no-useless-escape */

const planProperties = {
  id: { type: 'number' },
  name: { type: 'string', maxLength: 45 },
  code: { type: 'string', maxLength: 5 },
  numberOfDays: { type: 'number' },
  created_at: { type: 'string' },
  updated_at: { type: 'string' }
}

const tags = ['plans']

const paramsJsonSchema = {
  type: 'object',
  properties: {
    planId: { type: 'number' }
  },
  required: ['companyId']
}

const queryStringJsonSchema = {
  type: 'object',
  properties: {
    filter: { type: 'string' }
  },
  required: ['filter']
}

const bodyCreateJsonSchema = {
  type: 'object',
  properties: planProperties,
  required: ['name', 'code', 'numberOfDays']
}

const bodyUpdateJsonSchema = {
  type: 'object',
  properties: planProperties
}

const createSchema = {
  tags,
  body: bodyCreateJsonSchema,
  security: [
    { Bearer: [] }
  ],
  response: {
    201: {
      type: 'object',
      properties: planProperties
    }
  }
}

const getAllSchema = {
  tags,
  querystring: queryStringJsonSchema,
  security: [
    { Bearer: [] }
  ],
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: planProperties
      }
    }
  }
}

const getOneSchema = {
  tags,
  params: paramsJsonSchema,
  querystring: queryStringJsonSchema,
  security: [
    { Bearer: [] }
  ],
  response: {
    200: {
      type: 'object',
      properties: planProperties
    }
  }
}

const updateSchema = {
  tags,
  params: paramsJsonSchema,
  body: bodyUpdateJsonSchema,
  security: [
    { Bearer: [] }
  ],
  response: {
    200: {
      type: 'object',
      properties: planProperties
    }
  }
}

const deleteSchema = {
  tags,
  params: paramsJsonSchema,
  security: [
    { Bearer: [] }
  ],
  response: {
    200: {
      type: 'object',
      properties: planProperties
    }
  }
}

module.exports = {
  getAllSchema,
  getOneSchema,
  createSchema,
  updateSchema,
  deleteSchema
}
