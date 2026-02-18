import vine from '@vinejs/vine'

export const storeStepValidator = vine.compile(
  vine.object({
    chainId: vine.number(),
    name: vine.string().maxLength(10),
    rank: vine.number(),
  })
)

export const updateStepValidator = vine.compile(
  vine.object({
    id: vine.number(),
    chainId: vine.number(),
    name: vine.string().maxLength(10),
    rank: vine.number(),
  })
)
