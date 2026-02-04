import User from '#models/user_model'
import {
  loginAuthValidator,
  registerAuthValidator,
  changeFullNameAuthValidator,
  updatePasswordValidator,
} from '#validators/auth_validator'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerAuthValidator)

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
      const { email, password } = await request.validateUsing(loginAuthValidator)
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
    const { fullName } = await request.validateUsing(changeFullNameAuthValidator)
    await auth.user?.merge({ fullName }).save()
    return response.ok({})
  }

  async updatePassword({ request, response, auth }: HttpContext) {
    // Vérifier que l'utilisateur est bien connecté
    const user = auth.user!

    // Validation avec injection des métadonnées
    const payload = await request.validateUsing(updatePasswordValidator, {
      meta: {
        user: user, // C'est ici qu'on passe l'utilisateur à la règle
      },
    })

    // Si on arrive ici, l'ancien mot de passe est valide !

    // Mise à jour du mot de passe
    user.password = payload.new_password
    await user.save()

    return response.ok({})
  }
}
