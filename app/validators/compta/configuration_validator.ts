import vine from '@vinejs/vine'

export const storeMovementConfigurationValidator = vine.compile(
  vine.object({
    code: vine.string().maxLength(10), // "GE00"
    description: vine.string().optional(),
  })
)

export const linkChainConfigurationValidator = vine.compile(
  vine.object({
    movementId: vine.number(),
    chainId: vine.number(),
    executionOrder: vine.number(),
  })
)

export const activateStepConfigurationValidator = vine.compile(
  vine.object({
    movementId: vine.number(),
    stepId: vine.number(),
  })
)

export const configureFileConfigurationValidator = vine.compile(
  vine.object({
    movementStepId: vine.number(), // ID retourné par l'étape 3
    stepFileId: vine.number(), // ID du fichier catalogue
    overridePhysicalName: vine.string().optional(),
    overrideCopybook: vine.string().optional(),
    isMonitored: vine.boolean(),
  })
)
// export const unConfigureFileConfigurationValidator = vine.compile(
//   vine.object({
//     movementStepId: vine.number(), // ID retourné par l'étape 3
//     stepFileId: vine.number(), // ID du fichier catalogue
//   })
// )

export const addRuleConfigurationValidator = vine.compile(
  vine.object({
    movementStepFileId: vine.number(), // ID retourné par l'étape 4
    message: vine.string(),
    targetField: vine.string().optional(),
    technicalDetails: vine.string().optional(),
    fixInstruction: vine.string().optional(),
  })
)
