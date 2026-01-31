import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeCreate, beforeUpdate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import User from '#models/user_model'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare content: string

  @column()
  declare excerpt?: string | null

  @column()
  declare coverImage?: string | null

  @column()
  declare isPublished: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  // Génération automatique slug
  @beforeCreate()
  static async generateIdAndSlug(post: Post) {
    if (post.title) {
      post.slug = await post.generateUniqueSlug(post.title)
    }
  }

  @beforeUpdate()
  static async updateSlug(post: Post) {
    if (post.$dirty.title) {
      post.slug = await post.generateUniqueSlug(post.title)
    }
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    const suffix = (Math.random() * 36 ** 6) | 0
    let candidate = slug
    let count = 1

    while (await Post.findBy('slug', candidate)) {
      candidate = `${slug}-${suffix.toString(36)}`
      count++
      if (count > 10) break // sécurité
    }

    return candidate || `${slug}-${suffix.toString(36)}`
  }

  // Méthode helper
  public get previewUrl(): string {
    return `/posts/${this.slug}`
  }
}
