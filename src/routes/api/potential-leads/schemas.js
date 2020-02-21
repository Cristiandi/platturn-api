/* eslint-disable no-useless-escape */

const potentialLeadPorperties = {
  id: { type: 'number' },
  fullName: { type: 'string', maxLength: 100 },
  email: { type: 'string', maxLength: 100, pattern: '[a-z0-9\._%+!$&*=^|~#%{}\\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,22})' },
  phone: { type: 'number', maximum: 9999999999 },
  observation: { type: 'string', minLength: 20, maxLength: 200 }
};

const tags = ['potential-leads'];

const paramsJsonSchema = {
  type: 'object',
  properties: {
    potentialLeadId: { type: 'number' }
  },
  required: ['potentialLeadId']
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
  properties: potentialLeadPorperties,
  required: ['fullName', 'email']
};

const bodyUpdateJsonSchema = {
  type: 'object',
  properties: potentialLeadPorperties
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
        properties: potentialLeadPorperties
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
      properties: potentialLeadPorperties
    }
  }
};

const createSchema = {
  tags,
  body: bodyCreateJsonSchema,
  response: {
    201: {
      type: 'object',
      properties: potentialLeadPorperties
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
      properties: potentialLeadPorperties
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
      properties: potentialLeadPorperties
    }
  }
};

module.exports = {
  getAllSchema,
  getOneSchema,
  createSchema,
  updateSchema,
  deleteSchema
};
