import vine from '@vinejs/vine'

// ok
export const storeMovementConfigurationValidator = vine.compile(
  vine.object({
    code: vine.string().maxLength(10), // "GE00"
    description: vine.string().optional(),
  })
)

// ok
export const addMovementChainConfigurationValidator = vine.compile(
  vine.object({
    movementId: vine.number(),
    chainId: vine.number(),
    executionOrder: vine.number(),
  })
)

// ok
export const addMovementStepConfigurationValidator = vine.compile(
  vine.object({
    movementId: vine.number(),
    stepId: vine.number(),
  })
)

// ok
export const addMovementFileConfigurationValidator = vine.compile(
  vine.object({
    movementStepId: vine.number(),
    fileId: vine.number(),
    overridePhysicalName: vine.string().optional(),
    overrideCopybook: vine.string().optional(),
    isMonitored: vine.boolean(),
  })
)

// ok
export const addRuleConfigurationValidator = vine.compile(
  vine.object({
    movementFileId: vine.number(),
    message: vine.string(),
    targetField: vine.string().optional(),
    technicalDetails: vine.string().optional(),
    fixInstruction: vine.string().optional(),
  })
)
