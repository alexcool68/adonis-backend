import vine from '@vinejs/vine'

/**
 * Validateur pour l'inscription
 */
export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().maxLength(100).optional(),
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    password: vine.string().minLength(8),
  })
)

/**
 * Validateur pour la connexion
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)

/**
 * Validateur pour la demande de mot de passe oublié
 * On vérifie juste que c'est un format d'email valide.
 */
export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)

/**
 * Validateur pour la réinitialisation finale
 * On vérifie le token et la solidité du nouveau mot de passe.
 */
export const resetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string(),
    password: vine.string().minLength(8),
    // Optionnel : .confirmed() si envoi "password_confirmation" depuis le front
  })
)
