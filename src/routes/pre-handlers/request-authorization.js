const { pathToRegexp } = require('path-to-regexp')

const { throwError } = require('../../utils/functions')
const { UserController } = require('../../controllers/User.controller')
const { RouteControllor } = require('../../controllers/Route.controller')

const API_KEY_PREFIX = '4cl'

/**
 * function to get the user by token
 *
 * @param {object} app
 * @param {string} token
 * @returns {Promise<object>}
 */
const getTheUserByToken = async (app, token) => {
  const { firebaseAdminService } = app

  let verificationResult
  try {
    verificationResult = await firebaseAdminService.verifyToken(token)
  } catch (error) {
    throw throwError(error.message, 401)
  }

  const { uid } = verificationResult

  const userController = new UserController({ app })

  const user = await userController.getOneUser({ attribute: 'authUid', value: uid })

  if (!user) {
    throw throwError('can\'t get the user', 401)
  }

  return user
}

const canTheUserHaveThis = async ({ app, userId, url, method }) => {
  const userController = new UserController({ app })

  // get the user roles
  const roles = await userController.getAssignedRoles({ userId })
  if (!roles.length) {
    throw throwError('the user doesn\'t have roles.', 403)
  }

  // get the routes
  const routeController = new RouteControllor({ app })
  const routes = await routeController.getAllRoutes({})
  if (!routes.length) {
    throw throwError('can\'t the routes.', 500)
  }

  // try to get the requested route
  const opts = {
    strict: true,
    sensitive: true,
    end: true,
    decode: decodeURIComponent
  }

  let requestedRoute = null
  for (const route of routes) {
    const keys = []
    const regexp = pathToRegexp(route.path, keys, opts)

    const urlToCheck = url.split('?')[0]

    const result = regexp.exec(urlToCheck)
    if (result && route.httpMethod === method) {
      requestedRoute = route
      break
    }
  }

  // app.log.info('requestedRoute', requestedRoute);

  // check the route
  if (!requestedRoute) {
    throw throwError('can\'t get the requested route.', 412)
  }
  if (requestedRoute.isPublic) return true

  // determine if can access to the route
  const canAccessToRoute = await routeController.canAccessToRoute({
    routeId: requestedRoute.id,
    roleIds: roles.map(item => item.id)
  })

  return canAccessToRoute
}

/**
 * pre handler function to validate the token on some request
 *
 * @param {object} request
 * @param {object} reply
 */
const requestAuthorization = app => async (request, reply) => {
  const { headers } = request

  const { authorization: authHeader = '' } = headers

  const apiKey = authHeader.startsWith(API_KEY_PREFIX) ? authHeader : null
  const token = !apiKey ? authHeader.split(' ')[1] : null

  if (apiKey) app.log.info('I\'ll implement this')
  else if (token) {
    const user = await getTheUserByToken(app, token)

    const { raw: { url, method } } = request
    // app.log.info('----------------')
    // app.log.info(method)
    // app.log.info('----------------')
    if (!await canTheUserHaveThis({ app, userId: user.id, url, method })) {
      throw throwError('sorry, u can\'t have this.', 403)
    }

    request.user = user
  } else {
    throw throwError('missing authorization header', 401)
  }
}

module.exports = {
  requestAuthorization
}
