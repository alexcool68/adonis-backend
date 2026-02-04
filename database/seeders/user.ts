import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { UserFactory } from '#database/factories/user'

import User from '#models/user_model'

export default class MainSeeder extends BaseSeeder {
  public async run() {
    await User.create({
      email: 'alexcool68@free.fr',
      password: '123456789',
      fullName: 'Alexis LEROY',
      isAdmin: true,
    })
    await UserFactory.with('posts', 2).createMany(5)
  }
}
