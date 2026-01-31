import vine from '@vinejs/vine'

export const createPostValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(255),
    content: vine.string().trim().minLength(10),
    excerpt: vine.string().trim().minLength(10).optional(),
    coverImage: vine.string().url().optional(),
    isPublished: vine.boolean(),
  })
)

export const updatePostValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(255),
    content: vine.string().trim().minLength(10),
    excerpt: vine.string().trim().minLength(10).optional(),
    coverImage: vine.string().url().optional(),
    isPublished: vine.boolean(),
  })
)

export const postQueryValidator = vine.compile(
  vine.object({
    page: vine.number().positive().optional(),
    perPage: vine.number().range([5, 100]).optional(),
    search: vine.string().maxLength(80).optional(),
    published: vine.enum(['true', 'false', 'all'] as const).optional(),
  })
)
