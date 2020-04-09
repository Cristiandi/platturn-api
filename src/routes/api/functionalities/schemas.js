/* eslint-disable no-useless-escape */

const functionalityProperties = {
  id: { type: 'number' },
  name: { type: 'string', maxLength: 45 },
  code: { type: 'string', maxLength: 5 },
  created_at: { type: 'string' },
  updated_at: { type: 'string' }
}

const tags = ['functionalities']

const paramsJsonSchema = {
  type: 'object',
  properties: {
    functionalityId: { type: 'number' }
  },
  required: ['functionalityId']
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
  properties: functionalityProperties,
  required: ['name', 'code']
}

const bodyUpdateJsonSchema = {
  type: 'object',
  properties: functionalityProperties
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
      properties: functionalityProperties
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
        properties: functionalityProperties
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
      properties: functionalityProperties
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
      properties: functionalityProperties
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
