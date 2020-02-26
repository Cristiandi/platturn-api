/* eslint-disable no-useless-escape */

const companyPorperties = {
  id: { type: 'number' },
  name: { type: 'string', maxLength: 45 },
  code: { type: 'string', maxLength: 5 },
  document: { type: 'string', maxLength: 15 },
  email: { type: 'string', maxLength: 100, pattern: '[a-z0-9\._%+!$&*=^|~#%{}\\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,22})' },
  userId: { type: 'number' },
  created_at: { type: 'string' },
  updated_at: { type: 'string' }
};

const tags = ['companies'];

const paramsJsonSchema = {
  type: 'object',
  properties: {
    companyId: { type: 'number' }
  },
  required: ['companyId']
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
  properties: companyPorperties,
  required: ['name', 'code', 'document', 'email']
};

const bodyUpdateJsonSchema = {
  type: 'object',
  properties: companyPorperties
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
        properties: companyPorperties
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
      properties: companyPorperties
    }
  }
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
      properties: companyPorperties
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
      properties: companyPorperties
    }
  }
};

const deleteSchema = {
  tags,
  params: paramsJsonSchema,
  security: [
    { Bearer: [] }
  ],
  response: {
    200: {
      type: 'object',
      properties: companyPorperties
    }
  }
};

const getUserCompanies = {
  tags,
  security: [
    { Bearer: [] }
  ],
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: companyPorperties
      }
    }
  }
};

module.exports = {
  getAllSchema,
  getOneSchema,
  createSchema,
  updateSchema,
  deleteSchema,
  getUserCompanies
};
