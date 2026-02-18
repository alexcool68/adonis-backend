import vine from '@vinejs/vine'

export const storeFileValidator = vine.compile(
  vine.object({
    stepId: vine.number(),
    direction: vine.enum(['IN', 'OUT']),
    logicalName: vine.string(),
    defaultPhysicalName: vine.string().optional(),
    defaultCopybook: vine.string().optional(),
  })
)
export const updateFileValidator = vine.compile(
  vine.object({
    id: vine.number(),
    stepId: vine.number(),
    direction: vine.enum(['IN', 'OUT']),
    logicalName: vine.string(),
    defaultPhysicalName: vine.string().optional(),
    defaultCopybook: vine.string().optional(),
  })
)
