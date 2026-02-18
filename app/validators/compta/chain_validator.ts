import vine from '@vinejs/vine'

export const storeChainValidator = vine.compile(
  vine.object({
    code: vine.string().maxLength(10),
    description: vine.string().optional(),
  })
)
export const updateChainValidator = vine.compile(
  vine.object({
    id: vine.number(),
    code: vine.string().maxLength(10),
    description: vine.string().optional(),
  })
)
