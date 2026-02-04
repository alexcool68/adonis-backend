import vine from '@vinejs/vine'

export const storeChainCatalogValidator = vine.compile(
  vine.object({
    code: vine.string().maxLength(10),
    description: vine.string().optional(),
  })
)

export const storeStepCatalogValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(10),
    rank: vine.number(),
  })
)

export const storeStepFileCatalogValidator = vine.compile(
  vine.object({
    direction: vine.enum(['IN', 'OUT']),
    logicalName: vine.string(), // DDNAME
    defaultPhysicalName: vine.string().optional(),
    defaultCopybook: vine.string().optional(),
  })
)
