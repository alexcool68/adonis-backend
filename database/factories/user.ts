import Factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { PostFactory } from './post.js'

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }
})
  .relation('posts', () => PostFactory)
  .build()
