// app/validators/rules/verify_password.ts
import vine from '@vinejs/vine'
import hash from '@adonisjs/core/services/hash'
import { FieldContext } from '@vinejs/vine/types'

/**
 * Options que l'on pourrait passer à la règle (facultatif)
 */
type Options = undefined

/**
 * Fonction de validation asynchrone
 */
async function verifyPassword(value: unknown, _options: Options, field: FieldContext) {
  // 1. On s'assure que la valeur est une chaîne
  if (typeof value !== 'string') {
    return
  }

  // 2. On récupère l'utilisateur passé dans les métadonnées
  // Nous verrons comment passer ceci dans l'étape du contrôleur
  const user = field.meta.user

  if (!user) {
    // Si pas d'utilisateur, on arrête ou on lève une erreur selon votre logique
    return
  }

  // 3. On compare le mot de passe fourni avec le hash de l'utilisateur
  const isValid = await hash.verify(user.password, value)

  if (!isValid) {
    field.report('Le mot de passe actuel est incorrect.', 'verify_password', field)
  }
}

// Création de la règle Vine
export const verifyPasswordRule = vine.createRule(verifyPassword)
