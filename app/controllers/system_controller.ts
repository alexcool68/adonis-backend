import { UserFactory } from '#database/factories/user'
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class SystemController {
  async ping({ response }: HttpContext) {
    return response.ok({
      messages: 'pong',
    })
  }

  async seedUser({ response }: HttpContext) {
    const users = await UserFactory.with('posts', 3).createMany(10)
    return response.created(users)
  }

  async reset({ response }: HttpContext) {
    const users = await User.query().andWhereNot('email', 'alexcool68@free.fr').delete()
    return response.ok(users)
  }
}
