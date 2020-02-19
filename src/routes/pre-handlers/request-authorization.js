const { throwError } = require('../../utils/functions');
const { UserController } = require('../../controllers/user-controller');

const API_KEY_PREFIX = '4cl';

/**
 * pre handler function to validate the token on some request
 *
 * @param {object} request
 * @param {object} reply
 */
const requestAuthorization = app => async (request, reply) => {
  const { headers } = request;

  const { authorization: authHeader = '' } = headers;

  const apiKey = authHeader.startsWith(API_KEY_PREFIX) ? authHeader : null;
  const token = !apiKey ? authHeader.split(' ')[1] : null;

  if (apiKey) app.log.info(`I'll implement this`);
  else if (token) {
    const { firebaseAdminService } = app;

    let verificationResult;
    try {
      verificationResult = await firebaseAdminService.verifyToken(token);
    } catch (error) {
      throw throwError(error.message, 401);
    }

    const { uid } = verificationResult;

    const userController = new UserController({ app });

    const user = await userController.getOneUser({ attribute: 'authUid', value: uid });

    if (!user) {
      throw throwError(`can't get the user`, 401);
    }
  } else {
    throw throwError('missing authorization header', 401);
  }
};

module.exports = {
  requestAuthorization
};
