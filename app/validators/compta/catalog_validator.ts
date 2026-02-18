import vine from '@vinejs/vine'

// ok
export const storeStepCatalogValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(10),
    rank: vine.number(),
  })
)

// ok
export const storeStepFileCatalogValidator = vine.compile(
  vine.object({
    direction: vine.enum(['IN', 'OUT']),
    logicalName: vine.string(), // DDNAME
    defaultPhysicalName: vine.string().optional(),
    defaultCopybook: vine.string().optional(),
  })
)
