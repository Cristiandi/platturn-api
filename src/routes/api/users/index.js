const { UserController } = require('../../../controllers/User.controller')
const { throwError } = require('../../../utils/functions')
const {
  createSchema,
  getOneSchema,
  loginSchema,
  sendConfirmationEmailSchema,
  confirmEmailAddressSchema,
  sendForgotPasswordEmailSchema,
  changePasswordFromCodeSchema,
  changePasswordSchema,
  changeEmailAddressSchema,
  updateUserDataSchema,
  getUserScreensSchema
} = require('./schemas')

const userRoutes = async (app, options) => {
  const { reqAuthPreHandler } = app
  if (!reqAuthPreHandler) throw new Error('can\'t get .reqAuthPreHandler from app.')

  const userController = new UserController({ app })

  // create
  app.post('/', { schema: createSchema }, async (request, reply) => {
    const { body } = request

    app.log.info('body', body)

    const created = await userController.createUser({ user: body })
    return reply.code(201).send(created)
  })

  // get one
  app.get('/:userId', { schema: getOneSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const { params: { userId } } = request

    app.log.info('-----------')
    app.log.info('userId', userId)
    app.log.info('-----------')

    const user = await userController.getOneUser({ attribute: 'id', value: userId })

    if (!user) {
      throw throwError(`can't get the user ${userId}.`, 412)
    }

    return user
  })

  // login
  app.post('/login', { schema: loginSchema }, async (request, reply) => {
    const { body } = request

    app.log.info('body', body)

    const result = await userController.login({ email: body.email, password: body.password })
    return result
  })

  // send confirmation email
  app.post('/send-confimation-email/:authUid', { schema: sendConfirmationEmailSchema }, async (request, reply) => {
    const { params: { authUid } } = request

    await userController.sendConfirmationEmail({ authUid })

    return reply.code(200).send({ message: 'we have sent you an email to confirm your email address.' })
  })

  // confirm email
  app.get('/confirm-email-address/:code', { schema: confirmEmailAddressSchema }, async (request, reply) => {
    const { params: { code } } = request

    const { redirectUrl } = await userController.confirmEmailAddress({ code })

    return reply.redirect(redirectUrl)
  })

  // send forgot password email
  app.post('/send-forgot-password-email', { schema: sendForgotPasswordEmailSchema }, async (request, reply) => {
    const { body: { email } } = request

    await userController.sendForgotPasswordEmail({ email })

    return reply.code(200).send({ message: 'we have sent you an email to reset your password.' })
  })

  // change password from code that was sended in the email
  app.post('/change-password-from-code', { schema: changePasswordFromCodeSchema }, async (request, reply) => {
    const { body: { code, password, repeatedPassword } } = request

    const result = await userController.changePasswordFromCode({ code, password, repeatedPassword })

    return reply.code(200).send({
      ...result,
      message: 'password changed, now you can login.'
    })
  })

  // change the password for a logged user
  app.post('/change-password', { schema: changePasswordSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const { user, body } = request
    if (!user) {
      throw throwError('can\'t get .user from request.', 412)
    }

    const { email } = user
    const { oldPassword, password, repeatedPassword } = body

    const result = await userController.changePassword({
      email,
      oldPassword,
      password,
      repeatedPassword
    })

    return {
      ...result,
      message: 'password changed.'
    }
  })

  // change the email for a logged user
  app.post('/change-email-address', { schema: changeEmailAddressSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const { body, user: { email: currentUserEmail } } = request

    const { email, repeatedEmail } = body

    const result = await userController.changeEmailAdress({
      oldEmail: currentUserEmail,
      email,
      repeatedEmail
    })

    return { ...result, message: 'email changed.' }
  })

  // change user the user data from the logged user
  app.patch('/update-user-data', { schema: updateUserDataSchema, preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    const { user, body } = request
    const updatedUserData = await userController.updateUserData({ currentUser: user, userData: body })
    return { ...updatedUserData, message: 'infomation updated.' }
  })

  // validate token
  app.get('/validate-token', { preHandler: [reqAuthPreHandler] }, async (request, reply) => {
    return reply.code(200).send()
  })

  // get user screens
  app.get(
    '/get-user-screens',
    { schema: getUserScreensSchema, preHandler: [reqAuthPreHandler] },
    async (request, reply) => {
      const { user } = request

      const screens = await userController.getUserScreens({ userId: user.id })

      return screens
    })
}

module.exports = userRoutes
