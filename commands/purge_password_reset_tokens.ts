import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class PurgePasswordResetTokens extends BaseCommand {
  static commandName = 'purge:password-reset-tokens'
  static description = 'Supprime les tokens de reset de mot de passe expirés de la base de données'

  static options: CommandOptions = {
    startApp: true, // Nécessaire pour accéder à la BDD
  }

  async run() {
    this.logger.info('Démarrage du nettoyage des tokens....')

    const now = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')

    // On supprime
    const count = (await db
      .from('password_reset_tokens')
      .where('expires_at', '<', now)
      .delete()) as unknown as number

    if (count > 0) {
      this.logger.success(`${count} tokens expirés ont été supprimés avec succès.`)
    } else {
      this.logger.info('Aucun token expiré trouvé. Tout est propre.')
    }
  }
}
