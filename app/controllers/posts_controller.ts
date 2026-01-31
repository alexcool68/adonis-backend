import { HttpContext } from '@adonisjs/core/http'
import {
  createPostValidator,
  updatePostValidator,
  postQueryValidator,
} from '#validators/post_validator'

import { createPost, editPost, deletePost } from '#abilities/post_abilities'

import Post from '#models/post_model'

export default class PostsController {
  async index({ request, response }: HttpContext) {
    const validated = await request.validateUsing(postQueryValidator)

    const page = validated.page ?? 1
    const perPage = validated.perPage ?? 10

    const query = Post.query()
      .orderBy('created_at', 'desc')
      .preload('user', (q) => q.select('id', 'email', 'fullName'))

    // Recherche texte
    if (validated.search) {
      query.where((q) =>
        q
          .where('title', 'like', `%${validated.search}%`)
          .orWhere('content', 'like', `%${validated.search}%`)
      )
    }

    // Filtre publication
    if (validated.published === 'true') {
      query.where('is_published', true)
    } else if (validated.published === 'false') {
      query.where('is_published', false)
    }

    const posts = await query.paginate(page, perPage)

    return response.ok(posts.serialize())
  }

  async store({ request, bouncer, auth, response }: HttpContext) {
    //abilities
    if (await bouncer.denies(createPost)) {
      return response.forbidden('Cannot create a post')
    }

    const payload = await request.validateUsing(createPostValidator)

    const user = auth.user!

    const post = await user.related('posts').create({
      ...payload,
      isPublished: payload.isPublished ?? false,
    })

    return response.created(post)
  }

  async show({ params, response }: HttpContext) {
    try {
      const post = await Post.query()
        .where((q) => {
          q.where('id', params.id).orWhere('slug', params.id)
        })
        .preload('user', (q) => q.select('id', 'email', 'fullName'))
        .firstOrFail()

      return response.ok(post)
    } catch (error) {
      return response.notFound({ message: 'Article non trouvé' })
    }
  }

  async update({ params, request, bouncer, response }: HttpContext) {
    const post = await Post.findOrFail(params.id)

    //abilities
    if (await bouncer.denies(editPost, post)) {
      return response.forbidden('Cannot edit a post')
    }

    const payload = await request.validateUsing(updatePostValidator)

    post.merge(payload)
    await post.save()

    await post.load('user')

    return response.ok({
      data: post,
      message: 'Article mis à jour',
    })
  }

  async destroy({ params, bouncer, response }: HttpContext) {
    const post = await Post.findOrFail(params.id)

    //abilities
    if (await bouncer.denies(deletePost, post)) {
      return response.forbidden('Cannot delete a post')
    }

    await post.delete()

    return response.ok({ message: 'Article supprimé' })
  }
}
