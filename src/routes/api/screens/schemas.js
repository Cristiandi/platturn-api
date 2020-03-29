/* eslint-disable no-useless-escape */

const screenProperties = {
  id: { type: 'number' },
  name: { type: 'string', maxLength: 50 },
  path: { type: 'string', maxLength: 200 },
  relativePath: { type: 'string', maxLength: 200 },
  functionalityId: { type: 'number' },
  created_at: { type: 'string' },
  updated_at: { type: 'string' }
};

const tags = ['screens'];

const paramsJsonSchema = {
  type: 'object',
  properties: {
    screenId: { type: 'number' }
  },
  required: ['screenId']
};

const queryStringJsonSchema = {
  type: 'object',
  properties: {
    filter: { type: 'string' }
  },
  required: ['filter']
};

const bodyCreateJsonSchema = {
  type: 'object',
  properties: screenProperties,
  required: ['name', 'path', 'functionalityId']
};

const bodyUpdateJsonSchema = {
  type: 'object',
  properties: screenProperties
};

const createSchema = {
  tags,
  body: bodyCreateJsonSchema,
  security: [
    { Bearer: [] }
  ],
  response: {
    201: {
      type: 'object',
      properties: screenProperties
    }
  }
};

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
          ...screenProperties,
          functionality: { type: 'string' }
        }
      }
    }
  }
};

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
      properties: screenProperties
    }
  }
};

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
      properties: screenProperties
    }
  }
};

const deleteSchema = {
  tags,
  params: paramsJsonSchema,
  security: [
    { Bearer: [] }
  ]
};

module.exports = {
  getAllSchema,
  getOneSchema,
  createSchema,
  updateSchema,
  deleteSchema
};
