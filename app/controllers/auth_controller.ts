import User from '#models/user'
import { loginValidator, registerValidator, changeFullNameValidator } from '#validators/auth'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)
    const user = await User.create(payload)
    const token = await User.accessTokens.create(user)

    return response.created({
      type: 'bearer',
      token: token.value!.release(),
      user,
    })
  }

  async login({ request, response, auth }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)
      const user = await User.verifyCredentials(email, password)
      return await auth.use('api').createToken(user)
    } catch (error) {
      // if (error instanceof errors.E_VALIDATION_ERROR) {
      // }
      return response.abort({
        status: 'error',
        errors: error.messages,
        message: 'Validation failed',
      })
    }
  }

  async logout({ response, auth }: HttpContext) {
    await auth.use('api').invalidateToken()

    return response.ok({})
  }

  async session({ auth, response }: HttpContext) {
    return response.ok({ user: auth.user })
  }

  async changeFullName({ request, auth, response }: HttpContext) {
    const { fullName } = await request.validateUsing(changeFullNameValidator)
    await auth.user?.merge({ fullName }).save()
    return response.ok({})
  }
}
