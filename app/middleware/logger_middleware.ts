import logger from '@adonisjs/core/services/logger'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class LoggerMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */

  async handle(ctx: HttpContext, next: NextFn, options: { run: boolean } = { run: false }) {
    const method = ctx.request.method()
    const url = ctx.request.url()
    options.run ? logger.info(`${method} - ${url}`) : null
    return next()
  }
}
