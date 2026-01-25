import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default class SystemController {
  async ping({ response }: HttpContext) {
    logger.info(`[SYSTEM][PING]`)
    return response.ok({
      messages: 'pong',
    })
  }
}
