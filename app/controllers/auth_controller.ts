import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)
    const user = await User.create(payload)
    const token = await User.accessTokens.create(user)
    logger.info(`[AUTH][REGISTER] - ${user.email}`)
    return response.created({
      type: 'bearer',
      token: token.value!.release(),
      user,
    })
  }

  async login({ request, auth, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)
    logger.info(`[AUTH][LOGIN] - ${user.email}`)
    return await auth.use('api').createToken(user)
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('api').invalidateToken()
    logger.info(`[AUTH][LOGOUT] - ${auth.user?.email}`)
    // return response.ok({})
  }

  async session({ request, auth, response }: HttpContext) {
    logger.info(`[AUTH][SESSION] - ${auth.user?.email}`)
    // auth.user contient l'utilisateur si la session est valide
    return response.ok({ user: auth.user })
  }
}
