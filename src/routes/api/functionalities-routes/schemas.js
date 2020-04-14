/* eslint-disable no-useless-escape */

const functionalityRouteProperties = {
  id: { type: 'number' },
  functionalityId: { type: 'number' },
  functionality: { type: 'string' },
  routeId: { type: 'number' },
  routePath: { type: 'string' },
  routeMethod: { type: 'string' },
  created_at: { type: 'string' },
  updated_at: { type: 'string' }
}

const tags = ['functionalities-routes']

const paramsJsonSchema = {
  type: 'object',
  properties: {
    screenId: { type: 'number' }
  },
  required: ['screenId']
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
  properties: functionalityRouteProperties,
  required: ['functionalityId', 'routeId']
}

const bodyUpdateJsonSchema = {
  type: 'object',
  properties: functionalityRouteProperties
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
      properties: functionalityRouteProperties
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
        properties: {
          ...functionalityRouteProperties,
          functionality: { type: 'string' }
        }
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
      properties: functionalityRouteProperties
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
      properties: functionalityRouteProperties
    }
  }
}

const deleteSchema = {
  tags,
  params: paramsJsonSchema,
  security: [
    { Bearer: [] }
  ]
}

module.exports = {
  getAllSchema,
  getOneSchema,
  createSchema,
  updateSchema,
  deleteSchema
}
