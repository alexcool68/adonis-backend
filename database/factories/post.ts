import Factory from '@adonisjs/lucid/factories'
import Post from '#models/post_model'

export const PostFactory = Factory.define(Post, ({ faker }) => {
  return {
    title: faker.book.title(),
    content: faker.lorem.paragraph(),
    isPublished: faker.datatype.boolean(),
  }
}).build()
