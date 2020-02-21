/* eslint-disable no-useless-escape */
const userProperties = {
  id: { type: 'number' },
  authUid: { type: 'string' },
  fullName: { type: 'string', maxLength: 100 },
  password: { type: 'string', maxLength: 100 },
  document: { type: 'string' },
  email: { type: 'string', maxLength: 100, pattern: '[a-z0-9\._%+!$&*=^|~#%{}\\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,22})' },
  address: { type: 'string', maxLength: 100 },
  phone: { type: 'number', maximum: 9999999999 },
  created_at: { type: 'string' },
  updated_at: { type: 'string' }
};

const tags = ['users'];

const paramsJsonSchema = {
  type: 'object',
  properties: {
    userId: { type: 'number' }
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
  security: [
    { Bearer: [] }
  ],
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
  security: [
    { Bearer: [] }
  ],
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

const sendConfirmationEmailSchema = {
  tags,
  params: {
    type: 'object',
    properties: {
      authUid: { type: 'string' }
    },
    required: ['authUid']
  }
};

const confirmEmailAddressSchema = {
  tags,
  params: {
    type: 'object',
    properties: {
      code: { type: 'string' }
    },
    required: ['code']
  }
};

const sendForgotPasswordEmailSchema = {
  tags,
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', maxLength: 100, pattern: '[a-z0-9\._%+!$&*=^|~#%{}\\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,22})' }
    },
    required: ['email']
  }
};

module.exports = {
  getAllSchema,
  getOneSchema,
  createSchema,
  updateSchema,
  deleteSchema,
  loginSchema,
  sendConfirmationEmailSchema,
  confirmEmailAddressSchema,
  sendForgotPasswordEmailSchema
};
