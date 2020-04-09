/* eslint-disable no-useless-escape */

const routeProperties = {
  id: { type: 'number' },
  httpMethod: { type: 'string', maxLength: 10 },
  path: { type: 'string', maxLength: 200 },
  isPublic: { type: 'boolean' },
  created_at: { type: 'string' },
  updated_at: { type: 'string' }
}

const tags = ['routes']

const paramsJsonSchema = {
  type: 'object',
  properties: {
    routeId: { type: 'number' }
  },
  required: ['routeId']
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
  properties: routeProperties,
  required: ['httpMethod', 'path']
}

const bodyUpdateJsonSchema = {
  type: 'object',
  properties: routeProperties
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
      properties: routeProperties
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
        properties: routeProperties
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
      properties: routeProperties
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
      properties: routeProperties
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
      properties: routeProperties
    }
  }
}

module.exports = {
  createSchema,
  getAllSchema,
  getOneSchema,
  updateSchema,
  deleteSchema
}
