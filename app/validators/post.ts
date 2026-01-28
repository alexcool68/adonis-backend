import vine from '@vinejs/vine'

/**
 * Validateur pour le store
 */
export const storeValidator = vine.compile(
  vine.object({
    title: vine.string(),
    content: vine.string().maxLength(1000),
  })
)

/**
 * Validateur pour le update
 */
export const updateValidator = vine.compile(
  vine.object({
    title: vine.string(),
    content: vine.string().maxLength(1000),
  })
)
