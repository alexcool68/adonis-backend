import { Bouncer } from '@adonisjs/bouncer'
import User from '#models/user_model'
import Post from '#models/post_model'

export const createPost = Bouncer.ability((user: User | null) => {
  return !!user
})

export const editPost = Bouncer.ability((user: User | null, post: Post) => {
  if (!user) return false
  return user.id === post.userId || user.isAdmin
})

export const deletePost = Bouncer.ability((user: User | null, post: Post) => {
  if (!user) return false
  return user.id === post.userId || user.isAdmin
})
