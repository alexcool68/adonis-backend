import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user_model'
import mail from '@adonisjs/mail/services/main'
import string from '@adonisjs/core/helpers/string'
import { DateTime } from 'luxon'
import { forgotPasswordAuthValidator, resetPasswordAuthValidator } from '#validators/auth_validator'

export default class PasswordResetController {
  async forgotPassword({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(forgotPasswordAuthValidator)

    const user = await User.findBy('email', email)

    if (user) {
      const token = string.random(64)

      await db.table('password_reset_tokens').insert({
        email: user.email,
        token: token,
        expires_at: DateTime.now().plus({ hours: 1 }).toFormat('yyyy-MM-dd HH:mm:ss'), // Valide 1h
        created_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
      })

      await mail.send((message) => {
        message.to(user.email).subject('Réinitialisation de mot de passe').html(`
            <p>Bonjour,</p>
            <p>Voici votre token de réinitialisation : <strong>${token}</strong></p>
            <p>Dans une vraie app, ce serait un lien cliquable.</p>
          `)
      })
    }

    return response.ok({ message: 'Si cet email existe, les instructions ont été envoyées.' })
  }

  async resetPassword({ request, response }: HttpContext) {
    const { token, password } = await request.validateUsing(resetPasswordAuthValidator)

    const record = await db
      .from('password_reset_tokens')
      .where('token', token)
      .where('expires_at', '>', DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'))
      .first()

    if (!record) {
      return response.badRequest({ message: 'Token invalide ou expiré.' })
    }

    const user = await User.findByOrFail('email', record.email)

    user.password = password

    await user.save()

    await db.from('password_reset_tokens').where('email', record.email).delete()

    return response.ok({ message: 'Mot de passe modifié avec succès !' })
  }
}
