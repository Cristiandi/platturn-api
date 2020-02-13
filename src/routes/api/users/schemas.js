/* eslint-disable no-useless-escape */
const userProperties = {
  id: { type: 'number' },
  authUid: { type: 'string' },
  fullName: { type: 'string', maxLength: 100 },
  password: { type: 'string', maxLength: 100 },
  document: { type: 'string' },
  email: { type: 'string', pattern: '[a-z0-9\._%+!$&*=^|~#%{}\\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,22})' },
  address: { type: 'string', maxLength: 100 },
  phone: { type: 'number', maximum: 9999999999 },
  created_at: { type: 'string' },
  updated_at: { type: 'string' }
};

const tags = ['user'];

const paramsJsonSchema = {
  type: 'object',
  properties: {
    personId: { type: 'number' }
  },
  required: ['userId']
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
  properties: userProperties,
  required: ['fullName', 'document', 'email', 'password', 'address', 'phone']
};

const bodyUpdateJsonSchema = {
  type: 'object',
  properties: userProperties
};

const getAllSchema = {
  tags,
  querystring: queryStringJsonSchema,
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: userProperties
      }
    }
  }
};

const getOneSchema = {
  tags,
  params: paramsJsonSchema,
  querystring: queryStringJsonSchema,
  response: {
    200: {
      type: 'object',
      properties: userProperties
    }
  }
};

const createSchema = {
  tags,
  body: bodyCreateJsonSchema,
  response: {
    201: {
      type: 'object',
      properties: userProperties
    }
  }
};

const updateSchema = {
  tags,
  params: paramsJsonSchema,
  body: bodyUpdateJsonSchema,
  response: {
    200: {
      type: 'object',
      properties: userProperties
    }
  }
};

const deleteSchema = {
  tags,
  params: paramsJsonSchema,
  response: {
    200: {
      type: 'object',
      properties: userProperties
    }
  }
};

const loginSchema = {
  tags,
  body: {
    type: 'object',
    properties: {
      email: userProperties.email,
      password: userProperties.password
    },
    required: ['email', 'password']
  }
};

module.exports = {
  getAllSchema,
  getOneSchema,
  createSchema,
  updateSchema,
  deleteSchema,
  loginSchema
};