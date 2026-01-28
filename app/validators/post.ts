import vine from '@vinejs/vine'

/**
 * Validateur pour le store
 */
export const postValidator = vine.compile(
  vine.object({
    title: vine.string(),
    content: vine.string().maxLength(1000),
  })
)
