import { HttpContext } from '@adonisjs/core/http'
import { postValidator } from '#validators/post'

import Post from '#models/post'

export default class PostsController {
  async index({ response }: HttpContext) {
    const posts = await Post.all()
    return response.ok(posts)
  }

  async readByUserId({ auth, response }: HttpContext) {
    const posts = await Post.findManyBy('user_id', auth.user?.id)
    return response.ok(posts)
  }

  async store({ request, auth, response }: HttpContext) {
    const { title, content } = await request.validateUsing(postValidator)
    const post = await auth.user!.related('posts').create({ title, content })
    return response.created(post)
  }

  async update({ params, request, auth, response }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    const { title, content } = await request.validateUsing(postValidator)
    await auth.user!.related('posts').save(post.merge({ title, content }))
    return response.ok({})
  }

  async destroy({ params, response }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    await post.delete()
    return response.ok({})
  }
}
