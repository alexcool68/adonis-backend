import Factory from '@adonisjs/lucid/factories'
import Post from '#models/post'

export const PostFactory = Factory.define(Post, ({ faker }) => {
  return {
    title: faker.book.title(),
    content: faker.lorem.paragraph(),
    isPublished: faker.datatype.boolean(),
    slug: faker.lorem.slug(),
  }
}).build()
